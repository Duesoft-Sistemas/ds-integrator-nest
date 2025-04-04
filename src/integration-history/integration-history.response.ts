import { Client } from '@entities/clients/clients.entity';
import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';
import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import * as _ from 'lodash';

export class HistoryResponse extends OmitType(IntegrationHistory, ['clientIntegration']) {
  @Expose({ name: 'integration_id' })
  integrationId: number;

  @Expose({ name: 'integration_name' })
  integrationName: string;

  @Type(() => Client)
  client: Partial<Client>;

  @Exclude()
  override oldObject?: Record<string, any>;

  @Exclude()
  override newObject?: Record<string, any>;

  constructor(source: IntegrationHistory) {
    super();

    const { clientIntegration, ...register } = source;

    Object.assign(this, register);

    this.integrationId = _.get(clientIntegration, 'integration.id');
    this.integrationName = _.get(clientIntegration, 'integration.name');
    this.client = _.get(clientIntegration, 'client');
  }
}

export class HistoryMappingResponse extends OmitType(IntegrationHistory, ['clientIntegration']) {
  @Expose({ name: 'entity_label' })
  entityLabel: string;

  @Expose({ name: 'integration_id' })
  integrationId: number;

  @Expose({ name: 'integration_name' })
  integrationName: string;

  client: Client;

  mapping: Array<any>;

  constructor(source: IntegrationHistory) {
    super();

    const { clientIntegration, ...register } = source;

    Object.assign(this, register);

    this.client = _.get(clientIntegration, 'client');
    this.integrationId = _.get(clientIntegration, 'integration.id');
    this.integrationName = _.get(clientIntegration, 'integration.name');

    switch (this.entity) {
      case IntegrationHistoryEntity.category:
        this.entityLabel = 'Categoria';
        break;

      case IntegrationHistoryEntity.brand:
        this.entityLabel = 'Marca';
        break;

      case IntegrationHistoryEntity.product:
        this.entityLabel = 'Produtos';
        break;

      default:
        this.entityLabel = 'Registro';
        break;
    }
  }
}
