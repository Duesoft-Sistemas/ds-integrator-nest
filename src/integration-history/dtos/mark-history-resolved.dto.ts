import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarkHistoryResolvedDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
