import { Payload } from 'src/auth/auth.dtos';

declare module 'express' {
    interface Request {
        user: Payload;
    }
}
