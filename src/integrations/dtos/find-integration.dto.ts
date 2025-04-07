import { IntegrationKey } from '@entities/integration/integration.key.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class FindIntegrationDto {
  @IsEnum(IntegrationKey)
  @IsNotEmpty()
  key: IntegrationKey;
}
