import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Client } from '@entities/clients/clients.entity';
import { User } from '@entities/users/users.entity';
import useLocale from '@locale';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { CryptoService } from 'src/crypto/crypto.service';
import { Payload } from 'src/jwt/jwt.dto';
import { UserRepository } from 'src/users/users.repository';
import { DataSource, Not } from 'typeorm';

import { CreateClientDto, CreateClientWithPasswordDto } from './dtos/create-client.dto';
import { DeleteClientDto } from './dtos/delete-client.dto';
import { FindClientDto } from './dtos/find-client.dto';
import { IntegrationPollingDto } from './dtos/integration.polling.dto';
import { ListIntegrationDto } from './dtos/list.integration.polling.dto';
import { ListClientDto } from './dtos/list-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { ClientIntegrationRepository } from './repositories/client.integrations.repository';
import { ClientRepository } from './repositories/clients.repository';
import { ClientIntegrationResponse } from './response/client.integrations.response';
import { ClientCreatedResponse } from './response/client-created.response';

@Injectable()
export class ClientsService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly cryptoService: CryptoService,
    private readonly repository: ClientRepository,
    private readonly userRepository: UserRepository,
    private readonly clientIntegrationRepository: ClientIntegrationRepository,
  ) {}

  async createWithPassword(
    data: CreateClientWithPasswordDto,
    user: Payload,
  ): Promise<ClientCreatedResponse> {
    const { password, ...rest } = data;
    return this.create(rest, user, password);
  }

  async create(
    data: CreateClientDto,
    user: Payload,
    password?: string,
  ): Promise<ClientCreatedResponse> {
    let client = await this.repository.findByCnpj(data.cnpj);

    if (client) {
      throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
    }

    const profile = await this.userRepository.findByEmail(data.email);

    if (profile) {
      throw new ConflictException(`E-mail ${profile.email} já registrado`);
    }

    password = password || this.cryptoService.generatePassword();
    // const passwordEncrypted = await this.cryptoService.encrypt(password);

    client = await this.repository.register(data, password, user);
    return { ...client, password };
  }

  async update(id: number, data: UpdateClientDto): Promise<Partial<Client>> {
    const { integrations: integrationIds = [], ...clientData } = data;

    let client: Client | null;

    if (data.cnpj) {
      client = await this.repository.findOne({
        where: { id: Not(id), cnpj: data.cnpj },
      });

      if (client) {
        throw new ConflictException(`Cliente com CNPJ ${client.cnpj} já registrado`);
      }
    }

    client = await this.repository.findById(id);

    if (!client) {
      throw new NotFoundException('Cliente não encontrado');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      Object.keys(clientData).forEach((key) => {
        const value = clientData[key];

        if (value) {
          if (Object.prototype.hasOwnProperty.call(client, key)) {
            client[key] = value;
          }

          if (Object.prototype.hasOwnProperty.call(client.profile, key)) {
            client.profile[key] = value;
          }
        }
      });

      const integrationToDelete = client.integrations.filter(
        (r) => !integrationIds.includes(r.integrationId),
      );

      if (integrationToDelete.length) {
        await queryRunner.manager.delete(ClientIntegrations, integrationToDelete);
      }

      client.integrations = integrationIds.map((integrationId) => {
        const clientIntegration =
          client.integrations.find((r) => r.integrationId === integrationId) ??
          new ClientIntegrations();

        clientIntegration.clientId = client.id;
        clientIntegration.integrationId = integrationId;

        return clientIntegration;
      });

      await queryRunner.manager.save(Client, client);
      await queryRunner.manager.save(User, client.profile);
      await queryRunner.manager.save(ClientIntegrations, client.integrations);
      await queryRunner.commitTransaction();

      return client;
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

    const client = await this.repository.findById(id);

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

      throw new InternalServerErrorException(`Falha ao excluir cliente. ${(ex as Error).message}`);
    } finally {
      await queryRunner.release();
    }

    await this.repository.update(id, { deletedAt: new Date(), isActive: false });
  }

  async list(data: ListClientDto): Promise<Client[]> {
    const result = await this.repository.list(data);
    return instanceToPlain(result) as Client[];
  }

  async polling(data: IntegrationPollingDto): Promise<void> {
    const { clientId, integrationKey } = data;

    const integration = await this.clientIntegrationRepository.findOne({
      where: {
        client: { id: clientId, isActive: true },
        integration: { key: integrationKey },
      },
      relations: ['client', 'integration'],
    });

    if (!integration) {
      throw new NotFoundException(
        `Integração ${integrationKey} não encontrado para o cliente ID ${clientId}`,
      );
    }

    if (!integration.isActive) {
      throw new BadRequestException(`Integração desativada`);
    }

    integration.lastPolling = useLocale();
    await this.clientIntegrationRepository.save(integration);
  }

  async listIntegrations(data: ListIntegrationDto): Promise<ClientIntegrationResponse[]> {
    const response = await this.repository.listIntegrations(data);
    return response.map((item) => new ClientIntegrationResponse(item));
  }

  async find(data: FindClientDto): Promise<Client | null> {
    const { cnpj } = data;

    const register = await this.repository.findOneBy({ cnpj });
    return register;
  }
}
