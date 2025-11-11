import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { University } from '../../universities/entities/university.entity';
import { Career } from '../../careers/entities/career.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('generaciones')
export class Generation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'año' })
  año: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(
    () => University,
    (university: University) => university.generations,
  )
  @JoinColumn({ name: 'universidad_id' })
  universidad: University;

  @ManyToOne(() => Career, (career: Career) => career.generations)
  @JoinColumn({ name: 'carrera_id' })
  carrera: Career;

  @OneToMany(() => Student, (student: Student) => student.generacion)
  students: Student[];
}
