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
  Logger,
} from '@nestjs/common';
import { CitasService } from '../services/citas.service';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { UpdateCitaDto } from '../dto/update-cita.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citas')
export class CitasController {
  private readonly logger = new Logger(CitasController.name);
  constructor(private readonly citasService: CitasService) {}

  // 🔹 ADMIN o MEDICO crean cualquier cita
  @Roles('ADMIN', 'MEDICO')
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  // 🔹 PACIENTE crea su propia cita (usa /citas/create)
  @Roles('PACIENTE')
  @Post('create')
  createMyAppointment(@Body() dto: CreateCitaDto, @Req() req) {
    const userId = Number(req.user?.id);
    // fuerza que el paciente logueado sea el dueño
    return this.citasService.createForPaciente(dto, userId);
  }

  // 🔹 PACIENTE obtiene solo sus citas
  @Roles('PACIENTE')
  @Get('mine')
  findMine(@Req() req) {
    const userId = Number(req.user?.id);
    const userEmail = req.user?.email;
    return this.citasService.findMine(userId, userEmail);
  }

  // 🔹 ADMIN o MEDICO ven todas las citas
  @Roles('ADMIN', 'MEDICO')
  @Get()
  async findAll() {
    try {
      const list = await this.citasService.findAll();
      this.logger.debug(`Returning ${list?.length ?? 0} citas to admin/medico`);
      return list;
    } catch (err) {
      this.logger.error('Error loading citas for admin:', err?.stack ?? err);
      // Return empty list so UI doesn't crash; surface error in logs
      return [] as any;
    }
  }

  // 🔹 ADMIN, MEDICO o PACIENTE pueden ver una cita concreta
  @Roles('ADMIN', 'PACIENTE', 'MEDICO')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(+id);
  }

  // 🔹 ADMIN o MEDICO pueden editar citas
  @Roles('ADMIN', 'MEDICO')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(+id, updateCitaDto);
  }

  // 🔹 Solo ADMIN elimina citas
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(+id);
  }
}
