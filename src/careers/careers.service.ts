import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Career } from './entities/career.entity';
import { CreateCareerDto } from './dto/create-career.dto';
import { UpdateCareerDto } from './dto/update-career.dto';

@Injectable()
export class CareersService {
  constructor(
    @InjectRepository(Career)
    private readonly careerRepository: Repository<Career>,
  ) {}

  async create(createCareerDto: CreateCareerDto): Promise<Career> {
    const career = this.careerRepository.create(createCareerDto);
    return await this.careerRepository.save(career);
  }

  async findAll(): Promise<Career[]> {
    return await this.careerRepository.find();
  }

  async findOne(id: number): Promise<Career> {
    const career = await this.careerRepository.findOne({ where: { id } });
    if (!career) {
      throw new NotFoundException(`Carrera con ID ${id} no encontrada`);
    }
    return career;
  }

  async update(id: number, updateCareerDto: UpdateCareerDto): Promise<Career> {
    const career = await this.findOne(id);
    Object.assign(career, updateCareerDto);
    return await this.careerRepository.save(career);
  }

  async remove(id: number): Promise<Career> {
    const career = await this.findOne(id);
    return await this.careerRepository.remove(career);
  }
}
