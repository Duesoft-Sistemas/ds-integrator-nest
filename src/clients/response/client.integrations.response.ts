import { Client } from '@entities/clients/clients.entity';
import { Integration } from '@entities/integration/integration.entity';
import useLocale from '@locale';
import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { differenceInHours } from 'date-fns';

import { IntegrationStatus } from '../dtos/integration.status.enum';

class BaseClient extends OmitType(Client, ['integrations']) {}

class IntegrationResponse extends Integration {
  @Expose({ name: 'last_polling' })
  lastPolling: Date;

  status: IntegrationStatus;
}

export class ClientIntegrationResponse extends BaseClient {
  @Type(() => IntegrationResponse)
  @Expose({ name: 'integrations' })
  integrations: IntegrationResponse[];

  constructor(source: Client) {
    super();

    const { integrations, ...client } = source;

    Object.assign(this, client);

    this.integrations = integrations.map(({ integration, lastPolling }) => {
      const dateDiff = differenceInHours(useLocale(), lastPolling);
      const status: IntegrationStatus =
        dateDiff <= 1
          ? IntegrationStatus.active
          : dateDiff <= 12
            ? IntegrationStatus.stopped
            : IntegrationStatus.critic;

      return {
        ...integration,
        status,
        lastPolling,
      };
    });
  }
}
