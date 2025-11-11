import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsEnum,
} from 'class-validator';
import { MetodoPago, EstadoPago } from '../entities/payment.entity';

export class CreatePaymentDto {
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  monto: number;

  @IsEnum(MetodoPago)
  @IsNotEmpty()
  metodo_pago: MetodoPago;

  @IsEnum(EstadoPago)
  @IsNotEmpty()
  estado: EstadoPago;

  @IsNumber()
  @IsNotEmpty()
  usuario_id: number;

  @IsNumber()
  @IsNotEmpty()
  student_id: number;

  @IsNumber()
  @IsNotEmpty()
  package_id: number;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  notas?: string;
}
