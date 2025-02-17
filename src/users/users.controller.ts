import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from './users.dtos';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('admin')
    async createSuperUser(@Req() req: Request, @Body() data: CreateUserDto) {
        return await this.usersService.createAdmin(data, req.user);
    }

    @Post()
    async createUser(@Req() req: Request, @Body() data: CreateUserDto) {
        return await this.usersService.create(data, req.user);
    }

    @Get('profile')
    async getProfile(@Req() req: Request) {
        return await this.usersService.profile(req.user.id);
    }
}
