import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class ListIntegrationDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Expose({ name: 'client_id' })
  clientId?: number | null;
}
