import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class DeleteClientDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsInt()
  id: number;
}

export class ListClientDto {
  @Expose({ name: 'only_active' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  onlyActive?: boolean = false;

  @IsString()
  @IsOptional()
  name?: string;
}

export class FindClientDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{14}$/, { message: 'deve conter 14 dígitos numéricos' })
  cnpj: string;
}
