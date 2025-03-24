import { Client } from '@entities/clients/clients.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CryptoModule } from 'src/crypto/crypto.module';
import { UsersModule } from 'src/users/users.module';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientIntegrationRepository } from './repositories/client.integrations.repository';
import { ClientRepository } from './repositories/clients.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Client]), CryptoModule, UsersModule],
  controllers: [ClientsController],
  providers: [ClientRepository, ClientIntegrationRepository, ClientsService],
  exports: [ClientRepository, ClientIntegrationRepository, ClientsService],
})
export class ClientsModule {}
