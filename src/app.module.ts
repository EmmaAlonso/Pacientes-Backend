import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PatientsModule } from './patients/patients.module';
import { MedicosModule } from './medicos/medicos.module';
import { CitasModule } from './citas/citas.module';
import { PaymentsModule } from './payments/payments.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { Cita } from './citas/entities/cita.entity';
import { Consulta } from './consultas/entities/consulta.entity';
import { Medico } from './medicos/entities/medico.entity';
import { Patient } from './patients/entities/patient.entity';
import { ConsultasModule } from './consultas/consultas.module';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    TypeOrmModule,
    Consulta,
    ConsultasModule,
    Patient,
    Medico,
    Cita,
    UsuariosModule,    
  PatientsModule,
  MedicosModule,
  CitasModule,   
    PaymentsModule,    
    LogsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
