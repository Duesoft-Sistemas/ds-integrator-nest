import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ListHistoryDto } from '../dtos/list-integration-history.dto';

@Injectable()
export class IntegrationHistoryRepository extends Repository<IntegrationHistory> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(IntegrationHistory, dataSource.createEntityManager());
  }

  async list(data: ListHistoryDto): Promise<IntegrationHistory[]> {
    const { type, integrationId, clientId } = data;

    const wheres: string[] = [];

    if (type) {
      wheres.push(`history.type = '${type}'`);
    }

    if (clientId) {
      wheres.push(`clientIntegration.client_id = ${clientId}`);
    }

    if (integrationId) {
      wheres.push(`clientIntegration.integration_id = ${integrationId}`);
    }

    return this.createQueryBuilder('history')
      .where(wheres.join(' AND '))
      .leftJoinAndSelect('history.integration', 'clientIntegration')
      .leftJoinAndSelect('clientIntegration.client', 'client')
      .leftJoinAndSelect('clientIntegration.integration', 'integration')
      .orderBy('history.created_at', 'DESC')
      .getMany();
  }

  async findById(id: number): Promise<IntegrationHistory | null> {
    return await this.createQueryBuilder('history')
      .where('id = :id', { id })
      .leftJoinAndSelect('history.integration', 'clientIntegration')
      .leftJoinAndSelect('clientIntegration.client', 'client')
      .leftJoinAndSelect('clientIntegration.integration', 'integration')
      .getOne();
  }
}
