import { Integration } from '@entities/integration/integration.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class IntegrationRepository extends Repository<Integration> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Integration, dataSource.createEntityManager());
  }
}
