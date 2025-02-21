import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHistoryDto, CreateHistoryParamsDto } from './integration-history.dtos';
import { ClientRepository } from 'src/clients/clients.repository';
import { Payload } from 'src/auth/auth.dtos';

@Injectable()
export class IntegrationHistoryService {
    constructor(
        @InjectRepository(IntegrationHistory)
        private readonly historyRepository: Repository<IntegrationHistory>,
        private readonly clientRepository: ClientRepository,
    ) {}

    async create(
        user: Payload,
        params: CreateHistoryParamsDto,
        data: CreateHistoryDto,
    ): Promise<Partial<IntegrationHistory>> {
        const { clientId, integrationKey } = params;

        const integration = await this.clientRepository.findIntegrationFromClient(
            clientId,
            integrationKey,
        );

        const register = this.historyRepository.create(data);
        register.user_id = user.id;
        register.clientIntegrationId = integration.id;

        return await this.historyRepository.save(register);
    }
}
