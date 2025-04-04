import { Expose, Transform, Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsPositive } from 'class-validator';

import { IntegrationStatus } from './integration-status.enum';

export class ListIntegrationDto {
  @Expose({ name: 'client_id' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  clientId?: number | null;

  @Transform(({ value }: { value: string }) =>
    value ? (value.toLowerCase() as IntegrationStatus) : null,
  )
  @IsEnum(IntegrationStatus)
  @IsOptional()
  status: IntegrationStatus;

  @Expose({ name: 'date_start' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateStart?: Date;

  @Expose({ name: 'date_end' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  dateEnd?: Date;
}
