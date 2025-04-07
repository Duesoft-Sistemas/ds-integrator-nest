import { Integration } from '@entities/integration/integration.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { IntegrationRepository } from './repositories/integrations.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Integration])],
  controllers: [IntegrationsController],
  providers: [IntegrationRepository, IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
