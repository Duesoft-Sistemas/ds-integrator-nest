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

class IntegrationStatusResponse {
  label: string;
  timer: string;
  value: IntegrationStatus;
}

class IntegrationResponse extends Integration {
  @Expose({ name: 'last_polling' })
  lastPolling: Date;

  errors: number;

  status: IntegrationStatusResponse;
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

      const status: IntegrationStatusResponse = {} as IntegrationStatusResponse;

      if (minutesDiff <= 30) {
        status.label = 'Ativo';
        status.value = IntegrationStatus.active;
        status.timer = `há ${minutesDiff || 1} minuto(s)`;
      } else if (minutesDiff <= 60) {
        status.label = 'Parado';
        status.value = IntegrationStatus.stopped;
        status.timer = `há ${minutesDiff} minuto(s)`;
      } else {
        status.label = 'Crítico';
        status.value = IntegrationStatus.critic;
        status.timer = daysDiff ? `há ${daysDiff} dia(s)` : `há ${hoursDiff} hora(s)`;
      }

      return {
        ...integration,
        errors,
        status,
        lastPolling,
      };
    });
  }
}
