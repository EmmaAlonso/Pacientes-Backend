import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Generation } from './entities/generation.entity';
import { CreateGenerationDto } from './dto/create-generation.dto';
import { UpdateGenerationDto } from './dto/update-generation.dto';

@Injectable()
export class GenerationsService {
  constructor(
    @InjectRepository(Generation)
    private readonly generationRepository: Repository<Generation>,
  ) {}

  async create(createGenerationDto: CreateGenerationDto): Promise<Generation> {
    const generation = this.generationRepository.create(createGenerationDto);
    return await this.generationRepository.save(generation);
  }

  async findAll(): Promise<Generation[]> {
    return await this.generationRepository.find();
  }

  async findOne(id: number): Promise<Generation> {
    const generation = await this.generationRepository.findOne({
      where: { id },
    });
    if (!generation) {
      throw new NotFoundException(`Generación con ID ${id} no encontrada`);
    }
    return generation;
  }

  async update(
    id: number,
    updateGenerationDto: UpdateGenerationDto,
  ): Promise<Generation> {
    const generation = await this.findOne(id);
    Object.assign(generation, updateGenerationDto);
    return await this.generationRepository.save(generation);
  }

  async remove(id: number): Promise<Generation> {
    const generation = await this.findOne(id);
    return await this.generationRepository.remove(generation);
  }
}
