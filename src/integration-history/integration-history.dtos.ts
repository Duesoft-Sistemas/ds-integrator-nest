import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';

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

export class ErrorDetailsDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
