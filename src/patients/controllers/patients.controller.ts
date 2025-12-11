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

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // ============================
  // ADMIN CREA PACIENTES NORMALES
  // ============================
  @Roles('ADMIN')
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  // ============================
  // PACIENTE CONSULTA SUS DATOS
  // ============================
  @Roles('ADMIN', 'PACIENTE')
  @Get('me')
  async getMyInfo(@Req() req) {
    const userId = req.user.id;
    return this.patientsService.findByUserId(userId);
  }

  // ============================
  // LISTAR TODOS – ADMIN Y MEDICO
  // ============================
  @Roles('ADMIN', 'MEDICO')
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  // ============================
  // VER DETALLE DE PACIENTE – TODOS
  // ============================
  @Roles('ADMIN', 'MEDICO', 'PACIENTE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID de paciente inválido');
    }
    return this.patientsService.findOne(numericId);
  }

  // ============================
  // MÉDICO REGISTRA PACIENTES PRIVADOS
  // ============================
  @Roles('MEDICO')
  @Post('register')
  registerPatient(@Body() dto: CreatePatientDto, @Req() req) {
    const medicoId = req.user.medicoId || req.user.medico?.id || req.user.id;

    if (!medicoId) {
      throw new BadRequestException('El médico no tiene ID válido');
    }

    return this.patientsService.createByMedico(dto, medicoId);
  }

  // ============================
  // LISTA DE PACIENTES RELACIONADOS
  // ============================
  @Roles('MEDICO', 'PACIENTE')
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

    return this.patientsService.findAll();
  }

  // ============================
  // LISTA DE PACIENTES PARA SELECTS
  // ============================
 @Roles('ADMIN', 'MEDICO', 'PACIENTE')
@Get('select')
async selectList(@Req() req) {
  const role = req.user?.rol ?? req.user?.role ?? null;

  if (!role) {
    throw new ForbiddenException("No se pudo determinar el rol del usuario");
  }

  // PACIENTE: solo él mismo
  if (role === 'PACIENTE') {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException("Usuario inválido");
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
  // ACTUALIZAR PACIENTE
  // ============================
  @Roles('ADMIN', 'PACIENTE', 'MEDICO')
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

    if (req.user.rol === 'PACIENTE' || req.user.rol === 'MEDICO') {
      const patient = await this.patientsService.findOne(numericId);

      if (req.user.rol === 'PACIENTE') {
        if (patient.usuario?.id !== req.user.id) {
          throw new ForbiddenException(
            'No tienes permiso para actualizar este paciente',
          );
        }
      }

      if (req.user.rol === 'MEDICO') {
        const medicoId = req.user.medicoId || req.user.medico?.id || req.user.id;
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
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
