import { IntegrationMapping } from '@entities/integration-mapping/mapping.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IntegrationMappingController } from './integration-mapping.controller';
import { IntegrationMappingRepository } from './integration-mapping.repository';
import { IntegrationMappingService } from './integration-mapping.service';

@Module({
  imports: [TypeOrmModule.forFeature([IntegrationMapping])],
  controllers: [IntegrationMappingController],
  providers: [IntegrationMappingRepository, IntegrationMappingService],
  exports: [IntegrationMappingService],
})
export class IntegrationMappingModule {}
