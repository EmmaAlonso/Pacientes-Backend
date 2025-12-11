import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsNumber } from "class-validator";
import { TipoSangreEnum } from "../entities/consulta.entity";

export class CreateConsultaDto {
  @IsInt()
  pacienteId: number;

  @IsString()
  @IsNotEmpty()
  motivoConsulta: string;

  @IsString()
  @IsNotEmpty()
  sintomas: string;

  @IsEnum(TipoSangreEnum)
  tipoSangre: TipoSangreEnum;

  @IsOptional()
  @IsString()
  alergias?: string;

  @IsString()
  @IsNotEmpty()
  tratamiento: string;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsNumber()
  peso?: number;

  @IsOptional()
  @IsNumber()
  estatura?: number;
}
