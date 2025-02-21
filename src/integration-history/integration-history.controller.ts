import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { IntegrationHistoryService } from './integration-history.service';
import { CreateHistoryDto, CreateHistoryParamsDto } from './integration-history.dtos';
import { Request } from 'express';

@Controller('integrations/history')
export class IntegrationHistoryController {
    constructor(private readonly historyService: IntegrationHistoryService) {}

    @Post(':integrationKey/:clientId')
    async createHistory(
        @Req() req: Request,
        @Param() params: CreateHistoryParamsDto,
        @Body() data: CreateHistoryDto,
    ) {
        const { user } = req;
        return await this.historyService.create(user, params, data);
    }
}
