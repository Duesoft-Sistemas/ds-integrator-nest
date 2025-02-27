import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Client } from '@entities/clients/clients.entity';
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
}
