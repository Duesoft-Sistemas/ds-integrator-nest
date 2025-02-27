import * as _ from 'lodash';
import { Client } from '@entities/clients/clients.entity';
import { User } from '@entities/users/users.entity';
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

@Injectable()
export class ClientsService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        private readonly userRepository: UserRepository,
        private readonly clientRepository: ClientRepository,
        private readonly cryptoService: CryptoService,
    ) {}

    async create(data: CreateClientDto, user: Payload): Promise<Client | { password: any }> {
        const { email, integrations: integrationIds, ...rest } = data;

        let client = await this.clientRepository.findByCnpj(data.cnpj);

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
        }

        let profile = await this.userRepository.findByEmail(email);

        if (profile) {
            throw new ConflictException(`E-mail ${email} já registrado`);
        }

        const password = this.cryptoService.generatePassword();
        const passwordEncrypted = await this.cryptoService.encrypt(password);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            profile = queryRunner.manager.create(User, { email, password });
            profile.name = data.name;
            profile.user_id = user.id;
            await queryRunner.manager.save(profile);

            client = queryRunner.manager.create(Client, rest);
            client.user_id = user.id;
            client.profile_id = profile.id;
            client.integrations = integrationIds.map((id) => ({
                integration_id: id,
            })) as ClientIntegrations[];
            await queryRunner.manager.save(client);

            await queryRunner.commitTransaction();
            return { ..._.omit(client, 'integrations'), password: passwordEncrypted };
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao cadastrar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }
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
            client.integrations = integrationIds.map((id) => ({
                integration_id: id,
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

        return await this.clientRepository.findBy({ isActive: only_active || Raw(() => 'true') });
    }

    async findByCnpj(data: FindClientDto): Promise<Client> {
        const { cnpj } = data;

        const client = await this.clientRepository.findByCnpj(cnpj);

        if (!client) throw new NotFoundException(`Cliente com CNPJ ${cnpj} não encontrado`);

        return client;
    }
}
