import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCitaDto {
  @IsOptional()
  @IsDateString()
  fechaDeseada?: string;

  @IsOptional()
  @IsDateString()
  fechaCita?: string;

  @IsNotEmpty()
  @IsNumber()
  patientId: number;

  @IsNotEmpty()
  @IsNumber()
  medicoId: number;

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
