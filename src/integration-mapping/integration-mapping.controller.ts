import { Body, Controller, Post, Req } from '@nestjs/common';
import { IntegrationMappingService } from './integration-mapping.service';
import { CreateMappingDto } from './integration-mapping.dtos';
import { Request } from 'express';

@Controller('integrations/mapping')
export class IntegrationMappingController {
    constructor(private readonly mappingService: IntegrationMappingService) {}

    @Post()
    async createOrUpdateMapping(@Req() req: Request, @Body() data: CreateMappingDto) {
        const userId = req.user.id;
        return await this.mappingService.createOrUpdate({ ...data, userId });
    }
}
