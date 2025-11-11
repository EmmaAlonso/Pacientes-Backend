import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Career } from '../../careers/entities/career.entity';
import { Generation } from '../../generations/entities/generation.entity';
import { Student } from '../../students/entities/student.entity';
import { Package } from '../../packages/entities/package.entity';

@Entity('universidades')
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Career, (career: Career) => career.universidad)
  careers: Career[];

  @OneToMany(
    () => Generation,
    (generation: Generation) => generation.universidad,
  )
  generations: Generation[];

  @OneToMany(() => Student, (student: Student) => student.universidad)
  students: Student[];

  @OneToMany(() => Package, (package_: Package) => package_.universidad)
  packages: Package[];
}
