import { Integration } from '@entities/integration/integration.entity';
import { User } from '@entities/users/users.entity';
import { OmitType } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    cnpj: string;

    @IsNotEmpty()
    integrations: Integration[];

    @IsNotEmpty()
    profile: User;
}

export class UpdateClientDto extends OmitType(CreateClientDto, ['profile']) {
    @IsInt()
    id: number;
}

export class DeleteClientDto {
    @IsInt()
    id: number;
}
