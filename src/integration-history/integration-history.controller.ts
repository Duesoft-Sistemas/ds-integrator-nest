import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { IntegrationHistoryService } from './integration-history.service';
import {
    CreateHistoryDto,
    ErrorDetailsDto,
    HistoryParamsDto,
    ListHistoryDto,
} from './integration-history.dtos';
import { Request } from 'express';

@Controller('integrations/history')
export class IntegrationHistoryController {
    constructor(private readonly historyService: IntegrationHistoryService) {}

    @Post(':integrationId/:clientId')
    async createHistory(
        @Req() req: Request,
        @Param() params: HistoryParamsDto,
        @Body() data: CreateHistoryDto,
    ) {
        const { user } = req;
        return await this.historyService.create(user, params, data);
    }

    @Get(':integrationId/:clientId')
    async listHistory(@Param() params: HistoryParamsDto, @Query() query: ListHistoryDto) {
        return await this.historyService.list(params, query);
    }

    @Get('error')
    async listError() {
        return await this.historyService.listError();
    }

    @Get('error/:id/details')
    async getError(@Param() params: ErrorDetailsDto) {
        return await this.historyService.getError(params);
    }
}
