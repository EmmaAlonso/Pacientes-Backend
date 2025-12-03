import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

/**
 * API Controller para endpoints consumidos por el frontend (prefijo /api/patients)
 * - Expone endpoints seguros para MEDICO (registro local de pacientes) y para obtener
 *   pacientes de un médico concreto.
 */
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/patients')
export class PatientsApiController {
  constructor(private readonly patientsService: PatientsService) {}

  // Ping público (útil para proxys / checks)
  @Get('ping')
  ping() {
    return { ok: true, path: '/api/patients/ping' };
  }

  /**
   * MÉDICO registra un paciente local (sin crear usuario en users).
   * Ruta: POST /api/patients/register
   * Roles: MEDICO
   */
  @Roles('MEDICO')
  @Post('register')
  async createByMedico(@Body() dto: CreatePatientDto, @Req() req) {
    // Extraemos el id del médico del JWT - varios formatos por compatibilidad
    const medicoId =
      req.user?.medicoId || req.user?.medico?.id || req.user?.sub || req.user?.id;

    if (!medicoId) {
      throw new BadRequestException('El médico no tiene ID válido en el token');
    }

    return this.patientsService.createByMedico(dto, Number(medicoId));
  }

  /**
   * MÉDICO obtiene sus pacientes.
   * Ruta: GET /api/patients/mine
   * Roles: MEDICO
   */
  @Roles('MEDICO')
  @Get('mine')
  async findMyPatients(@Req() req) {
    const medicoId =
      req.user?.medicoId || req.user?.medico?.id || req.user?.sub || req.user?.id;

    if (!medicoId) {
      throw new BadRequestException('El médico no tiene ID válido en el token');
    }

    return this.patientsService.findByMedico(Number(medicoId));
  }

  /**
   * Obtener pacientes de un médico por id (ADMIN o MEDICO).
   * Ruta: GET /api/patients/medico/:id
   * Roles: ADMIN, MEDICO
   */
  @Roles('ADMIN', 'MEDICO')
  @Get('medico/:id')
  async findByMedicoParam(@Param('id') id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID de médico inválido');
    }
    return this.patientsService.findByMedico(numericId);
  }
}
