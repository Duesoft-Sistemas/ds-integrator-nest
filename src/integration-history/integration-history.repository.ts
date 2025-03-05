import * as _ from 'lodash';
import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Raw, Repository } from 'typeorm';
import { instanceToPlain } from 'class-transformer';
import { Client } from '@entities/clients/clients.entity';
import { User } from '@entities/users/users.entity';

@Injectable()
export class IntegrationHistoryRepository extends Repository<IntegrationHistory> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(IntegrationHistory, dataSource.createEntityManager());
    }

    async listByClient(
        clientIntegrationId: number,
        type?: IntegrationHistoryType,
    ): Promise<IntegrationHistory[]> {
        return await this.find({
            where: { clientIntegrationId, type: type ?? Raw(() => 'true') },
            select: ['id', 'entity', 'message', 'integration', 'operation', 'type', 'integration'],
        });
    }

    async listByType(type: IntegrationHistoryType): Promise<IntegrationHistory[]> {
        const result = await this.createQueryBuilder('history')
            .innerJoinAndSelect('history.integration', 'integration')
            .innerJoinAndSelect('integration.client', 'client')
            .innerJoinAndSelect('client.profile', 'profile')
            .where('history.type = :type', { type })
            .getMany();

        return (instanceToPlain(result) as IntegrationHistory[]).map(item => {
            const { integration: { client: clientData }, ...rest } = item;

            const history = _.pick(rest, ['id', 'type', 'created_at', 'updated_at', 'entity', 'operation', 'message']);
            const client = _.pick(clientData, ['id', 'name', 'cnpj', 'is_active']);

            return {
                ...history as IntegrationHistory,
                client: { ...client, email: clientData.profile.email }
            };
        });
    }
}
