import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModuleInternal } from 'src/jwt/jwt.module';

@Module({
    imports: [JwtModuleInternal, UsersModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
