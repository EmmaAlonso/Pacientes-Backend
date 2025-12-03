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
  // Ruta correcta: POST /patients/register
  // ============================
  @Roles('MEDICO')
  @Post('register')
  registerPatient(@Body() dto: CreatePatientDto, @Req() req) {
    const medicoId =
      req.user.medicoId || req.user.medico?.id || req.user.id;

    if (!medicoId) {
      throw new BadRequestException('El médico no tiene ID válido');
    }

    return this.patientsService.createByMedico(dto, medicoId);
  }

  // ============================
  // MÉDICO LISTA SUS PACIENTES
  // Ruta: GET /patients/mine
  // ============================
  @Roles('MEDICO')
  @Get('mine')
  findMyPatients(@Req() req) {
    const medicoId =
      req.user.medicoId || req.user.medico?.id || req.user.id;

    return this.patientsService.findByMedico(medicoId);
  }

  // ============================
  // ACTUALIZAR PACIENTE
  // ============================
  @Roles('ADMIN', 'PACIENTE')
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

    if (req.user.rol === 'PACIENTE') {
      const patient = await this.patientsService.findOne(numericId);

      if (patient.usuario?.id !== req.user.id) {
        throw new ForbiddenException(
          'No tienes permiso para actualizar este paciente',
        );
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
