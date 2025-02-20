import { Module } from '@nestjs/common';
import { IntegrationHistoryController } from './integration-history.controller';
import { IntegrationHistoryService } from './integration-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationHistory } from '@entities/integration-history/history.entity';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationHistory])],
    controllers: [IntegrationHistoryController],
    providers: [IntegrationHistoryService],
})
export class IntegrationHistoryModule {}
