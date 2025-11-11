import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from '../entities/consulta.entity';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';
import { Patient } from '../../patients/entities/patient.entity';
import { Medico } from '../../medicos/entities/medico.entity';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultaRepo: Repository<Consulta>,

    @InjectRepository(Patient)
    private patientRepo: Repository<Patient>,

    @InjectRepository(Medico)
    private medicoRepo: Repository<Medico>,
  ) {}

  async create(dto: CreateConsultaDto) {
    const patient = await this.patientRepo.findOne({ where: { id: dto.pacienteId } });
    const medico = await this.medicoRepo.findOne({ where: { id: dto.doctorId } });

    if (!patient) throw new NotFoundException('Patient not found');
    if (!medico) throw new NotFoundException('Doctor not found');

    const consulta = this.consultaRepo.create({
      patient,
      medico,
      diagnostico: dto.diagnostico,
      tratamiento: dto.tratamiento,
      observaciones: dto.observaciones,
    });

    return await this.consultaRepo.save(consulta);
  }

  async findAll() {
    return this.consultaRepo.find();
  }

  async findByPatient(patientId: number) {
    return this.consultaRepo.find({
      where: { patient: { id: patientId } },
    });
  }

  async findByMedico(medicoId: number) {
    return this.consultaRepo.find({
      where: { medico: { id: medicoId } },
    });
  }

  async update(id: number, dto: UpdateConsultaDto) {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta not found');

    Object.assign(consulta, dto);
    return this.consultaRepo.save(consulta);
  }

  async remove(id: number) {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta not found');
    return this.consultaRepo.remove(consulta);
  }
}
