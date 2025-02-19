import { User } from '@entities/users/users.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Payload extends User {}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
