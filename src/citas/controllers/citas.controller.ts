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
import { Rol } from '../../common/enums/rol.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('citas')
export class CitasController {
  private readonly logger = new Logger(CitasController.name);
  constructor(private readonly citasService: CitasService) {}

  // 🔹 ADMIN o MEDICO crean cualquier cita
  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Post()
  create(@Body() createCitaDto: CreateCitaDto) {
    return this.citasService.create(createCitaDto);
  }

  // 🔹 PACIENTE crea su propia cita (usa /citas/create)
  @Roles(Rol.PACIENTE)
  @Post('create')
  createMyAppointment(@Body() dto: CreateCitaDto, @Req() req) {
    const userId = Number(req.user?.id);
    // fuerza que el paciente logueado sea el dueño
    return this.citasService.createForPaciente(dto, userId);
  }

  // 🔹 PACIENTE obtiene solo sus citas
  @Roles(Rol.PACIENTE)
  @Get('mine')
  findMine(@Req() req) {
    const userId = Number(req.user?.id);
    const userEmail = req.user?.email;
    return this.citasService.findMine(userId, userEmail);
  }

  // 🔹 ADMIN o MEDICO ven todas las citas
  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Get()
  async findAll(@Req() req) {
    try {
      this.logger.log(`User requesting citas: ${JSON.stringify(req.user)}`);
      const list = await this.citasService.findAll();
      this.logger.log(`Returning ${list?.length ?? 0} citas to admin/medico`);
      return list;
    } catch (err) {
      this.logger.error('Error loading citas for admin:', err?.stack ?? err);
      throw err;
    }
  }

  // 🔹 ADMIN, MEDICO o PACIENTE pueden ver una cita concreta
  @Roles(Rol.ADMIN, Rol.PACIENTE, Rol.MEDICO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.citasService.findOne(+id);
  }

  // 🔹 ADMIN o MEDICO pueden editar citas
  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCitaDto: UpdateCitaDto) {
    return this.citasService.update(+id, updateCitaDto);
  }

  // 🔹 Solo ADMIN elimina citas
  @Roles(Rol.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.citasService.remove(+id);
  }
}
