import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { IntegrationStatus } from './integration.status.enum';

export class ListIntegrationDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Expose({ name: 'client_id' })
  clientId?: number | null;

  @IsEnum(IntegrationStatus)
  status: IntegrationStatus;
}
