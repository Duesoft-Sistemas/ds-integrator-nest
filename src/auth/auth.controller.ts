import { Public } from '@metadata/public.metadata';
import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() data: SignInDto) {
    return await this.authService.signIn(data);
  }
}
