import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './auth.dtos';
import { AuthService } from './auth.service';
import { Public } from '@metadata/public.metadata';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @Post('login')
    async signIn(@Body() data: SignInDto) {
        return await this.authService.signIn(data.email, data.password);
    }
}
