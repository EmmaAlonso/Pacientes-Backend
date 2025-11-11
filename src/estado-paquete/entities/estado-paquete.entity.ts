import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('estado_paquete')
export class EstadoPaquete {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @ManyToOne(() => Student, (student: Student) => student.estadosPaquete)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'creado_por' })
  creadoPor: Usuario;
}
