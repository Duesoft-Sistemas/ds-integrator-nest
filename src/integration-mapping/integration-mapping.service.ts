import * as _ from 'lodash';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { IntegrationMappingRepository } from './integration-mapping.repository';
import { CreateMappingDto } from './integration-mapping.dtos';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';
import { IntegrationMapping } from '@entities/integration-mapping/mapping.entity';

@Injectable()
export class IntegrationMappingService {
    constructor(private readonly mappingRepository: IntegrationMappingRepository) {}

    async createOrUpdate(data: CreateMappingDto): Promise<IntegrationMapping[]> {
        const { entity, mapping } = data;

        await this.mappingRepository.delete({ entity });

        const promises = mapping.map(async (item) => {
            const register = this.mappingRepository.create({ ...item, entity });
            await this.mappingRepository.save(register);

            return register;
        });

        return await Promise.all(promises);
    }

    async mapEntity(
        entity: IntegrationHistoryEntity,
        data: Record<string, any>,
        oldData?: Record<string, any>,
    ): Promise<Array<any>> {
        const mapping = await this.mappingRepository.findByEntity(entity);

        if (!mapping.length)
            throw new NotFoundException(`Mapeamento para entidade ${entity} não encontrado`);

        return mapping.map((item) => {
            const itemData: any = {
                key: item.propertyName,
                label: item.propertyLabel,
                value: _.get(data, item.propertyName, null),
                old_value: _.get(oldData, item.propertyName, null),
            }

            _.set(itemData, 'is_divergence', itemData.value !== itemData.old_value);
            
            return itemData;
        });
    }
}
