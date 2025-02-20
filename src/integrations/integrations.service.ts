import { Integration } from '@entities/integration/integration.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { CreateIntegrationDto, UpdateIntegrationDto } from './integrations.dtos';
import { Payload } from 'src/auth/auth.dtos';

@Injectable()
export class IntegrationsService {
    constructor(
        @InjectRepository(Integration)
        private readonly integrationRepository: Repository<Integration>,
    ) {}

    async create(data: CreateIntegrationDto, user: Payload): Promise<Integration> {
        const { name } = data;

        const where = 'LOWER(unaccent(integrations.name)) LIKE LOWER(unaccent(:name))';
        let integration = await this.integrationRepository
            .createQueryBuilder('integrations')
            .where(where, { name })
            .getOne();

        if (integration) {
            throw new ConflictException(`Integração ${integration.name} já registrado`);
        }

        integration = this.integrationRepository.create({ ...data, user });
        return await this.integrationRepository.save(integration);
    }

    async update(id: number, data: UpdateIntegrationDto): Promise<void> {
        const { name } = data;

        let integration = await this.integrationRepository.findOneBy({ id });

        if (!integration) {
            throw new NotFoundException('Integração não encontrado');
        }

        const where =
            'integrations.id <> :id AND LOWER(unaccent(integrations.name)) LIKE LOWER(unaccent(:name))';
        integration = await this.integrationRepository
            .createQueryBuilder('integrations')
            .where(where, { id, name })
            .getOne();

        if (integration) {
            throw new ConflictException(`Integração ${integration.name} já registrado`);
        }

        await this.integrationRepository.update(id, data);
    }

    async delete(id: number) {
        const integration = await this.integrationRepository.findOneBy({ id });

        if (!integration) {
            throw new NotFoundException('Integração não encontrado');
        }

        await this.integrationRepository.delete(id);
    }

    async list(): Promise<Integration[]> {
        return await this.integrationRepository.find();
    }

    async listByIds(ids: number[]): Promise<Integration[]> {
        return await this.integrationRepository.findBy({ id: In(ids), deletedAt: IsNull() });
    }
}
