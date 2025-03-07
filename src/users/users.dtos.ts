import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class CreateUserAdminDto extends CreateUserDto {
  @IsNotEmpty({ message: 'identificação deve ser informado' })
  device_id: string;
}
