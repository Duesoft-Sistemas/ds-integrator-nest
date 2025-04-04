import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';

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
