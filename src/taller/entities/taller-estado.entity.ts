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
import { EstadoTaller } from '../../common/enums/estado-taller.enum';
import { VarianteProducto } from '../../productos/entities/variante-producto.entity';

@Entity('taller_estado')
export class TallerEstado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  comentario: string;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_inicio' })
  fechaInicio: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_ultima_actualizacion' })
  fechaUltimaActualizacion: Date;

  @Column({ type: 'timestamp', name: 'fecha_entrega_estimada', nullable: true })
  fechaEntregaEstimada: Date;

  @Column({
    type: 'enum',
    enum: EstadoTaller,
    default: EstadoTaller.PENDIENTE,
  })
  estado: EstadoTaller;

  @ManyToOne(() => Student, (student: Student) => student.estadosTaller)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;

  @ManyToOne(() => VarianteProducto)
  @JoinColumn({ name: 'variante_id' })
  variante: VarianteProducto;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'modificado_por' })
  modificadoPor: Usuario;
}
