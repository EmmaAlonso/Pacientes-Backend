import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class CreateStudentDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellido: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  matricula?: string;

  @IsOptional()
  @IsNumber()
  saldo?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @IsNotEmpty()
  @IsNumber()
  usuarioId: number;

  @IsNotEmpty()
  @IsNumber()
  universidadId: number;

  @IsNotEmpty()
  @IsNumber()
  carreraId: number;

  @IsNotEmpty()
  @IsNumber()
  generacionId: number;
}
