import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Patch, 
  Req, 
  UseGuards,
  Logger, 
} from '@nestjs/common';

import { ConsultasService } from '../services/consultas.service';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('consultas')
export class ConsultasController {
  private readonly logger = new Logger(ConsultasController.name);
  constructor(private readonly consultasService: ConsultasService) {}

  // ===============================
  // CREAR CONSULTA – SOLO MÉDICO
  // ===============================
  @Post()
  @Roles('MEDICO')
  create(@Body() dto: CreateConsultaDto, @Req() req) {
    
    console.log("🔍 req.user recibido desde el token:", req.user);

    const medicoId = req.user.medicoId;

    if (!medicoId) {
      throw new Error("No se encontró el ID del médico en el token.");
    }

    return this.consultasService.create(dto, medicoId);
  }

  // ===============================
  // LISTAR TODAS LAS CONSULTAS
  // Admin y médico
  // ===============================
  @Get()
  @Roles('ADMIN', 'MEDICO')
  async findAll() {
    try {
      const list = await this.consultasService.findAll();
      this.logger.debug(`Returning ${list?.length ?? 0} consultas to admin/medico`);
      return list;
    } catch (err) {
      this.logger.error('Error loading consultas for admin:', err?.stack ?? err);
      return [] as any;
    }
  }

  // ===============================
  // CONSULTAS POR PACIENTE
  // ===============================
  @Get('patient/:id')
  @Roles('ADMIN', 'MEDICO')
  findByPatient(@Param('id') id: number) {
    return this.consultasService.findByPatient(id);
  }

  // ===============================
  // CONSULTAS DEL PACIENTE AUTENTICADO
  // ===============================
  @Get('mine')
  @Roles('PACIENTE')
  findMine(@Req() req) {
    const usuarioId = Number(req.user?.id);
    return this.consultasService.findByPacienteUsuario(usuarioId);
  }

  // ===============================
  // CONSULTAS POR MÉDICO
  // ===============================
  @Get('doctor/:id')
  @Roles('ADMIN', 'MEDICO')
  findByMedico(@Param('id') id: number) {
    return this.consultasService.findByMedico(id);
  }

  // ===============================
  // ACTUALIZAR CONSULTA
  // Admin y médico
  // ===============================
  @Patch(':id')
  @Roles('ADMIN', 'MEDICO')
  update(@Param('id') id: number, @Body() dto: UpdateConsultaDto) {
    return this.consultasService.update(id, dto);
  }

  // ===============================
  // ELIMINAR CONSULTA
  // Solo admin
  // ===============================
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: number) {
    return this.consultasService.remove(id);
  }
}
