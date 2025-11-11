import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { TipoProducto } from '../../common/enums/tipo-producto.enum';
import { VarianteProducto } from './variante-producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'enum',
    enum: TipoProducto,
  })
  tipo: TipoProducto;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @OneToMany(
    () => VarianteProducto,
    (variante: VarianteProducto) => variante.producto,
  )
  variantes: VarianteProducto[];
}
