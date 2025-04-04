import { Client } from '@entities/clients/clients.entity';
import { Integration } from '@entities/integration/integration.entity';
import useLocale from '@locale';
import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { differenceInMinutes } from 'date-fns';

import { IntegrationStatus } from '../dtos/integration-status.enum';

class BaseClient extends OmitType(Client, ['integrations']) {
  photo?: string;
}

class IntegrationResponse extends Integration {
  @Expose({ name: 'last_polling' })
  lastPolling: Date;

  errors: number;

  status: IntegrationStatus;
}

export class ClientIntegrationResponse extends BaseClient {
  @Type(() => IntegrationResponse)
  @Expose({ name: 'integrations' })
  integrations: IntegrationResponse[];

  constructor(source: Client) {
    super();

    const { profile, integrations, ...client } = source;

    Object.assign(this, { ...client, photo: profile.photo });

    this.integrations = integrations.map(({ integration, lastPolling, errors = 0 }) => {
      const dateDiff = differenceInMinutes(useLocale(), lastPolling);

      return {
        ...integration,
        errors,
        lastPolling,
        status:
          dateDiff <= 30
            ? IntegrationStatus.active
            : dateDiff <= 60
              ? IntegrationStatus.stopped
              : IntegrationStatus.critic,
      };
    });
  }
}
