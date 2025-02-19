import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsInt,
    IsNotEmpty,
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
    @IsInt()
    id: number;
}
