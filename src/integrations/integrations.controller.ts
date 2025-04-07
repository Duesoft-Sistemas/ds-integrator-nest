import { IntegrationKey } from '@entities/integration/integration.key.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateIntegrationDto, UpdateIntegrationDto } from './integrations.dtos';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly service: IntegrationsService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/integration',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createIntegration(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateIntegrationDto,
  ) {
    try {
      const { user } = req;

      const appUrl = this.configService.get<string>('APP_URL');
      data.photo = file ? `${appUrl}/${file.path.replace(/\\/g, '/')}` : undefined;

      return await this.service.create(data, user);
    } catch (ex) {
      await (file && unlink(file.path));
      throw ex;
    }
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/integration',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateIntegration(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateIntegrationDto,
  ) {
    try {
      const appUrl = this.configService.get<string>('APP_URL');
      data.photo = file ? `${appUrl}/${file.path.replace(/\\/g, '/')}` : undefined;

      return await this.service.update(id, data);
    } catch (ex) {
      await (file && unlink(file.path));
      throw ex;
    }
  }

  @Delete(':id')
  async deleteIntegration(@Param('id', ParseIntPipe) id: number) {
    return await this.service.delete(id);
  }

  @Get()
  async listIntegrations() {
    return await this.service.list();
  }

  @Get(':key')
  async findByKey(@Param('key', new ParseEnumPipe(IntegrationKey)) key: IntegrationKey) {
    return await this.service.find({ key });
  }
}
