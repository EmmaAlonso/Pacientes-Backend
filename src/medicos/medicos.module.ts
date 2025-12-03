import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './entities/medico.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity'; // <--- IMPORTANTE
import { MedicosService } from './services/medicos.service';
import { MedicosController } from './controllers/medicos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medico, Usuario]), // <-- AÑADIR Usuario AQUÍ
  ],
  controllers: [MedicosController],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}
