/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class HistoryParamsDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  clientId: number;

  @Transform(({ value }) => value as IntegrationKey)
  @IsNotEmpty()
  @IsEnum(IntegrationKey)
  integrationKey: IntegrationKey;
}

export class ListHistoryDto {
  @Transform(({ value }) => value && ((value as string).toUpperCase() as IntegrationHistoryType))
  @IsOptional()
  @IsEnum(IntegrationHistoryType)
  type?: IntegrationHistoryType;

  @Transform(({ value }) => value && Number.parseInt(value))
  @IsNumber()
  @IsOptional()
  @Expose({ name: 'integration_id' })
  integrationId?: number;

  @Transform(({ value }) => value && Number.parseInt(value))
  @IsNumber()
  @IsOptional()
  @Expose({ name: 'client_id' })
  clientId?: number;
}

export class ErrorDetailsDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
