import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { IntegrationMappingService } from './integration-mapping.service';
import { CreateMappingDto } from './integration-mapping.dtos';
import { Request } from 'express';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';

@Controller('integrations/mapping')
export class IntegrationMappingController {
    constructor(private readonly mappingService: IntegrationMappingService) {}

    @Post(':entity')
    async createOrUpdateMapping(
        @Param('entity') entity: IntegrationHistoryEntity,
        @Req() req: Request, @Body() data: CreateMappingDto
    ) {
        const userId = req.user.id;
        return await this.mappingService.createOrUpdate({ ...data, userId, entity });
    }
}
