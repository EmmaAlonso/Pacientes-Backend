import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity';
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicosRepository: Repository<Medico>,
  ) {}

  async create(createMedicoDto: CreateMedicoDto): Promise<Medico> {
    const medico = this.medicosRepository.create(createMedicoDto as Partial<Medico>);
    const saved = await this.medicosRepository.save(medico as Medico);
    return saved as Medico;
  }

  async findAll(): Promise<Medico[]> {
    return this.medicosRepository.find();
  }

  async findOne(id: number): Promise<Medico> {
    const medico = await this.medicosRepository.findOne({ where: { id } });
    if (!medico) {
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }
    return medico;
  }

  async update(id: number, updateMedicoDto: UpdateMedicoDto): Promise<Medico> {
    const medico = await this.findOne(id);
    Object.assign(medico, updateMedicoDto as Partial<Medico>);
    const saved = await this.medicosRepository.save(medico as Medico);
    return saved as Medico;
  }

  async remove(id: number): Promise<Medico> {
    const medico = await this.findOne(id);
    return this.medicosRepository.remove(medico);
  }
}
