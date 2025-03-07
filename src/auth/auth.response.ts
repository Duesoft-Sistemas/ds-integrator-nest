import { User } from '@entities/users/users.entity';
import { Expose } from 'class-transformer';
import { Payload } from 'src/jwt/jwt.dto';

export class LoginResponse {
  @Expose({ name: 'access_token' })
  accessToken: string;

  @Expose({ name: 'expires_in' })
  expiresIn: Date;

  @Expose({ name: 'refresh_token' })
  refreshToken: string;

  user: Payload;

  constructor(payload: Payload) {
    this.user = payload;
  }
}
