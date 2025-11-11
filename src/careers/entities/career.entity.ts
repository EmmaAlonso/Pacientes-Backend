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
import { Generation } from '../../generations/entities/generation.entity';
import { Student } from '../../students/entities/student.entity';

@Entity('carreras')
export class Career {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => University, (university: University) => university.careers)
  @JoinColumn({ name: 'universidad_id' })
  universidad: University;

  @OneToMany(() => Generation, (generation: Generation) => generation.carrera)
  generations: Generation[];

  @OneToMany(() => Student, (student: Student) => student.carrera)
  students: Student[];
}
