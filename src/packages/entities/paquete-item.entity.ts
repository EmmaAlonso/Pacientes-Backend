import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Package } from './package.entity';
import { VarianteProducto } from '../../productos/entities/variante-producto.entity';

@Entity('paquete_items')
export class PaqueteItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;

  @ManyToOne(() => Package, (package_: Package) => package_.items)
  @JoinColumn({ name: 'paquete_id' })
  paquete: Package;

  @ManyToOne(() => VarianteProducto)
  @JoinColumn({ name: 'variante_id' })
  variante: VarianteProducto;
}
