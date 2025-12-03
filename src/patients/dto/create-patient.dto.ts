import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellidoPaterno?: string;

  @IsOptional()
  @IsString()
  apellidoMaterno?: string;

  @IsOptional()
@IsEmail()
email?: string;


  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsNumber()
  edad?: number;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  ocupacion?: string;

  @IsOptional()
@IsNumber()
medicoId?: number;


  usuario?: { id: number };

}
