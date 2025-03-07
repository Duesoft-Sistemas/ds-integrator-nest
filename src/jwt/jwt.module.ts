import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { JwtServiceInternal } from './jwt.service';

@Module({
  imports: [JwtModule.register({ global: true })],
  providers: [JwtServiceInternal],
  exports: [JwtServiceInternal],
})
export class JwtModuleInternal {}
