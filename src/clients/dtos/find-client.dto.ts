import { IsOptional, IsString } from 'class-validator';

export class FindClientDto {
  @IsString()
  @IsOptional()
  cnpj: string;
}
