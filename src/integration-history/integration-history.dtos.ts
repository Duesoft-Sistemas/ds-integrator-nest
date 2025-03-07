/* eslint-disable @typescript-eslint/no-unsafe-return */
import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

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

export class CreateHistoryDto {
  @IsEnum(IntegrationHistoryType)
  type: IntegrationHistoryType;

  @IsEnum(IntegrationHistoryEntity)
  entity: IntegrationHistoryEntity;

  @IsString()
  @IsNotEmpty()
  operation: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsObject()
  @IsOptional()
  @Expose({ name: 'old_object' })
  oldObject?: Record<string, any>;

  @IsObject()
  @IsNotEmpty()
  @Expose({ name: 'new_object' })
  newObject?: Record<string, any>;
}

export class ErrorDetailsDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
