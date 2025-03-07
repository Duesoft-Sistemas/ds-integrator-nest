import { Client } from '@entities/clients/clients.entity';
import { IntegrationHistory } from '@entities/integration-history/history.entity';
import { OmitType } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import * as _ from 'lodash';

export class HistoryResponse extends OmitType(IntegrationHistory, ['integration']) {
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

    const { integration, ...history } = source;

    Object.assign(this, history);
    this.integrationId = _.get(integration, 'integration.id');
    this.integrationName = _.get(integration, 'integration.name');
    this.client = _.get(integration, 'client');
  }
}

export class HistoryMappingResponse extends IntegrationHistory {
  mapping: Array<any>;

  constructor(source: IntegrationHistory) {
    super();
    Object.assign(this, source);
  }
}
