import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Client } from '@entities/clients/clients.entity';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateClientDto } from './clients.dtos';
import { User } from '@entities/users/users.entity';

@Injectable()
export class ClientRepository extends Repository<Client> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(Client, dataSource.createEntityManager());
    }

    async findIntegrationFromClient(
        clientId: number,
        integrationId: number,
    ): Promise<ClientIntegrations> {
        const queryBuilder = this.createQueryBuilder('client')
            .leftJoinAndSelect('client.integrations', 'clientIntegrations')
            .leftJoinAndSelect('clientIntegrations.integration', 'integration')
            .where(
                'client.isActive = :isActive AND clientIntegrations.isActive = :isActive AND client.id = :clientId AND integration.id = :integrationId',
                { clientId, integrationId, isActive: true },
            )
            .select(['client', 'clientIntegrations']);

        const register = await queryBuilder.getOne();

        if (!register || !register.integrations.length) {
            throw new NotFoundException(`Integração ID ${integrationId} não encontrada`);
        }

        return register.integrations[0];
    }

    async findByCnpj(cnpj: string): Promise<Client | null> {
        return await this.findOne({ where: { cnpj }, relations: ['profile', 'integrations'] });
    }

    async findById(id: number): Promise<Client | null> {
        return await this.findOne({ where: { id }, relations: ['profile', 'integrations'] });
    }

    async register(data: CreateClientDto, password: string, user: User): Promise<Client> {
        const { email, integrations: integrationIds, ...rest } = data;

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const profile = queryRunner.manager.create(User, { email, password });
            profile.name = data.name;
            profile.user_id = user.id;

            await queryRunner.manager.save(profile);

            const client = queryRunner.manager.create(Client, rest);
            client.user_id = user.id;
            client.profile_id = profile.id;
            client.integrations = integrationIds.map((id) => ({
                integration_id: id,
            })) as ClientIntegrations[];

            await queryRunner.manager.save(client);
            await queryRunner.commitTransaction();

            return client;
        } catch (ex) {
            await queryRunner.rollbackTransaction();

            throw new InternalServerErrorException(
                `Falha ao cadastrar cliente. ${(ex as Error).message}`,
            );
        } finally {
            await queryRunner.release();
        }
    }
}
