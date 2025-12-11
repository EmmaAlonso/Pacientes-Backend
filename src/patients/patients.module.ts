import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { PatientsApiController } from './controllers/patients.api.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, Usuario])],
  controllers: [PatientsController, PatientsApiController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
