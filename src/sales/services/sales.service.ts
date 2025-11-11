import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly salesRepository: Repository<Sale>,
  ) {}

  async create(createSaleDto: CreateSaleDto): Promise<Sale> {
    const sale = this.salesRepository.create({
      ...createSaleDto,
      usuario: { id: createSaleDto.usuarioId },
      student: { id: createSaleDto.studentId },
    });
    return this.salesRepository.save(sale);
  }

  async findAll(): Promise<Sale[]> {
    return this.salesRepository.find({
      relations: ['usuario', 'student'],
    });
  }

  async findOne(id: number): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      where: { id },
      relations: ['usuario', 'student'],
    });
    if (!sale) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return sale;
  }

  async update(id: number, updateSaleDto: UpdateSaleDto): Promise<Sale> {
    const sale = await this.findOne(id);

    const updateData: any = { ...updateSaleDto };
    if (updateSaleDto.usuarioId) {
      updateData.usuario = { id: updateSaleDto.usuarioId };
    }
    if (updateSaleDto.studentId) {
      updateData.student = { id: updateSaleDto.studentId };
    }

    Object.assign(sale, updateData);
    return this.salesRepository.save(sale);
  }

  async remove(id: number): Promise<Sale> {
    const sale = await this.findOne(id);
    return this.salesRepository.remove(sale);
  }
}
