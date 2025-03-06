import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { IntegrationHistoryService } from './integration-history.service';
import {
    CreateHistoryDto,
    ErrorDetailsDto,
    HistoryParamsDto,
    ListHistoryDto,
} from './integration-history.dtos';
import { Request } from 'express';
import { instanceToPlain } from 'class-transformer';

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

    @Get()
    async list(@Query() query: ListHistoryDto) {
        const result = await this.historyService.list(query);
        return instanceToPlain(result)
    }

    @Get(':id/mapping')
    async mappingError(@Param() params: ErrorDetailsDto) {
        const result = await this.historyService.mappingError(params);
        return instanceToPlain(result);
    }
}
