import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './auth.response';
import { JwtServiceInternal } from 'src/jwt/jwt.service';
import { Payload } from 'src/jwt/jwt.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtServiceInternal,
        private readonly usersService: UsersService,
    ) {}

    async signIn(email: string, password: string): Promise<LoginResponse> {
        const user = await this.usersService.findByEmail(email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = new Payload(user);
        const accessToken = await this.jwtService.generateToken('access', payload);
        const refreshToken = await this.jwtService.generateToken('refresh', payload);

        const response = new LoginResponse(payload);
        response.accessToken = accessToken.token;
        response.refreshToken = refreshToken.token;
        response.expiresIn = accessToken.expiresIn;

        return response;
    }
}
