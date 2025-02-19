import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { CreateUserDto } from 'src/users/users.dtos';

export class CreateClientDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    cnpj: string;

    @IsArray()
    @ArrayMinSize(1, { message: 'Informe ao menos uma integração' })
    integrations: number[];

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => CreateUserDto)
    profile: CreateUserDto;
}

export class UpdateClientDto extends CreateClientDto {}

export class DeleteClientDto {
    @IsInt()
    id: number;
}
