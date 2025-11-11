import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackagesService } from './services/packages.service';
import { PackagesController } from './controllers/packages.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { University } from '../universities/entities/university.entity';
import { Student } from '../students/entities/student.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Package, Usuario, University, Student, Payment]),
  ],
  controllers: [PackagesController],
  providers: [PackagesService],
  exports: [PackagesService],
})
export class PackagesModule {}
