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
import { IntegrationHistoryModule } from './integration-history/integration-history.module';
import { IntegrationMappingModule } from './integration-mapping/integration-mapping.module';
import { RolesGuard } from './auth/role.guard';
import { JwtModuleInternal } from './jwt/jwt.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        JwtModuleInternal,
        AuthModule,
        UsersModule,
        ClientsModule,
        IntegrationsModule,
        CryptoModule,
        IntegrationHistoryModule,
        IntegrationMappingModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: 'APP_GUARD', useClass: AuthGuard },
        { provide: 'APP_GUARD', useClass: RolesGuard },
        AppService
    ],
})
export class AppModule {}
