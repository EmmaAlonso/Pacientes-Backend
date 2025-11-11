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
import { VarianteProducto } from '../../productos/entities/variante-producto.entity';
import { EstadoTicket } from '../../common/enums/estado-ticket.enum';

@Entity('tickets_reparacion')
export class TicketReparacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({
    type: 'enum',
    enum: EstadoTicket,
    default: EstadoTicket.PENDIENTE,
  })
  estadoTicket: EstadoTicket;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_inicio' })
  fechaInicio: Date;

  @Column({ type: 'timestamp', name: 'fecha_estimacion', nullable: true })
  fechaEstimacion: Date;

  @Column({ type: 'timestamp', name: 'fecha_resolucion', nullable: true })
  fechaResolucion: Date;

  @ManyToOne(() => Student, (student: Student) => student.tickets)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;

  @ManyToOne(() => VarianteProducto)
  @JoinColumn({ name: 'variante_id' })
  variante: VarianteProducto;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'creado_por' })
  creadoPor: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'asignado_a' })
  asignadoA: Usuario;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'actualizado_por' })
  actualizadoPor: Usuario;
}
