import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Medico } from '../entities/medico.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { Rol } from '../../common/enums/rol.enum';

@Injectable()
export class MedicosService {
  constructor(
    @InjectRepository(Medico)
    private readonly medicosRepository: Repository<Medico>,

    @InjectRepository(Usuario)
    private readonly usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createMedicoDto: CreateMedicoDto): Promise<Medico> {
  const { usuarioId, ...medicoData } = createMedicoDto;

  // 1) Verificar que el usuario exista
  const usuario = await this.usuariosRepository.findOne({
    where: { id: usuarioId },
  });

  if (!usuario) {
    throw new BadRequestException('El usuarioId no existe');
  }

  // 2) Crear médico asociado al usuario
  const nuevoMedico = this.medicosRepository.create({
    ...medicoData,
    usuario,
  });

  return await this.medicosRepository.save(nuevoMedico);
}


  async findAll(): Promise<Medico[]> {
    return this.medicosRepository.find({
      relations: ['usuario'],
    });
  }

  async findOne(id: number): Promise<Medico> {
    const medico = await this.medicosRepository.findOne({
      where: { id },
      relations: ['usuario'],
    });

    if (!medico) {
      throw new NotFoundException(`Médico con ID ${id} no encontrado`);
    }

    return medico;
  }

  async update(id: number, updateMedicoDto: UpdateMedicoDto): Promise<Medico> {
    const medico = await this.findOne(id);

    Object.assign(medico, updateMedicoDto);

    return await this.medicosRepository.save(medico);
  }

  async remove(id: number): Promise<Medico> {
    const medico = await this.findOne(id);
    return await this.medicosRepository.remove(medico);
  }


   async findByUsuarioId(usuarioId: number): Promise<Medico> {
  const medico = await this.medicosRepository.findOne({
    where: { usuario: { id: usuarioId } },
    relations: ['usuario'],
  });

  if (!medico) {
    throw new NotFoundException(
      `No existe médico asociado al usuario con ID ${usuarioId}`,
    );
  }

  return medico;
}

}
