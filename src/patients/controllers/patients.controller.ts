import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Req } from '@nestjs/common';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // Solo el ADMIN puede crear pacientes manualmente
  @Roles('ADMIN')
  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  // ADMIN y MEDICO pueden listar pacientes
  @Roles('ADMIN', 'MEDICO')
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  // ADMIN, MEDICO y PACIENTE pueden ver detalles
  @Roles('ADMIN', 'MEDICO', 'PACIENTE')
@Get('me')
getMyData(@Req() req) {
  const userId = req.user.id;
  return this.patientsService.findByUserId(userId);
}
  
  @Roles('ADMIN', 'MEDICO', 'PACIENTE')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  // ADMIN y PACIENTE pueden actualizar su información
  @Roles('ADMIN', 'PACIENTE')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  // Solo el ADMIN puede eliminar
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}
