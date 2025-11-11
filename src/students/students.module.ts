import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { StudentsService } from './services/students.service';
import { StudentsController } from './controllers/students.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { University } from '../universities/entities/university.entity';
import { Career } from '../careers/entities/career.entity';
import { Generation } from '../generations/entities/generation.entity';
import { Package } from '../packages/entities/package.entity';
import { Payment } from '../payments/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Student,
      Usuario,
      University,
      Career,
      Generation,
      Package,
      Payment,
    ]),
  ],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
