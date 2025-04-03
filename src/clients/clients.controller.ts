import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { UserRole } from '@entities/users/users.role';
import { Roles } from '@metadata/role.decorator';
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
  Query,
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

import { DeleteClientDto, FindClientDto, ListClientDto } from './clients.dtos';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dtos/create-client.dto';
import { IntegrationStatus } from './dtos/integration.status.enum';
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

  @Get(':cnpj')
  async findClient(@Param() params: FindClientDto) {
    return await this.clientsService.findByCnpj(params);
  }

  @Roles([UserRole.customer])
  @Post('integrations/:key/polling')
  async polling(@Req() req: Request, @Param('key') integrationKey: IntegrationKey) {
    const { clientId } = req.user;
    return await this.clientsService.polling({ clientId, integrationKey });
  }

  @Get('integrations/:status')
  async listIntegrations(
    @Req() req: Request,
    @Param('status', new ParseEnumPipe(IntegrationStatus)) status: IntegrationStatus,
  ) {
    const { clientId } = req.user;
    return this.clientsService.listIntegrations({ clientId, status });
  }
}
