import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Payload } from './auth.dtos';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
    ) {}

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload: Payload = { ..._.omit(user, 'password', 'client') };
        payload.isClient = user.client != null;

        const access_token = await this.jwtService.signAsync(payload, {
            expiresIn: '1d', // 300s
            secret: jwtConstants.secret,
        });

        const refresh_token = await this.jwtService.signAsync(payload, {
            expiresIn: '10d',
            secret: jwtConstants.refreshSecret,
        });

        return { access_token, refresh_token, user: payload };
    }
}
