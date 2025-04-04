import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { UserRole } from '@entities/users/users.role';
import useLocale from '@locale';
import { Roles } from '@metadata/role.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { endOfDay, startOfDay } from 'date-fns';
import { Request } from 'express';
import { unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { DeleteClientDto, ListClientDto } from './clients.dtos';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { ListIntegrationDto } from './dtos/list.integration.polling.dto';
import { UpdateClientDto } from './dtos/update-client.dto';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientsService: ClientsService,
  ) {}

  @Roles([UserRole.admin])
  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/user',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async createClient(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: CreateClientDto,
  ) {
    try {
      const appUrl = this.configService.get<string>('APP_URL');
      data.photo = file ? `${appUrl}/${file.path.replace(/\\/g, '/')}` : undefined;

      return await this.clientsService.create(data, req.user);
    } catch (ex) {
      await (file && unlink(file.path));
      throw ex;
    }
  }

  @Roles([UserRole.admin])
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/user',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async updateClient(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateClientDto,
  ) {
    try {
      const appUrl = this.configService.get<string>('APP_URL');
      data.photo = file ? `${appUrl}/${file.path.replace(/\\/g, '/')}` : undefined;

      return await this.clientsService.update(id, data);
    } catch (ex) {
      await (file && unlink(file.path));
      throw ex;
    }
  }

  @Roles([UserRole.admin])
  @Delete(':id')
  async DeleteClientDto(@Param() params: DeleteClientDto) {
    return await this.clientsService.delete(params);
  }

  @Get()
  async listClients(@Query() data: ListClientDto) {
    return await this.clientsService.list(data);
  }

  @Roles([UserRole.customer])
  @Post('integrations/:key/polling')
  async polling(@Req() req: Request, @Param('key') integrationKey: IntegrationKey) {
    const { clientId } = req.user;
    return await this.clientsService.polling({ clientId, integrationKey });
  }

  @Get('integrations')
  async listIntegrations(@Req() req: Request, @Query() query: ListIntegrationDto) {
    query.clientId = req.user.clientId ?? query.clientId;
    query.dateStart = query.dateStart ?? startOfDay(useLocale());
    query.dateEnd = query.dateEnd ?? endOfDay(useLocale());

    return this.clientsService.listIntegrations(query);
  }

  // remover quando o front for atualizado
  @Get('integrations/all')
  async listAllIntegrations(@Req() req: Request, @Query() query: ListIntegrationDto) {
    query.clientId = req.user.clientId ?? query.clientId;
    query.dateStart = query.dateStart ?? startOfDay(useLocale());
    query.dateEnd = query.dateEnd ?? endOfDay(useLocale());

    return this.clientsService.listIntegrations(query);
  }
}
