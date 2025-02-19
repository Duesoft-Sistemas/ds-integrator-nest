import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from '@entities/clients/clients.entity';
import { IntegrationsModule } from 'src/integrations/integrations.module';

@Module({
    imports: [TypeOrmModule.forFeature([Client]), IntegrationsModule],
    controllers: [ClientsController],
    providers: [ClientsService],
    exports: [ClientsService],
})
export class ClientsModule {}
