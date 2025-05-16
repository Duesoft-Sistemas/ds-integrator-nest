import { Transform } from 'class-transformer';
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

  @Transform(({ value }: { value?: string }) => (value ? (JSON.parse(value) as number[]) : []))
  @IsArray()
  @IsOptional()
  integrations?: number[];

  @IsEmail()
  @IsOptional()
  email?: string;
}
