import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { VarianteProducto } from '../../productos/entities/variante-producto.entity';

@Entity('entregas')
export class Entrega {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_entrega' })
  fechaEntrega: Date;

  @Column({ type: 'timestamp', name: 'fecha_recepcion', nullable: true })
  fechaRecepcion: Date;

  @Column({ type: 'boolean', default: false })
  entregado: boolean;

  @Column({ type: 'boolean', default: false, name: 'pendiente_reparacion' })
  pendienteReparacion: boolean;

  @Column({ type: 'timestamp', name: 'fecha_reparacion', nullable: true })
  fechaReparacion: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Student, (student: Student) => student.entregas)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;

  @ManyToOne(() => VarianteProducto)
  @JoinColumn({ name: 'variante_id' })
  variante: VarianteProducto;
}
