import { IsEmail, IsNotEmpty } from 'class-validator';

export class Payload {
    id: number;
    email: string;
    username!: string;
    isAdmin: boolean;
}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
