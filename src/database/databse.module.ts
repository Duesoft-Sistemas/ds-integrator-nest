import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const options: any = {};
        const type = configService.get<string>('DATABASE_TYPE');

        switch (type) {
          case 'mongodb':
            options.type = 'mongodb';
            options.useUnifiedTopology = true;
            options.url = configService.get<string>('DATABASE_CONNECTION');
            break;

          default:
            options.type = 'postgres';
            options.host = configService.get<string>('DATABASE_HOST');
            options.port = configService.get<number>('DATABASE_PORT');
            options.username = configService.get<string>('DATABASE_USERNAME');
            options.password = configService.get<string>('DATABASE_PASSWORD');
            options.ssl = false;
            break;
        }

        options.database = configService.get<string>('DATABASE_NAME');
        options.migrations = [`${__dirname}/migration/{.ts,*.js}`];
        options.entities = [`${__dirname}/core/**/*.entity{.js,.ts}`];
        options.synchronize = configService.get<boolean>('DATABASE_SYNC', false);

        return options as TypeOrmModuleOptions;
      },
    }),
  ],
})
export class DatabaseModule {}
