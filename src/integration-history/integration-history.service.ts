import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import useLocale from '@locale';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientRepository } from 'src/clients/repositories/clients.repository';
import { IntegrationMappingService } from 'src/integration-mapping/integration-mapping.service';
import { Payload } from 'src/jwt/jwt.dto';

import { CreateHistoryDto } from './dtos/create-integration-history.dto';
import { DetailHistoryDto } from './dtos/detail-history.dto';
import { ListHistoryDto } from './dtos/list-integration-history.dto';
import { MarkHistoryResolvedDto } from './dtos/mark-history-resolved.dto';
import { HistoryMappingResponse, HistoryResponse } from './integration-history.response';
import { IntegrationHistoryRepository } from './repositories/integration-history.repository';

@Injectable()
export class IntegrationHistoryService {
  constructor(
    private readonly repository: IntegrationHistoryRepository,
    private readonly clientRepository: ClientRepository,
    private readonly mappingService: IntegrationMappingService,
  ) {}

  async create(data: CreateHistoryDto, user: Payload): Promise<Partial<IntegrationHistory>> {
    const { clientId, integrationKey } = data;

    const integration = await this.clientRepository.findIntegrationFromClient(
      clientId,
      integrationKey,
    );

    const register = this.repository.create(data);
    register.userId = user.id;
    register.clientIntegrationId = integration.id;

    return await this.repository.save(register);
  }

  async list(data: ListHistoryDto): Promise<HistoryResponse[]> {
    const result = await this.repository.list(data);
    return result.map((item) => new HistoryResponse(item));
  }

  async mappingError(data: DetailHistoryDto): Promise<HistoryMappingResponse> {
    const { id } = data;

    const register = await this.repository.findById(id);

    if (!register) {
      throw new NotFoundException(`Registro de histórico ID ${id} não encontrado`);
    }

    const { entity, newObject, oldObject } = register;
    const response = new HistoryMappingResponse(register);
    response.mapping = await this.mappingService.mapEntity(entity, newObject, oldObject);

    return response;
  }

  async markResolved(data: MarkHistoryResolvedDto): Promise<void> {
    const { id } = data;

    const register = await this.repository.findOneBy({ id });

    if (!register) {
      throw new NotFoundException(`Registro com ID ${id} não encontrado`);
    }

    if (register.type !== IntegrationHistoryType.error) {
      throw new NotFoundException(`Registro do tipo '${register.type}' não pode ser alterado`);
    }

    if (register.resolved) {
      throw new NotFoundException(`Registro já resolvido`);
    }

    register.resolved = true;
    register.resolvedIn = useLocale();

    await this.repository.save(register);
  }
}
