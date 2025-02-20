import { Body, Controller, Post, Req, UnauthorizedException } from '@nestjs/common';
import { CreateUserAdminDto, CreateUserDto } from './users.dtos';
import { UsersService } from './users.service';
import { Request } from 'express';
import { Public } from '@metadata/public.metadata';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Public()
    @Post('admin')
    async createSuperUser(@Req() req: Request, @Body() data: CreateUserAdminDto) {
        const { device_id, ...rest } = data;

        if (!this.usersService.validDevice(device_id)) {
            throw new UnauthorizedException('Acesso negado');
        }

        return await this.usersService.createAdmin(rest, req.user);
    }

    @Post()
    async createUser(@Req() req: Request, @Body() data: CreateUserDto) {
        return await this.usersService.create(data, req.user);
    }
}
