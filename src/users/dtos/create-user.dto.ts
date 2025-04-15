import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateUserAdminDto extends CreateUserDto {
  @IsString()
  @IsOptional()
  device_id: string;
}
