import { UserRole } from '@entities/users/users.role';
import { Public } from '@metadata/public.metadata';
import { Roles } from '@metadata/role.decorator';
import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { CreateUserAdminDto, CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

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

    return await this.usersService.createAdmin(rest);
  }

  @Roles([UserRole.admin])
  @Post()
  async create(@Req() req: Request, @Body() data: CreateUserDto) {
    return await this.usersService.create(data, req.user);
  }

  @Roles([UserRole.admin])
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: CreateUserDto) {
    return await this.usersService.update(id, data);
  }
}
