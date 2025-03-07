import { Module } from '@nestjs/common';
import { JwtModuleInternal } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModuleInternal, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
