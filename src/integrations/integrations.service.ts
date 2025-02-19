import { Integration } from '@entities/integration/integration.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
    CreateIntegrationDto,
    DeleteIntegrationDto,
    UpdateIntegrationDto,
} from './integrations.dtos';
import { Payload } from 'src/auth/auth.dtos';

@Injectable()
export class IntegrationsService {
    constructor(
        @InjectRepository(Integration)
        private readonly integrationRepository: Repository<Integration>,
    ) {}

    async create(data: CreateIntegrationDto, user: Payload): Promise<Integration> {
        const { name, photo } = data;

        const where = 'LOWER(unaccent(integrations.name)) LIKE LOWER(unaccent(:name))';
        let integration = await this.integrationRepository
            .createQueryBuilder('integrations')
            .where(where, { name })
            .getOne();

        if (integration) {
            throw new ConflictException(`Integração ${integration.name} já registrado`);
        }

        integration = this.integrationRepository.create({ name, user, photo });
        return await this.integrationRepository.save(integration);
    }

    async update(id: number, data: UpdateIntegrationDto): Promise<void> {
        const { name, photo } = data;
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
            throw new ConflictException(`Integração ${name} já registrado`);
        }

        await this.integrationRepository.update(id, { name, photo });
    }

    async delete(data: DeleteIntegrationDto) {
        const { id } = data;

        if (!(await this.integrationRepository.findOneBy({ id }))) {
            throw new NotFoundException('Integração não encontrado');
        }

        await this.integrationRepository.update(id, { deletedAt: new Date() });
    }

    async list(): Promise<Integration[]> {
        return await this.integrationRepository.findBy({ deletedAt: IsNull() });
    }
}
