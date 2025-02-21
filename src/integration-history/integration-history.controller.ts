import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { IntegrationHistoryService } from './integration-history.service';
import { CreateHistoryDto, HistoryParamsDto, ListHistoryDto } from './integration-history.dtos';
import { Request } from 'express';

@Controller('integrations/history')
export class IntegrationHistoryController {
    constructor(private readonly historyService: IntegrationHistoryService) {}

    @Post(':integrationKey/:clientId')
    async createHistory(
        @Req() req: Request,
        @Param() params: HistoryParamsDto,
        @Body() data: CreateHistoryDto,
    ) {
        const { user } = req;
        return await this.historyService.create(user, params, data);
    }

    @Get(':integrationKey/:clientId')
    async listHistory(@Param() params: HistoryParamsDto, @Query() query: ListHistoryDto) {
        return await this.historyService.list(params, query);
    }
}
