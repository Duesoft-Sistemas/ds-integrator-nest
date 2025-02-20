import { Transform } from 'class-transformer';
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
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    @IsOptional()
    only_active?: boolean = false;
}
