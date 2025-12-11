import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Patient } from '../entities/patient.entity';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  // ===========================================================
  // 🔵 Crear paciente desde el ADMIN (puede tener usuario o no)
  // ===========================================================
  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { usuario, email, ...rest } = createPatientDto;

  let usuarioVinculado: Usuario | null = null;

    // 🔗 Vincular automáticamente por email si existe
    if (email) {
      usuarioVinculado = await this.usuariosRepository.findOne({
        where: { email },
      });
    }

    // 🔗 Si el admin mandó un usuario explícito, tiene prioridad
    if (usuario?.id) {
      usuarioVinculado = await this.usuariosRepository.findOne({
        where: { id: usuario.id },
      });
    }

    const patient = this.patientsRepository.create({
      ...rest,
      email,
      usuario: usuarioVinculado || undefined,
    });

    return await this.patientsRepository.save(patient);
  }

  // ===========================================================
  // 🔵 Crear paciente desde un MÉDICO
  // ===========================================================
  async createByMedico(dto: CreatePatientDto, medicoId: number): Promise<Patient> {
    if (!medicoId) {
      throw new BadRequestException('No se recibió el ID del médico');
    }

    const { email, ...rest } = dto;

    // 🔗 REQUERIR email cuando el paciente es creado por un MÉDICO
    if (!email) {
      throw new BadRequestException(
        'Se requiere email al crear un paciente desde un médico',
      );
    }

    // 🔗 SI el médico registró email → vincular automáticamente
    let usuarioVinculado: Usuario | null = null;

    usuarioVinculado = await this.usuariosRepository.findOne({
      where: { email },
    });

    const patient = this.patientsRepository.create({
      ...rest,
      email,
      medicoId,
      usuario: usuarioVinculado || undefined,
    });

    return await this.patientsRepository.save(patient);
  }

  // ===========================================================
  // 🔵 Obtener todos los pacientes
  // ===========================================================
  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find({
      relations: ['usuario'],
    });
  }

  // ===========================================================
  // 🔵 Buscar un paciente
  // ===========================================================
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!patient) throw new NotFoundException(`Paciente con ID ${id} no encontrado`);

    return patient;
  }

  // ===========================================================
  // 🔵 Actualizar paciente
  // ===========================================================
  async update(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    // Si el DTO contiene usuario: { id }, vinculamos esa cuenta explícitamente
    if (dto.usuario && typeof dto.usuario.id === 'number') {
      const user = await this.usuariosRepository.findOne({
        where: { id: dto.usuario.id },
      });
      if (!user) {
        throw new BadRequestException(
          `Usuario con ID ${dto.usuario.id} no encontrado`,
        );
      }
      patient.usuario = user;
    }

    // Aplicar otros campos del DTO (sin sobrescribir usuario si ya lo vinculamos arriba)
    const { usuario, ...rest } = dto as any;
    Object.assign(patient, rest);

    // 🔗 Si cambió el email, re-vincular al usuario correcto (prioritario si no se pasó usuario.id)
    if (dto.email && !dto.usuario) {
      const user = await this.usuariosRepository.findOne({
        where: { email: dto.email },
      });
      patient.usuario = user || undefined;
    }

    return this.patientsRepository.save(patient);
  }

  // ===========================================================
  // 🔵 Eliminar paciente
  // ===========================================================
  async remove(id: number): Promise<Patient> {
    const patient = await this.findOne(id);
    return this.patientsRepository.remove(patient);
  }

  // ===========================================================
  // 🔵 Buscar paciente desde el JWT del usuario
  // ===========================================================
  async findByUserId(userId: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOne({
      where: { usuario: { id: userId } },
      relations: ['usuario'],
    });

    if (!patient)
      throw new NotFoundException(`Paciente con User ID ${userId} no encontrado`);

    return patient;
  }

  // ===========================================================
  // 🔵 Pacientes registrados por un médico
  // ===========================================================
  async findByMedico(medicoId: number): Promise<Patient[]> {
    return this.patientsRepository.find({
      where: { medicoId },
      relations: ['usuario'],
    });
  }
}
