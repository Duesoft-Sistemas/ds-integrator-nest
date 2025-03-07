import { Client } from '@entities/clients/clients.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from 'src/crypto/crypto.module';
import { UsersModule } from 'src/users/users.module';

import { ClientsController } from './clients.controller';
import { ClientRepository } from './clients.repository';
import { ClientsService } from './clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), CryptoModule, UsersModule],
  controllers: [ClientsController],
  providers: [ClientRepository, ClientsService],
  exports: [ClientRepository, ClientsService],
})
export class ClientsModule {}
