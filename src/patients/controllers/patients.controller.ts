import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // ============================
  // ADMIN CREA PACIENTES NORMALES
  // ============================
  @Roles(Rol.ADMIN)
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  // ============================
  // MÉDICO REGISTRA PACIENTES PRIVADOS
  // ============================
  @Roles(Rol.MEDICO)
  @Post('register')
  registerPatient(@Body() dto: CreatePatientDto, @Req() req) {
    const medicoId = req.user.medicoId || req.user.medico?.id || req.user.id;

    if (!medicoId) {
      throw new BadRequestException('El médico no tiene ID válido');
    }

    return this.patientsService.createByMedico(dto, medicoId);
  }

  // ============================
  // PACIENTE CONSULTA SUS DATOS
  // ============================
  @Roles(Rol.ADMIN, Rol.PACIENTE)
  @Get('me')
  async getMyInfo(@Req() req) {
    const userId = req.user.id;
    return this.patientsService.findByUserId(userId);
  }

  // ============================
  // LISTA DE PACIENTES RELACIONADOS
  // ============================
  @Roles(Rol.ADMIN, Rol.MEDICO, Rol.PACIENTE)
  @Get('mine')
  findMyPatients(@Req() req) {
    const role = req.user?.rol || req.user?.role;

    if (role === 'MEDICO') {
      const medicoId = req.user.medicoId || req.user.medico?.id || req.user.id;
      return this.patientsService.findByMedico(medicoId);
    }

    if (role === 'PACIENTE') {
      const userId = req.user?.id;
      return this.patientsService.findByUserId(userId);
    }

    // ADMIN: todos los pacientes
    return this.patientsService.findAll();
  }

  // ============================
  // LISTA DE PACIENTES PARA SELECTS
  // ============================
  @Roles(Rol.ADMIN, Rol.MEDICO, Rol.PACIENTE)
  @Get('select')
  async selectList(@Req() req) {
    const role = req.user?.rol ?? req.user?.role ?? null;

    if (!role) {
      throw new ForbiddenException('No se pudo determinar el rol del usuario');
    }

    // PACIENTE: solo él mismo
    if (role === 'PACIENTE') {
      const userId = req.user?.id;
      if (!userId) throw new BadRequestException('Usuario inválido');
      const patient = await this.patientsService.findByUserId(userId);
      return [patient];
    }

    // MÉDICO: solo sus pacientes
    if (role === 'MEDICO') {
      const medicoId = req.user?.medicoId || req.user?.medico?.id;
      if (!medicoId) return [];
      return this.patientsService.findByMedico(medicoId);
    }

    // ADMIN: todos los pacientes
    if (role === 'ADMIN') {
      return this.patientsService.findAll();
    }

    return [];
  }

  // ============================
  // LISTAR TODOS – ADMIN Y MEDICO
  // ============================
  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  // ============================
  // VER DETALLE DE PACIENTE – TODOS
  // ============================
  @Roles(Rol.ADMIN, Rol.MEDICO, Rol.PACIENTE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID de paciente inválido');
    }
    return this.patientsService.findOne(numericId);
  }

  // ============================
  // ACTUALIZAR PACIENTE
  // ============================
  @Roles(Rol.ADMIN, Rol.PACIENTE, Rol.MEDICO)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
    @Req() req,
  ) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID de paciente inválido');
    }

    // ADMIN: puede editar cualquier paciente sin restricciones
    if (req.user.rol === Rol.ADMIN) {
      return this.patientsService.update(numericId, updatePatientDto);
    }

    // PACIENTE y MEDICO: necesitan permisos
    if (req.user.rol === Rol.PACIENTE || req.user.rol === Rol.MEDICO) {
      const patient = await this.patientsService.findOne(numericId);

      if (req.user.rol === Rol.PACIENTE) {
        if (patient.usuario?.id !== req.user.id) {
          throw new ForbiddenException(
            'No tienes permiso para actualizar este paciente',
          );
        }
      }

      if (req.user.rol === Rol.MEDICO) {
        const medicoId =
          req.user.medicoId || req.user.medico?.id || req.user.id;
        if (!medicoId) {
          throw new BadRequestException('El médico no tiene ID válido');
        }
        if (patient.medicoId !== medicoId) {
          throw new ForbiddenException(
            'No tienes permiso para actualizar este paciente',
          );
        }
      }
    }

    return this.patientsService.update(numericId, updatePatientDto);
  }

  // ============================
  // ELIMINAR – SOLO ADMIN
  // ============================
  @Roles(Rol.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
