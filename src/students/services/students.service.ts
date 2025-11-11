import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';

interface UpdateStudentData {
  nombre?: string;
  email?: string;
  telefono?: string;
  usuario?: { id: number };
  universidad?: { id: number };
  carrera?: { id: number };
  generacion?: { id: number };
}

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentsRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const student = this.studentsRepository.create({
      ...createStudentDto,
      usuario: { id: createStudentDto.usuarioId },
      universidad: { id: createStudentDto.universidadId },
      carrera: { id: createStudentDto.carreraId },
      generacion: { id: createStudentDto.generacionId },
    });
    return this.studentsRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return this.studentsRepository.find({
      relations: ['usuario', 'universidad', 'carrera', 'generacion'],
    });
  }

  async findOne(id: number): Promise<Student> {
    const student = await this.studentsRepository.findOne({
      where: { id },
      relations: ['usuario', 'universidad', 'carrera', 'generacion'],
    });
    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }
    return student;
  }

  async update(
    id: number,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const student = await this.findOne(id);

    const updateData: UpdateStudentData = { ...updateStudentDto };
    if (updateStudentDto.usuarioId) {
      updateData.usuario = { id: updateStudentDto.usuarioId };
    }
    if (updateStudentDto.universidadId) {
      updateData.universidad = { id: updateStudentDto.universidadId };
    }
    if (updateStudentDto.carreraId) {
      updateData.carrera = { id: updateStudentDto.carreraId };
    }
    if (updateStudentDto.generacionId) {
      updateData.generacion = { id: updateStudentDto.generacionId };
    }

    Object.assign(student, updateData);
    return this.studentsRepository.save(student);
  }

  async remove(id: number): Promise<Student> {
    const student = await this.findOne(id);
    return this.studentsRepository.remove(student);
  }
}
