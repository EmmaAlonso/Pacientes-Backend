import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Tipo } from '../../common/enums/tipo.enum';

@Entity('adjuntos')
export class Adjunto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'varchar', length: 255, name: 'archivo_url' })
  archivoUrl: string;

  @Column({
    type: 'enum',
    enum: Tipo,
  })
  tipo: Tipo;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @ManyToOne(() => Student, (student: Student) => student.adjuntos)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;
}
