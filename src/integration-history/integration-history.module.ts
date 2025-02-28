import { Module } from '@nestjs/common';
import { IntegrationHistoryController } from './integration-history.controller';
import { IntegrationHistoryService } from './integration-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { IntegrationHistoryRepository } from './integration-history.repository';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationHistory]), ClientsModule],
    controllers: [IntegrationHistoryController],
    providers: [IntegrationHistoryService, IntegrationHistoryRepository],
})
export class IntegrationHistoryModule {}
