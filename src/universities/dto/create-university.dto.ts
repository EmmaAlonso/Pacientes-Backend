import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUniversityDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
