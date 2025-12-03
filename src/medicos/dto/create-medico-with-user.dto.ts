import { IsNotEmpty, IsString, IsOptional, IsEmail, MinLength } from 'class-validator';

export class CreateMedicoWithUserDto {
  // Datos del usuario
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  // Datos del médico
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
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  consultorio?: string;
}
