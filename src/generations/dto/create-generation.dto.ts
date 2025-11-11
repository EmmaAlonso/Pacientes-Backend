import { IsNumber, IsNotEmpty } from 'class-validator';

export class CreateGenerationDto {
  @IsNumber()
  @IsNotEmpty()
  año: number;

  @IsNumber()
  @IsNotEmpty()
  universidad_id: number;

  @IsNumber()
  @IsNotEmpty()
  carrera_id: number;
}
