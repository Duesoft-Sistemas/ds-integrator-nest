import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/jwt/jwt.dto';
import { JwtServiceInternal } from 'src/jwt/jwt.service';
import { UsersService } from 'src/users/users.service';

import { SignInDto } from './dtos/sign-in.dto';
import { LoginResponse } from './response/sign-in.response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtServiceInternal,
    private readonly usersService: UsersService,
  ) {}

  async signIn(data: SignInDto): Promise<LoginResponse> {
    const { email, password } = data;

    const user = await this.usersService.find({ email });

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
