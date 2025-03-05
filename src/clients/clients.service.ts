import * as _ from 'lodash';
import { Client } from '@entities/clients/clients.entity';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Payload } from 'src/auth/auth.dtos';
import {
    CreateClientDto,
    DeleteClientDto,
    FindClientDto,
    ListClientDto,
    UpdateClientDto,
} from 'src/clients/clients.dtos';
import { CryptoService } from 'src/crypto/crypto.service';
import { DataSource, Not, Raw } from 'typeorm';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { ClientRepository } from './clients.repository';
import { UserRepository } from 'src/users/users.repository';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ClientsService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository,
        private readonly cryptoService: CryptoService,
    ) {}

    async create(data: CreateClientDto, user: Payload): Promise<Client | { password: string }> {
        let client = await this.clientRepository.findByCnpj(data.cnpj);

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
        }

        const profile = await this.userRepository.findByEmail(data.email);

        if (profile) {
            throw new ConflictException(`E-mail ${profile.email} já registrado`);
        }

        const password = this.cryptoService.generatePassword();
        const passwordEncrypted = await this.cryptoService.encrypt(password);

        client = await this.clientRepository.register(data, password, user);
        return { ...client, password: passwordEncrypted };
    }

    async update(id: number, data: UpdateClientDto): Promise<Partial<Client>> {
        const { integrations: integrationIds } = data;

        let client = await this.clientRepository.findOne({
            where: { id: Not(id), cnpj: data.cnpj },
        });

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
        }

        client = await this.clientRepository.findById(id);

        if (!client) {
            throw new NotFoundException('Cliente não encontrado');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const integrationsToDelete = client.integrations;

            client.cnpj = data.cnpj;
            client.name = data.name;
            client.profile.name = data.name;
            client.profile.email = data.email;
            client.integrations = integrationIds.map((integrationId) => ({
                integrationId,
            })) as ClientIntegrations[];

            await queryRunner.manager.delete(ClientIntegrations, integrationsToDelete);
            await queryRunner.manager.save(client);
            await queryRunner.manager.save(client.profile);

            await queryRunner.commitTransaction();
            return _.omit(client, 'profile', 'integrations');
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao atualizar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }
    }

    async delete(data: DeleteClientDto): Promise<void> {
        const { id } = data;

        const client = await this.clientRepository.findById(id);

        if (!client) {
            throw new NotFoundException('Cliente não encontrado');
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            client.isActive = false;
            client.deletedAt = new Date();
            client.profile.isActive = false;
            client.profile.deletedAt = new Date();

            await queryRunner.manager.save(client);
            await queryRunner.manager.save(client.profile);

            await queryRunner.commitTransaction();
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao cadastrar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }

        await this.clientRepository.update(id, { deletedAt: new Date(), isActive: false });
    }

    async list(data: ListClientDto): Promise<Client[]> {
        const { only_active } = data;

        const result = await this.clientRepository.find({
            where: { isActive: only_active || Raw(() => 'true') },
            relations: ['profile', 'integrations', 'integrations.integration'],
        });
        
        return (instanceToPlain(result) as Client[]).map(item => {
            const integrations = item.integrations.map(integration => ({
                ..._.pick(integration, ['id', 'is_active']),
                ..._.pick(integration.integration, ['name', 'key', 'photo']),
            })) as ClientIntegrations[];
            
            return {
                ..._.pick(item, ['id', 'name', 'cnpj']) as Client,
                integrations,
            };
        });
    }

    async findByCnpj(data: FindClientDto): Promise<Client> {
        const { cnpj } = data;

        const client = await this.clientRepository.findByCnpj(cnpj);

        if (!client) throw new NotFoundException(`Cliente com CNPJ ${cnpj} não encontrado`);

        return client;
    }
}
