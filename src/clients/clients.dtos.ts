import { Expose, Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'deve conter 14 dígitos numéricos' })
  cnpj: string;

  @IsArray()
  @ArrayMinSize(1, { message: 'Informe ao menos uma integração' })
  integrations: number[];

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class UpdateClientDto extends CreateClientDto {}

export class DeleteClientDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  id: number;
}

export class ListClientDto {
  @Expose({ name: 'only_active' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  onlyActive?: boolean = false;

  @IsString()
  @IsOptional()
  name?: string;
}

export class FindClientDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'deve conter 14 dígitos numéricos' })
  cnpj: string;
}
