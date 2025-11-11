import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultasService } from './services/consultas.service';
import { ConsultasController } from './controllers/consultas.controller';
import { Consulta } from './entities/consulta.entity';
import { Patient } from '../patients/entities/patient.entity';
import { Medico } from '../medicos/entities/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta, Patient, Medico])],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
