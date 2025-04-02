import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from 'src/clients/repositories/clients.repository';
import { IntegrationMappingService } from 'src/integration-mapping/integration-mapping.service';
import { Payload } from 'src/jwt/jwt.dto';

import { CreateHistoryDto } from './dtos/create-integration-history.dto';
import { ListHistoryDto } from './dtos/list-integration-history.dto';
import { ErrorDetailsDto } from './integration-history.dtos';
import { HistoryMappingResponse, HistoryResponse } from './integration-history.response';
import { IntegrationHistoryRepository } from './repositories/integration-history.repository';

@Injectable()
export class IntegrationHistoryService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private readonly historyRepository: IntegrationHistoryRepository,
    private readonly mappingService: IntegrationMappingService,
  ) {}

  async create(data: CreateHistoryDto, user: Payload): Promise<Partial<IntegrationHistory>> {
    const { clientId, integrationKey } = data;

    const integration = await this.clientRepository.findIntegrationFromClient(
      clientId,
      integrationKey,
    );

    const register = this.historyRepository.create(data);
    register.userId = user.id;
    register.clientIntegrationId = integration.id;

    return await this.historyRepository.save(register);
  }

  async list(data: ListHistoryDto): Promise<HistoryResponse[]> {
    const result = await this.historyRepository.list(data);
    return result.map((item) => new HistoryResponse(item));
  }

  async mappingError(data: ErrorDetailsDto): Promise<HistoryMappingResponse> {
    const { id } = data;

    const register = await this.historyRepository.findById(id);

    if (!register) {
      throw new NotFoundException(`Registro de histórico ID ${id} não encontrado`);
    }

    const { entity, newObject, oldObject } = register;
    const response = new HistoryMappingResponse(register);
    response.mapping = await this.mappingService.mapEntity(entity, newObject, oldObject);

    return response;
  }
}
