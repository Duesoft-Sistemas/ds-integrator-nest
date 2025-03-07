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
import {
    CreateClientDto,
    DeleteClientDto,
    FindClientDto,
    ListClientDto,
    UpdateClientDto,
} from './clients.dtos';
import { ClientsService } from './clients.service';
import { Request } from 'express';
import { Roles } from '@metadata/role.decorator';
import { UserRole } from '@entities/users/users.role';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Roles([UserRole.admin])
    @Post()
    async createClient(@Req() req: Request, @Body() data: CreateClientDto) {
        const { user } = req;
        return await this.clientsService.create(data, user);
    }

    @Put(':id')
    async updateClient(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateClientDto) {
        return await this.clientsService.update(id, data);
    }

    @Delete(':id')
    async DeleteClientDto(@Param() params: DeleteClientDto) {
        return await this.clientsService.delete(params);
    }

    @Get()
    async listClients(@Query() data: ListClientDto) {
        return await this.clientsService.list(data);
    }

    @Get(':cnpj')
    async FindClient(@Param() params: FindClientDto) {
        return await this.clientsService.findByCnpj(params);
    }
}
