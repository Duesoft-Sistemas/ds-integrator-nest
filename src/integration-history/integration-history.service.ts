import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { CreateHistoryDto, HistoryParamsDto, ListHistoryDto } from './integration-history.dtos';
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
        params: HistoryParamsDto,
        data: CreateHistoryDto,
    ): Promise<Partial<IntegrationHistory>> {
        const { clientId, integrationId } = params;

        const integration = await this.clientRepository.findIntegrationFromClient(
            clientId,
            integrationId,
        );

        const register = this.historyRepository.create(data);
        register.user_id = user.id;
        register.clientIntegrationId = integration.id;

        return await this.historyRepository.save(register);
    }

    async list(params: HistoryParamsDto, data: ListHistoryDto) {
        const { clientId, integrationId } = params;

        const integration = await this.clientRepository.findIntegrationFromClient(
            clientId,
            integrationId,
        );

        return await this.historyRepository.find({
            where: {
                clientIntegrationId: integration.id,
                type: data.type || Raw(() => 'true'),
            },
        });
    }
}
