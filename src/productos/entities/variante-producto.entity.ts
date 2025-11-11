import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Producto } from './producto.entity';
import { PaqueteItem } from '../../paquetes/entities/paquete-item.entity';
import { ProductoEstudiante } from './producto-estudiante.entity';
import { TallerEstado } from '../../taller/entities/taller-estado.entity';
import { TicketReparacion } from '../../tickets/entities/ticket-reparacion.entity';
import { Entrega } from '../../entregas/entities/entrega.entity';

@Entity('variantes_producto')
export class VarianteProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @ManyToOne(() => Producto, (producto: Producto) => producto.variantes)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @OneToMany(() => PaqueteItem, (item: PaqueteItem) => item.variante)
  paqueteItems: PaqueteItem[];

  @OneToMany(
    () => ProductoEstudiante,
    (producto: ProductoEstudiante) => producto.variante,
  )
  productosEstudiante: ProductoEstudiante[];

  @OneToMany(() => TallerEstado, (estado: TallerEstado) => estado.variante)
  estadosTaller: TallerEstado[];

  @OneToMany(
    () => TicketReparacion,
    (ticket: TicketReparacion) => ticket.variante,
  )
  tickets: TicketReparacion[];

  @OneToMany(() => Entrega, (entrega: Entrega) => entrega.variante)
  entregas: Entrega[];
}
