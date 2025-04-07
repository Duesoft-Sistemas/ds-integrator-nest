import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignInDto {
  @Transform(({ value }: { value: string }) => value.trim())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Transform(({ value }: { value: string }) => value.trim())
  @IsNotEmpty()
  password: string;
}
