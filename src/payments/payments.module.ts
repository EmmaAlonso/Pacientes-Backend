import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Student } from '../students/entities/student.entity';
import { Package } from '../packages/entities/package.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Usuario, Student, Package])],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
