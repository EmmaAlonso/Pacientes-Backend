import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { VarianteProducto } from './variante-producto.entity';
import { Package } from '../../packages/entities/package.entity';

@Entity('productos_estudiante')
export class ProductoEstudiante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_total' })
  precioTotal: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @Column({ type: 'boolean', default: false })
  eliminado: boolean;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;

  @ManyToOne(() => VarianteProducto)
  @JoinColumn({ name: 'variante_id' })
  variante: VarianteProducto;

  @ManyToOne(() => Package)
  @JoinColumn({ name: 'fuente_paquete_id' })
  fuentePaquete: Package;
}
