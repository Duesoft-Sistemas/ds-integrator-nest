import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@entities/clients/clients.entity';
import { CryptoModule } from 'src/crypto/crypto.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]), CryptoModule],
    controllers: [ClientsController],
    providers: [ClientsService],
    exports: [ClientsService],
})
export class ClientsModule {}
