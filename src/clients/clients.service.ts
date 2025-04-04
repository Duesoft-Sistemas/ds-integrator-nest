import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Client } from '@entities/clients/clients.entity';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { instanceToPlain, plainToClass } from 'class-transformer';
import * as _ from 'lodash';
import { DeleteClientDto, ListClientDto } from 'src/clients/clients.dtos';
import { CryptoService } from 'src/crypto/crypto.service';
import { Payload } from 'src/jwt/jwt.dto';
import { UserRepository } from 'src/users/users.repository';
import { DataSource, Not } from 'typeorm';

import { CreateClientDto } from './dtos/create-client.dto';
import { IntegrationPollingDto } from './dtos/integration.polling.dto';
import { ListIntegrationDto } from './dtos/list.integration.polling.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { ClientIntegrationRepository } from './repositories/client.integrations.repository';
import { ClientRepository } from './repositories/clients.repository';
import { ClientIntegrationResponse } from './response/client.integrations.response';

@Injectable()
export class ClientsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly clientIntegrationRepository: ClientIntegrationRepository,
  ) {}

  async create(data: CreateClientDto, user: Payload): Promise<Client | { password: string }> {
    let client = await this.clientRepository.findByCnpj(data.cnpj);

    if (client) {
      throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
    }

    const profile = await this.userRepository.findByEmail(data.email);

    if (profile) {
      throw new ConflictException(`E-mail ${profile.email} já registrado`);
    }

    const password = this.cryptoService.generatePassword();
    const passwordEncrypted = await this.cryptoService.encrypt(password);

    client = await this.clientRepository.register(data, password, user);
    return { ...client, password: passwordEncrypted };
  }

  async update(id: number, data: UpdateClientDto): Promise<Partial<Client>> {
    const { integrations: integrationIds = [] } = data;

    let client: Client | null;

    if (data.cnpj) {
      client = await this.clientRepository.findOne({
        where: { id: Not(id), cnpj: data.cnpj },
      });

      if (client) {
        throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
      }
    }

    client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          if (Object.prototype.hasOwnProperty.call(client, key)) {
            client[key] = data[key];
          }

          if (Object.prototype.hasOwnProperty.call(client.profile, key)) {
            client.profile[key] = data[key];
          }
        }
      });

      if (integrationIds.length > 0) {
        await queryRunner.manager.delete(ClientIntegrations, client.integrations);

        client.integrations = integrationIds.map((integrationId) => ({
          integrationId,
        })) as ClientIntegrations[];
      }

      await queryRunner.manager.save(client);
      await queryRunner.manager.save(client.profile);

      await queryRunner.commitTransaction();
      return plainToClass(Client, _.omit(client, 'profile', 'integrations'));
    } catch (ex) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        `Falha ao atualizar cliente. ${(ex as Error).message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async delete(data: DeleteClientDto): Promise<void> {
    const { id } = data;

    const client = await this.clientRepository.findById(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      client.isActive = false;
      client.deletedAt = new Date();
      client.profile.isActive = false;
      client.profile.deletedAt = new Date();

      await queryRunner.manager.save(client);
      await queryRunner.manager.save(client.profile);

      await queryRunner.commitTransaction();
    } catch (ex) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        `Falha ao cadastrar cliente. ${(ex as Error).message}`,
      );
    } finally {
      await queryRunner.release();
    }

    await this.clientRepository.update(id, { deletedAt: new Date(), isActive: false });
  }

  async list(data: ListClientDto): Promise<Client[]> {
    const result = await this.clientRepository.list(data);
    return instanceToPlain(result) as Client[];
  }

  async polling(data: IntegrationPollingDto): Promise<void> {
    const { clientId, integrationKey } = data;

    const client = await this.clientRepository.findOne({
      where: { id: clientId, integrations: { integration: { key: integrationKey } } },
      relations: ['integrations', 'integrations.integration'],
    });

    if (!client) {
      throw new NotFoundException('Cliente ou integração não encontrado');
    }

    if (!client.isActive) {
      throw new ForbiddenException('Cliente não está ativo');
    }

    const integration = client.integrations.find((item) => item.integration.key == integrationKey);

    if (!integration || !integration.isActive) {
      throw new NotFoundException(`Integração ${integrationKey} não está ativa`);
    }

    await this.clientIntegrationRepository.polling(integration.id);
  }

  async listIntegrations(data: ListIntegrationDto): Promise<ClientIntegrationResponse[]> {
    const response = await this.clientRepository.listIntegrations(data);
    return response.map((item) => new ClientIntegrationResponse(item));
  }
}
