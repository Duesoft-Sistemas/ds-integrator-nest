import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { CreateClientDto, DeleteClientDto, UpdateClientDto } from './clients.dtos';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Post()
    async createClient(@Body() data: CreateClientDto) {
        return await this.clientsService.create(data);
    }

    @Put(':id')
    async updateClient(@Body() data: UpdateClientDto, @Param('id', ParseIntPipe) id: number) {
        return await this.clientsService.update({ ...data, id });
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
