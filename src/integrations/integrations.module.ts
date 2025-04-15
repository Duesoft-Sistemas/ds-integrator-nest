import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { IntegrationRepository } from './repositories/integrations.repository';

@Module({
  imports: [ConfigModule],
  controllers: [IntegrationsController],
  providers: [IntegrationRepository, IntegrationsService],
  exports: [IntegrationsService],
})
export class IntegrationsModule {}
