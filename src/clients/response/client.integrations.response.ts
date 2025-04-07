import { Client } from '@entities/clients/clients.entity';
import { Integration } from '@entities/integration/integration.entity';
import useLocale from '@locale';
import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

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
      const now = useLocale();
      const minutesDiff = differenceInMinutes(now, lastPolling),
        hoursDiff = differenceInHours(now, lastPolling),
        daysDiff = differenceInDays(now, lastPolling);

      let status: IntegrationStatus, label: string;

      if (minutesDiff <= 30) {
        status = IntegrationStatus.active;
        label = `há ${minutesDiff} minutos`;
      } else if (minutesDiff <= 60) {
        status = IntegrationStatus.stopped;
        label = `há ${minutesDiff} minutos`;
      } else {
        status = IntegrationStatus.critic;
        label = daysDiff ? `há ${daysDiff} dias` : `há ${hoursDiff} horas`;
      }

      return {
        ...integration,
        errors,
        label,
        status,
        lastPolling,
      };
    });
  }
}
