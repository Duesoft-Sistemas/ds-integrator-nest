import { Body, Controller, Param, Post } from '@nestjs/common';
import { IntegrationHistoryService } from './integration-history.service';
import { CreateHistoryDto, CreateHistoryParamsDto } from './integration-history.dtos';

@Controller('integrations/history')
export class IntegrationHistoryController {
    constructor(private readonly historyService: IntegrationHistoryService) {}

    @Post(':integrationKey/:clientId')
    async createHistory(@Param() params: CreateHistoryParamsDto, @Body() data: CreateHistoryDto) {
        return await this.historyService.create(params, data);
    }
}
