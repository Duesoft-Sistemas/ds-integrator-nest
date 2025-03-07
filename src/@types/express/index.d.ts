import { Payload } from 'src/jwt/jwt.dto';

declare module 'express' {
  interface Request {
    user: Payload;
  }
}
