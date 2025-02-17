import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignInDto } from './auth.dtos';
import { AuthService } from './auth.service';
import { Public } from 'src/metadata/public.metadata';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() data: SignInDto): Promise<any> {
        return await this.authService.signIn(data.email, data.password);
    }
}
