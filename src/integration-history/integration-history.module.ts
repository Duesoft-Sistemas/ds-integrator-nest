import { Module } from '@nestjs/common';
import { IntegrationHistoryController } from './integration-history.controller';
import { IntegrationHistoryService } from './integration-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { ClientsModule } from 'src/clients/clients.module';
import { IntegrationHistoryRepository } from './integration-history.repository';
import { IntegrationMappingModule } from 'src/integration-mapping/integration-mapping.module';

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
