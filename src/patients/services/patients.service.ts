import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
  ) {}

  /**
   * 🔵 Crear paciente desde el ADMIN (requiere usuario opcional)
   */
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { usuario, ...rest } = createPatientDto;

    const patient = this.patientsRepository.create({
      ...rest,
      usuario: usuario ? ({ id: usuario.id } as any) : null,
    });

    return await this.patientsRepository.save(patient);
  }

  /**
   * 🔵 Crear paciente desde un MÉDICO (sin usuario, sin contraseña)
   */
  async createByMedico(dto: CreatePatientDto, medicoId: number): Promise<Patient> {
    if (!medicoId) {
      throw new BadRequestException('No se recibió el ID del médico');
    }

    const patient = this.patientsRepository.create({
      ...dto,
      medicoId, // <-- se asocia al médico
    });

    return this.patientsRepository.save(patient);
  }

  /**
   * 🔵 Obtener todos los pacientes (solo ADMIN)
   */
  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  /**
   * 🔵 Obtener un paciente por ID
   */
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return patient;
  }

  /**
   * 🔵 Actualizar paciente
   */
  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto);
    return this.patientsRepository.save(patient);
  }

  /**
   * 🔵 Eliminar paciente
   */
  async remove(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    return this.patientsRepository.remove(patient);
  }

  /**
   * 🔵 Obtener paciente por ID de usuario (login de paciente)
   */
  async findByUserId(userId: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { usuario: { id: userId } },
    });

    if (!patient)
      throw new NotFoundException(`Paciente con User ID ${userId} no encontrado`);

    return patient;
  }

  /**
   * 🔵 Obtener pacientes registrados por un médico
   */
  async findByMedico(medicoId: number): Promise<Patient[]> {
    return this.patientsRepository.find({
      where: { medicoId },
    });
  }
}
