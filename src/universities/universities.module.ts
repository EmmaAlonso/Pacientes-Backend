import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { UniversitiesService } from './universities.service';
import { UniversitiesController } from './universities.controller';
import { Student } from '../students/entities/student.entity';
import { Career } from '../careers/entities/career.entity';
import { Generation } from '../generations/entities/generation.entity';
import { Package } from '../packages/entities/package.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      University,
      Student,
      Career,
      Generation,
      Package,
    ]),
  ],
  controllers: [UniversitiesController],
  providers: [UniversitiesService],
  exports: [UniversitiesService],
})
export class UniversitiesModule {}
