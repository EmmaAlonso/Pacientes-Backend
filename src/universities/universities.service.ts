import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { University } from './entities/university.entity';
import { CreateUniversityDto } from '../universities/dto/create-university.dto';
import { UpdateUniversityDto } from '../universities/dto/update-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
  ) {}

  async create(
    createUniversityDto: CreateUniversityDto | CreateUniversityDto[],
  ): Promise<University | University[]> {
    if (Array.isArray(createUniversityDto)) {
      const universities =
        this.universityRepository.create(createUniversityDto);
      return this.universityRepository.save(universities);
    } else {
      const university = this.universityRepository.create(createUniversityDto);
      return this.universityRepository.save(university);
    }
  }

  async findAll(): Promise<University[]> {
    return this.universityRepository.find();
  }

  async findOne(id: number): Promise<University> {
    const university = await this.universityRepository.findOne({
      where: { id },
    });
    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
    return university;
  }

  async update(
    id: number,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University> {
    const university = await this.findOne(id);
    Object.assign(university, updateUniversityDto);
    return this.universityRepository.save(university);
  }

  async remove(id: number): Promise<void> {
    const result = await this.universityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }
  }
}
