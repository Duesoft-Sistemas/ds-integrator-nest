import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsOptional()
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
