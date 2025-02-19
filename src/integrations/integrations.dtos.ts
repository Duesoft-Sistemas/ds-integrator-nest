import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateIntegrationDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    photo?: string;
}

export class UpdateIntegrationDto extends CreateIntegrationDto {}
