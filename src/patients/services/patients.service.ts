import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
  const { usuario, ...rest } = createPatientDto;

  // Crea el paciente con o sin usuario
  const patient = this.patientsRepository.create({
    ...rest,
    usuario: usuario ? { id: usuario.id } as any : null,
  });

  return await this.patientsRepository.save(patient);
}


  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({ where: { id } });
    if (!patient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);
    Object.assign(patient, updatePatientDto as Partial<Patient>);
    const saved = await this.patientsRepository.save(patient as Patient);
    return saved as Patient;
  }

  async remove(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    return this.patientsRepository.remove(patient);
  }

  async findByUserId(userId: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { usuario: { id: userId } },
    });
    if (!patient) 
      throw new NotFoundException(`Paciente con User ID ${userId} no encontrado`);
    return patient;
  }
}
