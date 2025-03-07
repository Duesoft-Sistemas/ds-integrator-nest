import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from 'src/clients/clients.module';
import { IntegrationMappingModule } from 'src/integration-mapping/integration-mapping.module';

import { IntegrationHistoryController } from './integration-history.controller';
import { IntegrationHistoryRepository } from './integration-history.repository';
import { IntegrationHistoryService } from './integration-history.service';

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
