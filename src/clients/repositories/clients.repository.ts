import { ClientIntegrations } from '@entities/clients/client.integrations.entity';
import { Client } from '@entities/clients/clients.entity';
import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { User } from '@entities/users/users.entity';
import { UserRole } from '@entities/users/users.role';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Raw, Repository } from 'typeorm';

import { ListClientDto } from '../clients.dtos';
import { CreateClientDto } from '../dtos/create-client.dto';
import { ListIntegrationDto } from '../dtos/list.integration.polling.dto';

@Injectable()
export class ClientRepository extends Repository<Client> {
  constructor(@InjectDataSource() private dataSource: DataSource) {
    super(Client, dataSource.createEntityManager());
  }

  async findIntegrationFromClient(
    clientId: number,
    integrationKey: IntegrationKey,
  ): Promise<ClientIntegrations> {
    const register = await this.findOne({
      where: { id: clientId, integrations: { integration: { key: integrationKey } } },
      relations: ['integrations', 'integrations.integration'],
    });

    if (!register) {
      throw new NotFoundException(
        `Integração ${integrationKey} não encontrada par ao cliente mencionado`,
      );
    }

    return register.integrations.find(
      (r) => r.integration.key == integrationKey,
    ) as ClientIntegrations;
  }

  async findByCnpj(cnpj: string): Promise<Client | null> {
    return await this.findOne({
      where: { cnpj },
      relations: ['profile', 'integrations', 'integrations.integration'],
    });
  }

  async list(filter: ListClientDto): Promise<Client[]> {
    const { name, onlyActive } = filter;

    return await this.find({
      where: { isActive: onlyActive || Raw(() => 'true'), name: name },
      relations: ['profile', 'integrations', 'integrations.integration'],
    });
  }

  async findById(id: number): Promise<Client | null> {
    return await this.findOne({ where: { id }, relations: ['profile', 'integrations'] });
  }

  async register(data: CreateClientDto, password: string, user: User): Promise<Client> {
    const { email, integrations: integrationIds, ...rest } = data;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const profile = queryRunner.manager.create(User, { email, password });
      profile.name = data.name;
      profile.userId = user.id;
      profile.roles = [UserRole.customer];

      await queryRunner.manager.save(profile);

      const client = queryRunner.manager.create(Client, rest);
      client.userId = user.id;
      client.profileId = profile.id;
      client.integrations = integrationIds.map((integrationId) => ({
        integrationId,
      })) as ClientIntegrations[];

      await queryRunner.manager.save(client);
      await queryRunner.commitTransaction();

      return client;
    } catch (ex) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException(
        `Falha ao cadastrar cliente. ${(ex as Error).message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async listIntegrations(data: ListIntegrationDto) {
    const { clientId } = data;

    const wheres: string[] = [
      'client.is_active = true',
      'clientIntegration.last_polling IS NOT NULL',
    ];

    if (clientId) {
      wheres.push(`client.id = ${clientId}`);
    }

    return await this.createQueryBuilder('client')
      .where(wheres.join(' AND '))
      .leftJoinAndSelect('client.profile', 'profile')
      .leftJoinAndSelect('client.integrations', 'clientIntegration')
      .leftJoinAndSelect('clientIntegration.integration', 'integration')
      .orderBy('integration.created_at', 'DESC')
      .getMany();
  }
}
