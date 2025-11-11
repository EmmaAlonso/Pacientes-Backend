import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Package } from '../../packages/entities/package.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { Rol } from '../../common/enums/rol.enum';
import { Patient } from '../../patients/entities/patient.entity'; // ✅ Nuevo import
import { Medico } from '../../medicos/entities/medico.entity';   // ✅ Nuevo import

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({
    type: 'enum',
    enum: Rol,
    default: Rol.ESTUDIANTE,
  })
  rol: Rol;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToMany(() => Student, (student) => student.usuario)
  students: Student[];

  @OneToMany(() => Package, (package_) => package_.usuario)
  packages: Package[];

  @OneToMany(() => Payment, (payment) => payment.usuario)
  payments: Payment[];

  @OneToMany(() => Patient, (patient) => patient.usuario)
  patients: Patient[];

  @OneToMany(() => Medico, (medico) => medico.usuario)
  medicos: Medico[];
}
