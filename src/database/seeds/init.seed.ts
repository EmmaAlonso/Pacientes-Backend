import { DataSource } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { University } from '../../universities/entities/university.entity';
import { Career } from '../../careers/entities/career.entity';
import { Generation } from '../../generations/entities/generation.entity';
import { Student } from '../../students/entities/student.entity';
import { Package } from '../../packages/entities/package.entity';
import {
  Payment,
  MetodoPago,
  EstadoPago,
} from '../../payments/entities/payment.entity';
import { Sale } from '../../sales/entities/sale.entity';
import * as bcrypt from 'bcrypt';
import { Rol } from '../../common/enums/rol.enum';

export async function seedDatabase(dataSource: DataSource) {
  try {
    // Crear usuario administrador
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await dataSource.getRepository(Usuario).save({
      nombre: 'Admin',
      email: 'admin@example.com',
      password: adminPassword,
      rol: Rol.ADMIN,
    });

    // Crear universidad
    const university = await dataSource.getRepository(University).save({
      nombre: 'Universidad de Prueba',
    });

    // Crear carrera
    const career = await dataSource.getRepository(Career).save({
      nombre: 'Ingeniería en Sistemas',
      universidad: university,
    });

    // Crear generación
    const generation = await dataSource.getRepository(Generation).save({
      año: 2024,
      universidad: university,
      carrera: career,
    });

    // Crear estudiante
    const student = await dataSource.getRepository(Student).save({
      nombre: 'Juan',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '1234567890',
      matricula: '2024001',
      usuario: admin,
      universidad: university,
      carrera: career,
      generacion: generation,
    });

    // Crear paquete
    const package_ = await dataSource.getRepository(Package).save({
      nombre: 'Paquete Básico',
      descripcion: 'Acceso a cursos básicos',
      precio: 1000,
      duracion_meses: 3,
      usuario: admin,
      universidad: university,
      student: student,
    });

    // Crear pago
    await dataSource.getRepository(Payment).save({
      monto: 1000,
      metodo_pago: MetodoPago.TARJETA,
      estado: EstadoPago.COMPLETADO,
      usuario: admin,
      student: student,
      package: package_,
    });

    // Crear venta
    await dataSource.getRepository(Sale).save({
      producto: 'Libro de Programación',
      precio: 500,
      cantidad: 1,
      total: 500,
      estado: 'COMPLETADA',
      usuario: admin,
      student: student,
    });

    console.log('Base de datos inicializada con éxito');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
}
