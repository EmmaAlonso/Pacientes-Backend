import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { NotificacionTipo } from '../../common/enums/notificacion-tipo.enum';
import { Rol } from '../../common/enums/rol.enum';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({ type: 'boolean', default: false })
  leido: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: NotificacionTipo,
  })
  tipo: NotificacionTipo;

  @Column({
    type: 'enum',
    enum: Rol,
  })
  paraRol: Rol;

  @ManyToOne(() => Student, (student: Student) => student.notificaciones)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;
}
