import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: '*',
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
