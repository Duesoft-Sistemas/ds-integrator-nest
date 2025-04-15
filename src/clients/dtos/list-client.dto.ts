import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

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
