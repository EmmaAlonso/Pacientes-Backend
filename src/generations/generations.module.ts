import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Generation } from './entities/generation.entity';
import { GenerationsService } from './generations.service';
import { GenerationsController } from './generations.controller';
import { University } from '../universities/entities/university.entity';
import { Career } from '../careers/entities/career.entity';
import { Student } from '../students/entities/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Generation, University, Career, Student]),
  ],
  controllers: [GenerationsController],
  providers: [GenerationsService],
  exports: [GenerationsService],
})
export class GenerationsModule {}
