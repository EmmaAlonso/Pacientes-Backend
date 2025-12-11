import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Medico } from '../../medicos/entities/medico.entity';

export enum TipoSangreEnum {
  O_POS = "O+",
  O_NEG = "O-",
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
}

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.consultas, { eager: true })
  patient: Patient;

  @ManyToOne(() => Medico, (medico) => medico.consultas, { eager: true })
  medico: Medico;

  @Column({ type: 'text' })
  motivoConsulta: string;

  @Column({ type: 'text' })
  sintomas: string;

  @Column({
    type: 'enum',
    enum: TipoSangreEnum,
  })
  tipoSangre: TipoSangreEnum;

  @Column({ type: 'text', nullable: true })
  alergias?: string;

  @Column({ type: 'float', nullable: true })
  peso?: number;

  @Column({ type: 'float', nullable: true })
  estatura?: number;

  @Column({ type: 'text' })
  tratamiento: string;

  @Column({ type: 'text', nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
