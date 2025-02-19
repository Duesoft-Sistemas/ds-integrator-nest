import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integration } from '@entities/integration/integration.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Integration])],
    controllers: [IntegrationsController],
    providers: [IntegrationsService],
})
export class IntegrationsModule {}
