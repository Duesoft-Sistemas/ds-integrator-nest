import { Integration } from '@entities/integration/integration.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Payload } from 'src/jwt/jwt.dto';
import { Not } from 'typeorm';

import { FindIntegrationDto } from './dtos/find-integration.dto';
import { CreateIntegrationDto, UpdateIntegrationDto } from './integrations.dtos';
import { IntegrationRepository } from './repositories/integrations.repository';

@Injectable()
export class IntegrationsService {
  constructor(private readonly repository: IntegrationRepository) {}

  async create(data: CreateIntegrationDto, user: Payload): Promise<Integration> {
    let integration = await this.repository.findOneBy({ key: data.key });

    if (integration) {
      throw new ConflictException(`Integração ${integration.name} já registrado`);
    }

    integration = this.repository.create(data);
    integration.userId = user.id;

    return await this.repository.save(integration);
  }

  async update(id: number, data: UpdateIntegrationDto): Promise<void> {
    let integration = await this.repository.findOneBy({ id });

    if (!integration) {
      throw new NotFoundException('Integração não encontrado');
    }

    integration = await this.repository.findOneBy({
      id: Not(id),
      key: data.key,
    });

    if (integration) {
      throw new ConflictException(`Integração ${integration.key} já registrado`);
    }

    await this.repository.update(id, data);
  }

  async delete(id: number) {
    const integration = await this.repository.findOneBy({ id });

    if (!integration) {
      throw new NotFoundException('Integração não encontrado');
    }

    await this.repository.delete(id);
  }

  async list(): Promise<Integration[]> {
    return await this.repository.find();
  }

  async find(data: FindIntegrationDto): Promise<Integration | null> {
    const { key } = data;

    const register = await this.repository.findOneBy({ key });
    return register;
  }
}
