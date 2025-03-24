import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsPositive } from 'class-validator';

export class IntegrationPollingDto {
  @IsNumber()
  @IsPositive()
  @Expose({ name: 'client_id' })
  clientId?: number;

  @Transform(({ value }) => value as IntegrationKey)
  @IsEnum(IntegrationKey)
  @Expose({ name: 'integration_key' })
  integrationKey: IntegrationKey;
}
