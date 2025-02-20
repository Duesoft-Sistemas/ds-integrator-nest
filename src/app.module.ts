import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './auth/auth.guard';
import { ClientsModule } from './clients/clients.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { CryptoModule } from './crypto/crypto.module';
import { DatabaseModule } from './database/databse.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        AuthModule,
        UsersModule,
        ClientsModule,
        IntegrationsModule,
        CryptoModule,
    ],
    controllers: [AppController],
    providers: [{ provide: 'APP_GUARD', useClass: AuthGuard }, AppService],
})
export class AppModule {}
