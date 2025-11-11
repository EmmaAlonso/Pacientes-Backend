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
import { Career } from '../../careers/entities/career.entity';
import { Generation } from '../../generations/entities/generation.entity';
import { Package } from '../../packages/entities/package.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Sale } from '../../sales/entities/sale.entity';
import { EstatusPago } from '../../common/enums/estatus-pago.enum';
import { EmailEnviado } from '../../emails/entities/email-enviado.entity';
import { TallerEstado } from '../../taller/entities/taller-estado.entity';
import { TicketReparacion } from '../../tickets/entities/ticket-reparacion.entity';
import { Entrega } from '../../entregas/entities/entrega.entity';
import { Notificacion } from '../../notificaciones/entities/notificacion.entity';
import { EstadoPaquete } from '../../estado-paquete/entities/estado-paquete.entity';
import { Adjunto } from '../../adjuntos/entities/adjunto.entity';
import { Log } from '../../logs/entities/log.entity';

@Entity('estudiantes')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  apellido: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20 })
  telefono: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  saldo: number;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ManyToOne(() => Usuario, { nullable: false })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => University, { nullable: false })
  @JoinColumn({ name: 'universidad_id' })
  universidad: University;

  @ManyToOne(() => Career, { nullable: false })
  @JoinColumn({ name: 'carrera_id' })
  carrera: Career;

  @ManyToOne(() => Generation, (generation: Generation) => generation.students)
  @JoinColumn({ name: 'generacion_id' })
  generacion: Generation;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_registro' })
  fechaRegistro: Date;

  @Column({
    type: 'enum',
    enum: EstatusPago,
    default: EstatusPago.PENDIENTE,
    name: 'estatus_pago',
  })
  estatusPago: EstatusPago;

  @OneToMany(() => Package, (package_: Package) => package_.student)
  packages: Package[];

  @OneToMany(() => Payment, (payment: Payment) => payment.student)
  payments: Payment[];

  @OneToMany(() => Sale, (sale) => sale.student)
  sales: Sale[];

  @OneToMany(() => EmailEnviado, (email: EmailEnviado) => email.student)
  emails: EmailEnviado[];

  @OneToMany(() => TallerEstado, (estado: TallerEstado) => estado.student)
  estadosTaller: TallerEstado[];

  @OneToMany(
    () => TicketReparacion,
    (ticket: TicketReparacion) => ticket.student,
  )
  tickets: TicketReparacion[];

  @OneToMany(() => Entrega, (entrega: Entrega) => entrega.student)
  entregas: Entrega[];

  @OneToMany(
    () => Notificacion,
    (notificacion: Notificacion) => notificacion.student,
  )
  notificaciones: Notificacion[];

  @OneToMany(() => EstadoPaquete, (estado: EstadoPaquete) => estado.student)
  estadosPaquete: EstadoPaquete[];

  @OneToMany(() => Adjunto, (adjunto: Adjunto) => adjunto.student)
  adjuntos: Adjunto[];

  @OneToMany(() => Log, (log: Log) => log.student)
  logs: Log[];

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
