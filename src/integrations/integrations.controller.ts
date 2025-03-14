import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { CreateIntegrationDto, UpdateIntegrationDto } from './integrations.dtos';
import { IntegrationsService } from './integrations.service';

@Controller('integrations')
export class IntegrationsController {
  private readonly appUrl = process.env.APP_URL || 'http://localhost:3000';

  constructor(private readonly integrationsService: IntegrationsService) {}

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
      data.photo = file ? `${this.appUrl}/${file.path.replace(/\\/g, '/')}` : undefined;

      return await this.integrationsService.create(data, user);
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
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateIntegrationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      data.photo = file ? `${this.appUrl}/${file.path.replace(/\\/g, '/')}` : undefined;

      return await this.integrationsService.update(id, data);
    } catch (ex) {
      await (file && unlink(file.path));
      throw ex;
    }
  }

  @Delete(':id')
  async deleteIntegration(@Param('id', ParseIntPipe) id: number) {
    return await this.integrationsService.delete(id);
  }

  @Get()
  async listIntegrations() {
    return await this.integrationsService.list();
  }
}
