import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { UserRole } from '@entities/users/users.role';
import { Roles } from '@metadata/role.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import {
  CreateClientDto,
  DeleteClientDto,
  FindClientDto,
  ListClientDto,
  UpdateClientDto,
} from './clients.dtos';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Roles([UserRole.admin])
  @Post()
  async createClient(@Req() req: Request, @Body() data: CreateClientDto) {
    const { user } = req;
    return await this.clientsService.create(data, user);
  }

  @Roles([UserRole.admin])
  @Put(':id')
  async updateClient(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateClientDto) {
    return await this.clientsService.update(id, data);
  }

  @Roles([UserRole.admin])
  @Delete(':id')
  async DeleteClientDto(@Param() params: DeleteClientDto) {
    return await this.clientsService.delete(params);
  }

  @Get()
  async listClients(@Query() data: ListClientDto) {
    return await this.clientsService.list(data);
  }

  @Get(':cnpj')
  async findClient(@Param() params: FindClientDto) {
    return await this.clientsService.findByCnpj(params);
  }

  @Roles([UserRole.customer])
  @Post('integrations/:key/polling')
  async polling(@Req() req: Request, @Param('key') integrationKey: IntegrationKey) {
    const { clientId } = req.user;
    return await this.clientsService.polling({ clientId, integrationKey });
  }

  @Get('integrations/:status')
  async listIntegrations(@Req() req: Request) {
    const { clientId } = req.user;
    return this.clientsService.listIntegrations({ clientId });
  }
}
