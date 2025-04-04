import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { UserRole } from '@entities/users/users.role';
import useLocale from '@locale';
import { Roles } from '@metadata/role.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { format } from 'date-fns';
import { Request } from 'express';

import { CreateHistoryDto } from './dtos/create-integration-history.dto';
import { DetailHistoryDto } from './dtos/detail-history.dto';
import { ListHistoryDto } from './dtos/list-integration-history.dto';
import { IntegrationHistoryService } from './integration-history.service';

@Controller('integrations/history')
export class IntegrationHistoryController {
  constructor(private readonly service: IntegrationHistoryService) {}

  @Post(':integrationKey/:clientId')
  async createHistory(
    @Req() req: Request,
    @Param('integrationKey', new ParseEnumPipe(IntegrationKey)) integrationKey: IntegrationKey,
    @Param('clientId', ParseIntPipe) clientId: number,
    @Body() data: CreateHistoryDto,
  ) {
    return await this.service.create({ ...data, integrationKey, clientId }, req.user);
  }

  @Get()
  async list(@Req() req: Request, @Query() query: ListHistoryDto) {
    query.clientId = req.user.clientId || query.clientId;
    query.dateStart = query.dateStart || format(useLocale(), 'yyyy-MM-dd');

    return await this.service.list(query);
  }

  @Get(':id/mapping')
  async mappingError(@Param() params: DetailHistoryDto) {
    return await this.service.mappingError(params);
  }

  @Roles([UserRole.admin, UserRole.support])
  @Put(':id/resolved')
  async markResolved(@Param('id', ParseIntPipe) id: number) {
    return await this.service.markResolved({ id });
  }
}
