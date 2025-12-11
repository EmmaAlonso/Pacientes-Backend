import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DebugController } from './common/controllers/debug.controller';

import { DatabaseModule } from './database/database.module';

import { UsuariosModule } from './usuarios/usuarios.module';
import { PatientsModule } from './patients/patients.module';
import { MedicosModule } from './medicos/medicos.module';
import { CitasModule } from './citas/citas.module';
import { PaymentsModule } from './payments/payments.module';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { ConsultasModule } from './consultas/consultas.module';

// ENTIDADES
import { Usuario } from './usuarios/entities/usuario.entity';
import { Patient } from './patients/entities/patient.entity';
import { Medico } from './medicos/entities/medico.entity';
import { Cita } from './citas/entities/cita.entity';
import { Consulta } from './consultas/entities/consulta.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,

    // 🔥 ENTIDADES CORRECTAMENTE REGISTRADAS
    TypeOrmModule.forFeature([
      Usuario,
      Patient,
      Medico,
      Cita,
      Consulta,
    ]),

    UsuariosModule,
    PatientsModule,
    MedicosModule,
    CitasModule,
    PaymentsModule,
    LogsModule,
    AuthModule,
    ConsultasModule,
  ],
  controllers: [AppController, DebugController],
  providers: [AppService],
})
export class AppModule {}
