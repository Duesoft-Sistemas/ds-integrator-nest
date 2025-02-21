import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDto, CreateHistoryParamsDto } from './integration-history.dtos';
import { ClientRepository } from 'src/clients/clients.repository';

@Injectable()
export class IntegrationHistoryService {
    constructor(
        @InjectRepository(IntegrationHistory)
        private readonly historyRepository: Repository<IntegrationHistory>,
        private readonly clientRepository: ClientRepository,
    ) {}

    async create(
        params: CreateHistoryParamsDto,
        data: CreateHistoryDto,
    ): Promise<IntegrationHistory> {
        const { clienId, integrationKey } = params;

        const integration = await this.clientRepository.findIntegrationFromClient(
            clienId,
            integrationKey,
        );

        const register = this.historyRepository.create({ ...data, integration });
        return await this.historyRepository.save(register);
    }
}
