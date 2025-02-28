import { Module } from '@nestjs/common';
import { IntegrationMappingController } from './integration-mapping.controller';
import { IntegrationMappingService } from './integration-mapping.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IntegrationMapping } from '@entities/integration-mapping/mapping.entity';
import { IntegrationMappingRepository } from './integration-mapping.repository';

@Module({
    imports: [TypeOrmModule.forFeature([IntegrationMapping])],
    controllers: [IntegrationMappingController],
    providers: [IntegrationMappingRepository, IntegrationMappingService],
    exports: [IntegrationMappingService],
})
export class IntegrationMappingModule {}
