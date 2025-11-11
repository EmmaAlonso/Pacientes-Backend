import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { University } from '../../universities/entities/university.entity';
import { Student } from '../../students/entities/student.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { PaqueteItem } from './paquete-item.entity';

@Entity('paquetes')
export class Package {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'precio_referencia',
  })
  precioReferencia: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Usuario, (usuario: Usuario) => usuario.packages)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(
    () => University,
    (university: University) => university.packages as Package[],
  )
  @JoinColumn({ name: 'universidad_id' })
  universidad: University;

  @ManyToOne(() => Student, (student: Student) => student.packages as Package[])
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @OneToMany(() => Payment, (payment: Payment) => payment.package)
  payments: Payment[];

  @OneToMany(() => PaqueteItem, (item: PaqueteItem) => item.paquete)
  items: PaqueteItem[];

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
