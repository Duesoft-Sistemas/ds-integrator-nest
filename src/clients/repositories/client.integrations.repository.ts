import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ClientIntegrationRepository extends Repository<ClientIntegrations> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(ClientIntegrations, dataSource.createEntityManager());
  }
}
