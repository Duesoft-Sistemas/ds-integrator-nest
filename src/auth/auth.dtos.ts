import { User } from '@entities/users/users.entity';
import { PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class Payload extends PartialType(User) {
    id: number;
    isClient?: boolean;
}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
