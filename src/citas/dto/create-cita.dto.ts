import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCitaDto {
  @IsOptional()
  @IsDateString()
  fechaDeseada?: string;

  @IsOptional()
  @IsDateString()
  fechaCita?: string;

 @IsOptional()
  @IsNumber()
  patientId?: number

  @IsOptional()
  @IsNumber()
  medicoId?: number;

  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsString()
  consultorio?: string;

  @IsOptional()
  @IsString()
  telefono?: string;
}
