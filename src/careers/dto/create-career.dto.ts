import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCareerDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumber()
  @IsNotEmpty()
  universidad_id: number;
}
