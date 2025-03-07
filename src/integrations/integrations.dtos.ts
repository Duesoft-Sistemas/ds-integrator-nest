import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIntegrationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEnum(IntegrationKey)
  key: IntegrationKey;

  @IsOptional()
  photo?: string;
}

export class UpdateIntegrationDto extends CreateIntegrationDto {}
