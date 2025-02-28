import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHistoryDto, ErrorDetailsDto, HistoryParamsDto, ListHistoryDto } from './integration-history.dtos';
import { ClientRepository } from 'src/clients/clients.repository';
import { Payload } from 'src/auth/auth.dtos';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { IntegrationHistoryRepository } from './integration-history.repository';

@Injectable()
export class IntegrationHistoryService {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly historyRepository: IntegrationHistoryRepository,
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

    async list(params: HistoryParamsDto, data: ListHistoryDto) : Promise<IntegrationHistory[]> {
        const { clientId, integrationId } = params;

        const integration = await this.clientRepository.findIntegrationFromClient(
            clientId,
            integrationId,
        );

        return await this.historyRepository.listByClient(integration.id, data.type);
    }

    async listError(): Promise<IntegrationHistory[]> {
        return await this.historyRepository.listByType(IntegrationHistoryType.error);
    }

    async getError(data: ErrorDetailsDto): Promise<IntegrationHistory> {
        const { id } = data;

        const register = await this.historyRepository.findOneBy({ id });

        if (!register)
            throw new NotFoundException(`Registro de histórico ID ${id} não encontrado`);

        return register;
    }
}
