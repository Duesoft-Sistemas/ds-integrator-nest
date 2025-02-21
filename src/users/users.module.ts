import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { User } from '@entities/users/users.entity';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from './users.repository';

@Module({
    imports: [ConfigModule, TypeOrmModule.forFeature([User])],
    providers: [UserRepository, UsersService],
    controllers: [UsersController],
    exports: [UserRepository, UsersService],
})
export class UsersModule {}
