import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ListClientDto {
  @Expose({ name: 'status' })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  @IsOptional()
  onlyActive?: boolean = false;

  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }: { value?: string }) => value?.replace(/\D/g, ''))
  @IsString()
  @IsOptional()
  cnpj?: string;
}
