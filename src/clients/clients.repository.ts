import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Client } from '@entities/clients/clients.entity';
import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

@Injectable()
export class ClientRepository extends Repository<Client> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(Client, dataSource.createEntityManager());
    }

    async findIntegrationFromClient(
        clientId: number,
        integrationKey: IntegrationKey,
    ): Promise<ClientIntegrations> {
        const queryBuilder = this.createQueryBuilder('client')
            .leftJoinAndSelect('client.integrations', 'clientIntegrations')
            .leftJoinAndSelect('clientIntegrations.integration', 'integration')
            .where(
                'client.isActive = :isActive AND clientIntegrations.isActive = :isActive AND client.id = :clientId AND integration.key = :integrationKey',
                { clientId, integrationKey, isActive: true },
            )
            .select(['client', 'clientIntegrations']);

        const register = await queryBuilder.getOne();

        if (!register || !register.integrations.length) {
            throw new NotFoundException(`Integração ${integrationKey} não encontrada`);
        }

        return register.integrations[0];
    }
}
