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
    const { type, integrationId, clientId, dateStart, dateEnd } = data;

    const wheres: string[] = [];

    if (type) {
      wheres.push(`history.type = '${type}'`);
    }

    if (clientId) {
      wheres.push(`clientIntegration.client_id = ${clientId}`);
    }

    if (integrationId) {
      wheres.push(`clientIntegration.id = ${integrationId}`);
    }

    if (dateStart) {
      wheres.push(`history.created_at::date >= '${dateStart}'`);
    }

    if (dateEnd) {
      wheres.push(`history.created_at::date <= '${dateEnd}'`);
    }

    return this.createQueryBuilder('history')
      .leftJoinAndSelect('history.clientIntegration', 'clientIntegration')
      .leftJoinAndSelect('clientIntegration.client', 'client')
      .leftJoinAndSelect('clientIntegration.integration', 'integration')
      .where(wheres.join(' AND '))
      .orderBy('history.created_at', 'DESC')
      .limit(1000)
      .getMany();
  }

  async findById(id: number): Promise<IntegrationHistory | null> {
    return await this.createQueryBuilder('history')
      .leftJoinAndSelect('history.clientIntegration', 'clientIntegration')
      .leftJoinAndSelect('clientIntegration.client', 'client')
      .leftJoinAndSelect('clientIntegration.integration', 'integration')
      .where('history.id = :id', { id })
      .getOne();
  }
}
