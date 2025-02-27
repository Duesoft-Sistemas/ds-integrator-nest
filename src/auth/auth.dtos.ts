import { User } from '@entities/users/users.entity';
import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

const payloadFields = ['id', 'email', 'name', 'photo', 'isAdmin', 'isActive'] as Array<keyof User>;

export class Payload extends PickType(User, payloadFields) {
    @IsNumber()
    @Expose({ name: 'client_id' })
    clientId?: number | null;

    constructor(user: User) {
        super();

        Object.entries(user).forEach(([key, value]) => {
            if (payloadFields.includes(key as keyof User)) {
                Object.assign(this, { [key]: value });
            }
        });

        this.clientId = user.client?.id ?? null;
    }
}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;
}
