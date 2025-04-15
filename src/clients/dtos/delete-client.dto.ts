import { Transform } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class DeleteClientDto {
  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  id: number;
}
