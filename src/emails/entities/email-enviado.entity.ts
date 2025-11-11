import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { TipoEmail } from '../../common/enums/tipo-email.enum';

@Entity('emails_enviados')
export class EmailEnviado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  destinatario: string;

  @Column({ type: 'varchar', length: 255 })
  asunto: string;

  @Column({ type: 'text' })
  mensaje: string;

  @Column({
    type: 'enum',
    enum: TipoEmail,
  })
  tipo: TipoEmail;

  @Column({ type: 'boolean', default: false })
  enviado: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'fecha_envio' })
  fechaEnvio: Date;

  @Column({ type: 'int', name: 'intento_numero', default: 0 })
  intentoNumero: number;

  @Column({ type: 'text', name: 'error_log', nullable: true })
  errorLog: string;

  @ManyToOne(() => Student, (student: Student) => student.emails)
  @JoinColumn({ name: 'estudiante_id' })
  student: Student;
}
