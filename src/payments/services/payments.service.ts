import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { UpdatePaymentDto } from '../dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create({
      monto: createPaymentDto.monto,
      metodo_pago: createPaymentDto.metodo_pago,
      estado: createPaymentDto.estado,
      referencia: createPaymentDto.referencia,
      notas: createPaymentDto.notas,
      usuario: { id: createPaymentDto.usuario_id },
      student: { id: createPaymentDto.student_id },
      package: { id: createPaymentDto.package_id },
    } as Payment);
    return await this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentRepository.find({
      relations: ['usuario', 'student', 'package'],
    });
  }

  async findOne(id: number): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['usuario', 'student', 'package'],
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado`);
    }
    return payment;
  }

  async update(
    id: number,
    updatePaymentDto: UpdatePaymentDto,
  ): Promise<Payment | null> {
    const payment = await this.findOne(id);
    if (!payment) {
      return null;
    }

    const updateData = {
      monto: updatePaymentDto.monto,
      metodo_pago: updatePaymentDto.metodo_pago,
      estado: updatePaymentDto.estado,
      referencia: updatePaymentDto.referencia,
      notas: updatePaymentDto.notas,
      usuario: updatePaymentDto.usuario_id
        ? { id: updatePaymentDto.usuario_id }
        : undefined,
      student: updatePaymentDto.student_id
        ? { id: updatePaymentDto.student_id }
        : undefined,
      package: updatePaymentDto.package_id
        ? { id: updatePaymentDto.package_id }
        : undefined,
    } as Partial<Payment>;

    Object.assign(payment, updateData);
    return await this.paymentRepository.save(payment);
  }

  async remove(id: number): Promise<Payment> {
    const payment = await this.findOne(id);
    return await this.paymentRepository.remove(payment);
  }
}
