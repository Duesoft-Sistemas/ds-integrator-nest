import { Module } from '@nestjs/common';
import { CryptoModule } from 'src/crypto/crypto.module';
import { UsersModule } from 'src/users/users.module';

import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { ClientIntegrationRepository } from './repositories/client.integrations.repository';
import { ClientRepository } from './repositories/clients.repository';

@Module({
  imports: [CryptoModule, UsersModule],
  controllers: [ClientsController],
  providers: [ClientRepository, ClientIntegrationRepository, ClientsService],
  exports: [ClientRepository, ClientIntegrationRepository, ClientsService],
})
export class ClientsModule {}
