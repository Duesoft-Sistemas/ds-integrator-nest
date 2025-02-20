import * as _ from 'lodash';
import { Client } from '@entities/clients/clients.entity';
import { User } from '@entities/users/users.entity';
import {
    ConflictException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { Payload } from 'src/auth/auth.dtos';
import {
    CreateClientDto,
    DeleteClientDto,
    ListClientDto,
    UpdateClientDto,
} from 'src/clients/clients.dtos';
import { CryptoService } from 'src/crypto/crypto.service';
import { DataSource, In, IsNull, Not, Repository } from 'typeorm';
import { ClientIntegrations } from '@entities/clients/client.integrations.entity';

@Injectable()
export class ClientsService {
    constructor(
        @InjectDataSource() private readonly dataSource: DataSource,
        @InjectRepository(Client) private readonly clientRepository: Repository<Client>,
        private readonly cryptoService: CryptoService,
    ) {}

    async create(data: CreateClientDto, user: Payload): Promise<Client | { password: any }> {
        const { email, integrations: integrationIds, ...rest } = data;

        let client = await this.clientRepository.findOneBy({ cnpj: data.cnpj });

        if (client) {
            throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
        }

        const password = this.cryptoService.generatePassword();
        const passwordEncrypted = await this.cryptoService.encrypt(password);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const userToCreate = { user, email, password, name: data.name.split(' ')[0] };
            const profile = queryRunner.manager.create(User, userToCreate);
            await queryRunner.manager.save(profile);

            const integrations = integrationIds.map((id) => ({ integration_id: id }));
            const clientToCreate = { ...rest, user, profile, integrations };

            client = queryRunner.manager.create(Client, clientToCreate);
            await queryRunner.manager.save(client);

            await queryRunner.commitTransaction();
            return {
                ..._.omit(client, 'user', 'profile', 'integrations'),
                password: passwordEncrypted,
            };
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

        client = await this.clientRepository.findOne({
            where: { id, deletedAt: IsNull() },
            relations: ['profile', 'integrations'],
        });

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

        const client = await this.clientRepository.findOne({
            where: { id },
            relations: ['profile'],
        });

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

        return await this.clientRepository.findBy({
            deletedAt: IsNull(),
            isActive: only_active || In([true, false]),
        });
    }

    async findByUser(userId: number): Promise<Client> {
        return await this.clientRepository.findOneByOrFail({ user_id: userId });
    }
}
