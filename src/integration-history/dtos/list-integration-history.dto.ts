import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export class ListHistoryDto {
  @Transform(
    ({ value }: { value: string }) => value && (value.toUpperCase() as IntegrationHistoryType),
  )
  @IsOptional()
  @IsEnum(IntegrationHistoryType)
  type?: IntegrationHistoryType;

  @Expose({ name: 'integration_id' })
  @Transform(({ value }: { value: string }) => value && Number.parseInt(value))
  @IsNumber()
  @IsOptional()
  integrationId?: number;

  @Expose({ name: 'client_id' })
  @Transform(({ value }: { value: string }) => value && Number.parseInt(value))
  @IsNumber()
  @IsOptional()
  clientId?: number;
}
