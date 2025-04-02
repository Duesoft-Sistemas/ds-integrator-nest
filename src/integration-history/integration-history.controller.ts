import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';

import { CreateHistoryDto } from './dtos/create-integration-history.dto';
import { ListHistoryDto } from './dtos/list-integration-history.dto';
import { ErrorDetailsDto, HistoryParamsDto } from './integration-history.dtos';
import { IntegrationHistoryService } from './integration-history.service';

@Controller('integrations/history')
export class IntegrationHistoryController {
  constructor(private readonly historyService: IntegrationHistoryService) {}

  @Post(':integrationKey/:clientId')
  async createHistory(
    @Req() req: Request,
    @Param() params: HistoryParamsDto,
    @Body() body: CreateHistoryDto,
  ) {
    const data = Object.assign(body, params);
    return await this.historyService.create(data, req.user);
  }

  @Get()
  async list(@Query() query: ListHistoryDto) {
    return await this.historyService.list(query);
  }

  @Get(':id/mapping')
  async mappingError(@Param() params: ErrorDetailsDto) {
    return await this.historyService.mappingError(params);
  }
}
