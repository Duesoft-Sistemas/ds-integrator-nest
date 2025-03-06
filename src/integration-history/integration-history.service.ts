import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    CreateHistoryDto,
    ErrorDetailsDto,
    HistoryParamsDto,
    ListHistoryDto,
} from './integration-history.dtos';
import { ClientRepository } from 'src/clients/clients.repository';
import { Payload } from 'src/auth/auth.dtos';
import { IntegrationHistoryRepository } from './integration-history.repository';
import { IntegrationMappingService } from 'src/integration-mapping/integration-mapping.service';
import * as _ from 'lodash';
import { HistoryDetailsResponse } from './integration-history.response';

@Injectable()
export class IntegrationHistoryService {
    constructor(
        private readonly clientRepository: ClientRepository,
        private readonly historyRepository: IntegrationHistoryRepository,
        private readonly mappingService: IntegrationMappingService,
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
        register.userId = user.id;
        register.clientIntegrationId = integration.id;

        return await this.historyRepository.save(register);
    }

    async list(data: ListHistoryDto): Promise<any[]> {
        const result = await this.historyRepository.list(data);

        return result.map(({ integration, ...item }) => {
            return {
                ..._.omit(item, 'oldObject', 'newObject'),
                integration: {
                    id: integration.integrationId,
                    name: integration.integration.name,
                },
                client: {
                    id: integration.clientId,
                    cnpj: integration.client.cnpj,
                    name: integration.client.name,
                    email: integration.client.profile.email,
                    photo: integration.client.profile.photo,
                }
            } 
        });
    }

    async mappingError(data: ErrorDetailsDto): Promise<HistoryDetailsResponse> {
        const { id } = data;

        const register = await this.historyRepository.findOneBy({ id });

        if (!register) {
            throw new NotFoundException(`Registro de histórico ID ${id} não encontrado`);
        }

        const { entity, newObject, oldObject } = register;
        const response = new HistoryDetailsResponse(register);
        response.mapping = await this.mappingService.mapEntity(entity, newObject, oldObject);

        return response;
    }
}
