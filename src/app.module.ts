import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from './auth/auth.guard';
import { ClientsModule } from './clients/clients.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['.env.development.local'],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            port: Number(process.env.DATABASE_PORT),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME,
            entities: [`${__dirname}/database/core/**/*.entity{.js,.ts}`],
            migrations: [`${__dirname}/migration/{.ts,*.js}`],
            synchronize: true, // remover em produção
        }),
        AuthModule,
        UsersModule,
        ClientsModule,
        IntegrationsModule,
    ],
    controllers: [AppController],
    providers: [{ provide: 'APP_GUARD', useClass: AuthGuard }, AppService],
})
export class AppModule {}
