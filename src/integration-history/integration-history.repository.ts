import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import * as _ from 'lodash';
import { DataSource, Raw, Repository } from 'typeorm';

import { ListHistoryDto } from './integration-history.dtos';

@Injectable()
export class IntegrationHistoryRepository extends Repository<IntegrationHistory> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(IntegrationHistory, dataSource.createEntityManager());
  }

  async list(data: ListHistoryDto): Promise<IntegrationHistory[]> {
    const { type, integrationId, clientId } = data;

    return await this.find({
      where: {
        type,
        integration: {
          clientId: clientId || Raw(() => 'true'),
          integrationId: integrationId || Raw(() => 'true'),
        },
      },
      relations: [
        'integration',
        'integration.integration',
        'integration.client',
        'integration.client.profile',
      ],
    });
  }
}
