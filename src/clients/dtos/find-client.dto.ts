import { IsEmail, IsNotEmpty } from 'class-validator';

export class FindClientDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
