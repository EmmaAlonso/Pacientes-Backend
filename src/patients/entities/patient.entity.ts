import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm';

import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Medico } from '../../medicos/entities/medico.entity';
import { Consulta } from '../../consultas/entities/consulta.entity';
import { Cita } from '../../citas/entities/cita.entity';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  // ============================
  // Paciente creado por el ADMIN (usuario real del sistema)
  // ============================
  @ManyToOne(() => Usuario, (usuario) => usuario.patients, {
    eager: true,
    nullable: true
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario?: Usuario;

  // ============================
  // Paciente registrado por un MÉDICO
  // ============================
  @ManyToOne(() => Medico, (medico) => medico.pacientes, {
    nullable: true,
    eager: true
  })
  @JoinColumn({ name: 'medico_id' })
  medico?: Medico;

  @Column({ name: 'medico_id', nullable: true })
  medicoId?: number;

  // ============================
  // Relaciones con consultas y citas
  // ============================
  @OneToMany(() => Consulta, (consulta) => consulta.patient)
  consultas: Consulta[];

  @OneToMany(() => Cita, (cita) => cita.patient)
  citas: Cita[];

  // ============================
  // Datos del paciente
  // ============================
  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellidoPaterno?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellidoMaterno?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Column({ type: 'int', nullable: true })
  edad?: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ocupacion?: string;

  // ============================
  // Nuevo campo solicitado
  // ============================
  @Column({ type: 'varchar', length: 50, nullable: true })
  sexo?: string;

  // ============================
  // Fechas de creación/actualización
  // ============================
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  
}
