import { Client } from '@entities/clients/clients.entity';
import { Integration } from '@entities/integration/integration.entity';
import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

class BaseClient extends OmitType(Client, ['integrations']) {}

class IntegrationResponse extends Integration {
  @Expose({ name: 'last_polling' })
  lastPolling: Date;
}

export class ClientIntegrationResponse extends BaseClient {
  @Expose({ name: 'integrations' })
  integrations: IntegrationResponse[];

  constructor(source: Client) {
    super();

    const { integrations, ...client } = source;

    Object.assign(this, client);

    this.integrations = integrations.map(({ integration, lastPolling }) => ({
      ...integration,
      lastPolling,
    }));
  }
}
