import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateClientDto, DeleteClientDto, UpdateClientDto } from './clients.dtos';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    async createClient(@Body() data: CreateClientDto) {
        return await this.clientsService.create(data);
    }

    @Put()
    async updateClient(@Body() data: UpdateClientDto) {
        return await this.clientsService.update(data);
    }

    @Delete(':id')
    async DeleteClientDto(@Param() params: DeleteClientDto) {
        return await this.clientsService.delete(params);
    }

    @Get()
    async listClients() {
        return await this.clientsService.list();
    }
}
