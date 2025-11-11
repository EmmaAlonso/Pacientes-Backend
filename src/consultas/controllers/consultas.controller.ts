import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ConsultasService } from '../services/consultas.service';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';

@Controller('consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  create(@Body() dto: CreateConsultaDto) {
    return this.consultasService.create(dto);
  }

  @Get()
  findAll() {
    return this.consultasService.findAll();
  }

  @Get('patient/:id')
  findByPatient(@Param('id') id: number) {
    return this.consultasService.findByPatient(id);
  }

  @Get('doctor/:id')
  findByMedico(@Param('id') id: number) {
    return this.consultasService.findByMedico(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() dto: UpdateConsultaDto) {
    return this.consultasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.consultasService.remove(id);
  }
}
