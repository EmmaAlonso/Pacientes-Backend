import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Career } from './entities/career.entity';
import { CareersService } from './careers.service';
import { CareersController } from './careers.controller';
import { University } from '../universities/entities/university.entity';
import { Student } from '../students/entities/student.entity';
import { Generation } from '../generations/entities/generation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Career, University, Student, Generation]),
  ],
  controllers: [CareersController],
  providers: [CareersService],
  exports: [CareersService],
})
export class CareersModule {}
