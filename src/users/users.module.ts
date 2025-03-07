import { User } from '@entities/users/users.entity';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UsersService],
  controllers: [UsersController],
  exports: [UserRepository, UsersService],
})
export class UsersModule {}
