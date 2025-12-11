import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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
    const medicoId = (createCitaDto as any).medicoId ?? (createCitaDto as any).doctorId ?? (createCitaDto as any).medico_id;
    if (!medicoId) throw new BadRequestException('medicoId es requerido');
    const medico = await this.medicosRepository.findOne({ where: { id: Number(medicoId) } });

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

    const saved = await this.citasRepository.save(cita as any);
    return this.findOne(saved.id);
  }

  private normalizeCita(cita: Cita) {
    if (!cita) return cita;
    const asAny = cita as any;
    if (asAny.patient && !asAny.paciente) asAny.paciente = asAny.patient;
    if (asAny.patient && !asAny.pacienteId) asAny.pacienteId = asAny.patient.id;
    if (asAny.medico && !asAny.medicoId) asAny.medicoId = asAny.medico.id;
    return asAny as Cita;
  }

  private normalizeManyCitas(list: Cita[]) {
    return list.map((c) => this.normalizeCita(c));
  }

 async findAll(): Promise<Cita[]> {
  const list = await this.citasRepository
    .createQueryBuilder('cita')
    .leftJoinAndSelect('cita.patient', 'patient')
    .leftJoinAndSelect('cita.medico', 'medico')
    .leftJoinAndSelect('medico.usuario', 'usuarioMedico')
    .select([
      'cita',
      'patient.id',
      'patient.nombre',
      'patient.apellidoPaterno',
      'patient.apellidoMaterno',
      'patient.email',
      'medico.id',
      'medico.nombre',
      'medico.apellidoPaterno',
      'medico.apellidoMaterno',
      'usuarioMedico.email',
    ])
      .getMany();
    return this.normalizeManyCitas(list);
}

async findOne(id: number): Promise<Cita> {
  const cita = await this.citasRepository
    .createQueryBuilder('cita')
    .leftJoinAndSelect('cita.patient', 'patient')
    .leftJoinAndSelect('cita.medico', 'medico')
    .leftJoinAndSelect('medico.usuario', 'usuarioMedico')
    .select([
      'cita',
      'patient.id',
      'patient.nombre',
      'patient.apellidoPaterno',
      'patient.apellidoMaterno',
      'patient.email',
      'medico.id',
      'medico.nombre',
      'medico.apellidoPaterno',
      'medico.apellidoMaterno',
      'usuarioMedico.email',
    ])
    .where('cita.id = :id', { id })
    .getOne();

  if (!cita) throw new NotFoundException(`Cita con ID ${id} no encontrada`);
  return this.normalizeCita(cita);
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

    const saved = await this.citasRepository.save(cita);
    return this.findOne(saved.id);
  }

  async remove(id: number): Promise<Cita> {
    const cita = await this.findOne(id);
    return this.citasRepository.remove(cita);
  }
  async findByPacienteId(usuarioId: number): Promise<Cita[]> {
    const patient = await this.patientsRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    if (!patient) {
      throw new NotFoundException(
        `No existe paciente asociado al usuario con ID ${usuarioId}`,
      );
    }

    const list = await this.citasRepository.find({
      where: { patient: { id: patient.id } },
      relations: ['patient', 'medico'],
    });
    return this.normalizeManyCitas(list);
  }

  

  async findMine(usuarioId: number, userEmail?: string): Promise<Cita[]> {
    const whereConditions: any[] = [{ usuario: { id: usuarioId } }];
    if (userEmail) {
      whereConditions.push({ email: userEmail });
    }

    const patients = await this.patientsRepository.find({ where: whereConditions });

    if (!patients || patients.length === 0) {
      throw new NotFoundException(
        `No existe paciente asociado al usuario con ID ${usuarioId} ni al email ${userEmail}`,
      );
    }

    const patientIds = patients.map((p) => p.id);

    const list = await this.citasRepository.find({
      where: { patient: { id: In(patientIds) } },
      relations: ['patient', 'medico'],
    });

    return this.normalizeManyCitas(list);
  }

  async createForPaciente(dto: CreateCitaDto, usuarioId: number): Promise<Cita> {
    const patient = await this.patientsRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['usuario'],
    });

    if (!patient) {
      throw new NotFoundException(`No existe paciente asociado al usuario con ID ${usuarioId}`);
    }

  const medicoId = (dto as any).medicoId ?? (dto as any).doctorId ?? (dto as any).medico_id;
  if (!medicoId) throw new BadRequestException('medicoId es requerido');
  const medico = await this.medicosRepository.findOne({ where: { id: Number(medicoId) } });
  if (!medico) throw new NotFoundException('Médico no encontrado');

    const cita = this.citasRepository.create({
      fechaDeseada: dto.fechaDeseada ? new Date(dto.fechaDeseada) : undefined,
      fechaCita: dto.fechaCita ? new Date(dto.fechaCita) : undefined,
      patient,
      medico,
      especialidad: dto.especialidad,
      motivo: dto.motivo,
      consultorio: dto.consultorio,
      telefono: dto.telefono,
    } as any);

    const saved = await this.citasRepository.save(cita as any);
    return this.findOne(saved.id);
  }
}
