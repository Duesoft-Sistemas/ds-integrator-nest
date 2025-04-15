import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  photo?: string;

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

export class CreateClientWithPasswordDto extends CreateClientDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
