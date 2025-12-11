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
} from '@nestjs/common';
import { MedicosService } from '../services/medicos.service';
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Roles(Rol.ADMIN)
  @Post()
  create(@Body() createMedicoDto: CreateMedicoDto) {
    return this.medicosService.create(createMedicoDto);
  }

  // 🔹 ADMIN y MEDICO pueden ver la lista completa de médicos
  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Get()
  findAll() {
    return this.medicosService.findAll();
  }

  // 🔹 PACIENTES pueden ver lista básica de médicos (id, nombre, especialidad)
  @Roles(Rol.PACIENTE, Rol.ADMIN, Rol.MEDICO)
  @Get('public')
  findPublic() {
    return this.medicosService.findPublic();
  }

  // Endpoint de prueba
  @Get('ping')
  ping() {
    return { ok: true, path: '/medicos/ping' };
  }

  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Get('me')
  me(@Req() req) {
    return this.medicosService.findByUsuarioId(req.user.id);
  }

  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Get(':id')
  findOne(@Param('id') id: string) {
    const numericId = Number(id);
    if (Number.isNaN(numericId)) {
      throw new BadRequestException('ID de médico inválido');
    }
    return this.medicosService.findOne(numericId);
  }

  @Roles(Rol.ADMIN, Rol.MEDICO)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedicoDto: UpdateMedicoDto) {
    return this.medicosService.update(+id, updateMedicoDto);
  }

  @Roles(Rol.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicosService.remove(+id);
  }
}
