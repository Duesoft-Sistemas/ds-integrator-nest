import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { RolesGuard } from './auth/guards/role.guard';
import { ClientsModule } from './clients/clients.module';
import { CryptoModule } from './crypto/crypto.module';
import { DatabaseModule } from './database/databse.module';
import { IntegrationHistoryModule } from './integration-history/integration-history.module';
import { IntegrationMappingModule } from './integration-mapping/integration-mapping.module';
import { IntegrationsModule } from './integrations/integrations.module';
import { JwtModuleInternal } from './jwt/jwt.module';
import { SeedModule } from './seed/seed.module';
import { UsersModule } from './users/users.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    JwtModuleInternal,
    AuthModule,
    UsersModule,
    ClientsModule,
    CryptoModule,
    IntegrationHistoryModule,
    IntegrationMappingModule,
    IntegrationsModule,
    SeedModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: 'APP_GUARD', useClass: AuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
    AppService,
  ],
})
export class AppModule {}
