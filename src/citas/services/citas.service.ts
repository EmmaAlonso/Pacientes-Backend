import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cita } from '../entities/cita.entity';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';
import { Patient } from '../../patients/entities/patient.entity';
import { Medico } from '../../medicos/entities/medico.entity';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citasRepository: Repository<Cita>,
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Medico)
    private readonly medicosRepository: Repository<Medico>,
  ) {}

  async create(createCitaDto: CreateCitaDto): Promise<Cita> {
    const patient = await this.patientsRepository.findOne({ where: { id: createCitaDto.patientId } });
    const medico = await this.medicosRepository.findOne({ where: { id: createCitaDto.medicoId } });
    if (!patient) throw new NotFoundException('Paciente no encontrado');
    if (!medico) throw new NotFoundException('Médico no encontrado');

    const cita = this.citasRepository.create({
      fechaDeseada: createCitaDto.fechaDeseada ? new Date(createCitaDto.fechaDeseada) : undefined,
      fechaCita: createCitaDto.fechaCita ? new Date(createCitaDto.fechaCita) : undefined,
      patient,
      medico,
      especialidad: createCitaDto.especialidad,
      motivo: createCitaDto.motivo,
      consultorio: createCitaDto.consultorio,
      telefono: createCitaDto.telefono,
    } as any);

  const saved = (await this.citasRepository.save(cita as any)) as Cita;
  return saved;
  }

  async findAll(): Promise<Cita[]> {
    return this.citasRepository.find({ relations: ['patient', 'medico'] });
  }

  async findOne(id: number): Promise<Cita> {
    const cita = await this.citasRepository.findOne({ where: { id }, relations: ['paciente', 'medico'] });
    if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
    return cita;
  }

  async update(id: number, updateCitaDto: UpdateCitaDto): Promise<Cita> {
    const cita = await this.findOne(id);
    if (updateCitaDto.patientId) {
      const patient = await this.patientsRepository.findOne({ where: { id: updateCitaDto.patientId } });
      if (!patient) throw new NotFoundException('Paciente no encontrado');
      cita.patient = patient;
    }
    if (updateCitaDto.medicoId) {
      const medico = await this.medicosRepository.findOne({ where: { id: updateCitaDto.medicoId } });
      if (!medico) throw new NotFoundException('Médico no encontrado');
      cita.medico = medico;
    }
    Object.assign(cita, {
      fechaDeseada: updateCitaDto.fechaDeseada ? new Date(updateCitaDto.fechaDeseada) : cita.fechaDeseada,
      fechaCita: updateCitaDto.fechaCita ? new Date(updateCitaDto.fechaCita) : cita.fechaCita,
      especialidad: updateCitaDto.especialidad ?? cita.especialidad,
      motivo: updateCitaDto.motivo ?? cita.motivo,
      consultorio: updateCitaDto.consultorio ?? cita.consultorio,
      telefono: updateCitaDto.telefono ?? cita.telefono,
    });

    return this.citasRepository.save(cita);
  }

  async remove(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    return this.citasRepository.remove(cita);
  }
}
