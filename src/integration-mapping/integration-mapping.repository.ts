import { IntegrationMapping } from '@entities/integration-mapping/mapping.entity';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';

@Injectable()
export class IntegrationMappingRepository extends Repository<IntegrationMapping> {
    constructor(@InjectDataSource() private dataSource: DataSource) {
        super(IntegrationMapping, dataSource.createEntityManager());
    }

    async findByEntity(entity: IntegrationHistoryEntity): Promise<IntegrationMapping[]> {
        return await this.findBy({ entity });
    }
}
