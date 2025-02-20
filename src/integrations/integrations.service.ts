import { Integration } from '@entities/integration/integration.entity';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateIntegrationDto, UpdateIntegrationDto } from './integrations.dtos';
import { Payload } from 'src/auth/auth.dtos';

@Injectable()
export class IntegrationsService {
    constructor(
        @InjectRepository(Integration)
        private readonly integrationRepository: Repository<Integration>,
    ) {}

    async create(data: CreateIntegrationDto, user: Payload): Promise<Integration> {
        let integration = await this.integrationRepository.findOneBy({ key: data.key });

        if (integration) {
            throw new ConflictException(`Integração ${integration.name} já registrado`);
        }

        integration = this.integrationRepository.create({ ...data, user });
        return await this.integrationRepository.save(integration);
    }

    async update(id: number, data: UpdateIntegrationDto): Promise<void> {
        let integration = await this.integrationRepository.findOneBy({ id });

        if (!integration) {
            throw new NotFoundException('Integração não encontrado');
        }

        integration = await this.integrationRepository.findOneBy({
            id: Not(id),
            key: data.key,
        });

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
}
