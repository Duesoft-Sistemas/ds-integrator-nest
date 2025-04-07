import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Payload, TokenType } from './jwt.dto';

@Injectable()
export class JwtServiceInternal {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateToken(
    type: TokenType,
    payload: Payload,
  ): Promise<{ token: string; expiresIn: Date }> {
    const secret = this.configService.get<string>(`JWT_${type.toUpperCase()}_TOKEN_SECRET`);
    const expiresIn = this.configService.get<string>(`JWT_${type.toUpperCase()}_TOKEN_EXPIRES_IN`);

    const token = await this.jwtService.signAsync(Object.assign({}, payload), {
      expiresIn,
      secret,
    });
    const decoded = this.jwtService.decode(token);

    console.log(payload.email, secret, token);
    return { token, expiresIn: new Date(decoded.exp * 1000) };
  }

  async verifyToken(type: TokenType, token: string): Promise<Payload> {
    const secret = this.configService.get<string>(`JWT_${type.toUpperCase()}_TOKEN_SECRET`);
    const payload = await this.jwtService.verifyAsync<Payload>(token, { secret });

    console.log(payload.email, secret, token);

    return payload;
  }
}
