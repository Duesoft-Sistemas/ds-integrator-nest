import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@entities/clients/clients.entity';
import { CryptoModule } from 'src/crypto/crypto.module';
import { ClientRepository } from './clients.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]), CryptoModule, UsersModule],
    controllers: [ClientsController],
    providers: [ClientRepository, ClientsService],
    exports: [ClientRepository, ClientsService],
})
export class ClientsModule {}
