import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

  async create(dto: CreateConsultaDto, doctorId: number) {
    const patient = await this.patientRepo.findOne({
      where: { id: dto.pacienteId },
    });

    const medico = await this.medicoRepo.findOne({
      where: { id: doctorId },
    });

    if (!patient) throw new NotFoundException('Patient not found');
    if (!medico) throw new NotFoundException('Doctor not found');

    const consulta = this.consultaRepo.create({
      patient,
      medico,
      motivoConsulta: dto.motivoConsulta,
      sintomas: dto.sintomas,
      tipoSangre: dto.tipoSangre,
      alergias: dto.alergias,
      peso: dto.peso,
      estatura: dto.estatura,
      tratamiento: dto.tratamiento,
      observaciones: dto.observaciones,
    });

    const saved = await this.consultaRepo.save(consulta);
    return this.findOne(saved.id);
  }

  // Normalizar la forma para frontend (soportar propiedad `paciente` en lugar de `patient`)
  private normalizeConsulta(consulta: Consulta) {
    if (!consulta) return consulta;
    const asAny = consulta as any;
    if (asAny.patient && !asAny.paciente) asAny.paciente = asAny.patient;
    if (asAny.medico && !asAny.medico) asAny.medico = asAny.medico; // no-op, keep for symmetry
    if (asAny.patient && !asAny.pacienteId) asAny.pacienteId = asAny.patient.id;
    if (asAny.medico && !asAny.medicoId) asAny.medicoId = asAny.medico.id;
    // Aliases for frontend: accept peso/estatura or weight/height
    if (asAny.peso !== undefined && asAny.weight === undefined) asAny.weight = asAny.peso;
    if (asAny.estatura !== undefined && asAny.height === undefined) asAny.height = asAny.estatura;
    return asAny as Consulta;
  }

  private normalizeMany(list: Consulta[]) {
    return list.map((c) => this.normalizeConsulta(c));
  }

  // 🔹 Devuelve TODAS las consultas con datos completos del médico y paciente
  async findAll() {
    const list = await this.consultaRepo
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient')
      .leftJoinAndSelect('consulta.medico', 'medico')
      .select([
        'consulta',
        'patient.id',
        'patient.nombre',
        'patient.apellidoPaterno',
        'patient.apellidoMaterno',
        'patient.email',
        'medico.id',
        'medico.nombre',
        'medico.apellidoPaterno',
        'medico.apellidoMaterno',
        'medico.especialidad',
        'medico.email',
      ])
      .orderBy('consulta.fechaCreacion', 'DESC')
      .getMany();
    return this.normalizeMany(list);
  }

  async findOne(id: number) {
    const consulta = await this.consultaRepo
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient')
      .leftJoinAndSelect('consulta.medico', 'medico')
      .select([
        'consulta',
        'patient.id',
        'patient.nombre',
        'patient.apellidoPaterno',
        'patient.apellidoMaterno',
        'patient.email',
        'medico.id',
        'medico.nombre',
        'medico.apellidoPaterno',
        'medico.apellidoMaterno',
        'medico.especialidad',
        'medico.email',
      ])
      .where('consulta.id = :id', { id })
      .getOne();

    if (!consulta) throw new NotFoundException('Consulta not found');
    return this.normalizeConsulta(consulta);
  }

  async findByPatient(patientId: number) {
    const list = await this.consultaRepo
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient')
      .leftJoinAndSelect('consulta.medico', 'medico')
      .select([
        'consulta',
        'patient.id',
        'patient.nombre',
        'patient.apellidoPaterno',
        'patient.apellidoMaterno',
        'patient.email',
        'medico.id',
        'medico.nombre',
        'medico.apellidoPaterno',
        'medico.apellidoMaterno',
        'medico.especialidad',
        'medico.email',
      ])
      .where('patient.id = :patientId', { patientId })
      .getMany();
    return this.normalizeMany(list);
  }

  async findByMedico(medicoId: number) {
    const list = await this.consultaRepo
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient')
      .leftJoinAndSelect('consulta.medico', 'medico')
      .select([
        'consulta',
        'patient.id',
        'patient.nombre',
        'patient.apellidoPaterno',
        'patient.apellidoMaterno',
        'patient.email',
        'medico.id',
        'medico.nombre',
        'medico.apellidoPaterno',
        'medico.apellidoMaterno',
        'medico.especialidad',
        'medico.email',
      ])
      .where('medico.id = :medicoId', { medicoId })
      .orderBy('consulta.fechaCreacion', 'DESC')
      .getMany();
    return this.normalizeMany(list);
  }

  async findByPacienteUsuario(usuarioId: number, userEmail?: string) {
    const whereConditions: any[] = [{ usuario: { id: usuarioId } }];
    if (userEmail) whereConditions.push({ email: userEmail });

    const patients = await this.patientRepo.find({ where: whereConditions });

    if (!patients || patients.length === 0) {
      throw new NotFoundException(
        `No existe paciente asociado al usuario con ID ${usuarioId}`,
      );
    }

    const patientIds = patients.map((p) => p.id);

    const list = await this.consultaRepo
      .createQueryBuilder('consulta')
      .leftJoinAndSelect('consulta.patient', 'patient')
      .leftJoinAndSelect('consulta.medico', 'medico')
      .select([
        'consulta',
        'patient.id',
        'patient.nombre',
        'patient.apellidoPaterno',
        'patient.apellidoMaterno',
        'patient.email',
        'medico.id',
        'medico.nombre',
        'medico.apellidoPaterno',
        'medico.apellidoMaterno',
        'medico.especialidad',
        'medico.email',
      ])
      .where('consulta.patient IN (:...patientIds)', { patientIds })
      .getMany();
    return this.normalizeMany(list);
  }

  async update(id: number, dto: UpdateConsultaDto) {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta not found');

    Object.assign(consulta, dto);
    const saved = await this.consultaRepo.save(consulta);
    return this.findOne(saved.id);
  }

  async remove(id: number) {
    const consulta = await this.consultaRepo.findOne({ where: { id } });
    if (!consulta) throw new NotFoundException('Consulta not found');
    return this.consultaRepo.remove(consulta);
  }
}
