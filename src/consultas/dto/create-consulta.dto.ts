import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateConsultaDto {
  @IsInt()
  pacienteId: number;

  @IsInt()
  doctorId: number;

  @IsString()
  @IsNotEmpty()
  diagnostico: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
