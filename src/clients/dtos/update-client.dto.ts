import { IsArray, IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateClientDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  photo?: string;

  @IsString()
  @Matches(/^\d{14}$/, { message: 'deve conter 14 dígitos numéricos' })
  @IsOptional()
  cnpj: string;

  @IsArray()
  @IsOptional()
  integrations: number[];

  @IsEmail()
  @IsOptional()
  email: string;
}
