import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

import { Usuario } from '../../usuarios/entities/usuario.entity';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Consulta } from '../../consultas/entities/consulta.entity';

@Entity('medicos')
export class Medico {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.medicos, { eager: true })
@JoinColumn({ name: 'usuario_id' })
usuario: Usuario;

 @OneToMany(() => Consulta, (consulta) => consulta.medico)
  consultas: Consulta[];

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellidoPaterno?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  apellidoMaterno?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  especialidad?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion?: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  consultorio?: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
