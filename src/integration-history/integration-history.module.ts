import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';
import { IntegrationMappingModule } from 'src/integration-mapping/integration-mapping.module';

import { IntegrationHistoryController } from './integration-history.controller';
import { IntegrationHistoryService } from './integration-history.service';
import { IntegrationHistoryRepository } from './repositories/integration-history.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([IntegrationHistory]),
    ClientsModule,
    IntegrationMappingModule,
  ],
  controllers: [IntegrationHistoryController],
  providers: [IntegrationHistoryRepository, IntegrationHistoryService],
})
export class IntegrationHistoryModule {}
