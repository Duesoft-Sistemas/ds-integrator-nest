import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { IntegrationHistoryEntity } from '@entities/integration-history/history.process.enum';
import { IntegrationHistoryType } from '@entities/integration-history/history.type.enum';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

import { HistoryParamsDto } from '../integration-history.dtos';

export class CreateHistoryDto extends HistoryParamsDto {
  @IsOptional()
  clientId: number;

  @IsOptional()
  integrationKey: IntegrationKey;

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

  @Expose({ name: 'old_object' })
  @IsObject()
  @IsOptional()
  oldObject?: Record<string, any>;

  @Expose({ name: 'new_object' })
  @IsObject()
  @IsOptional()
  newObject?: Record<string, any>;
}
