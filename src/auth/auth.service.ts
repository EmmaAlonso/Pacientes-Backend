import { Injectable, Logger, ConflictException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import * as bcrypt from 'bcrypt';
import { Rol } from '../common/enums/rol.enum';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicosService } from '../medicos/services/medicos.service';

function omitPassword<T extends { password?: string }>(
  user: T,
): Omit<T, 'password'> {
  const { password, ...rest } = user;
  return rest;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,

    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,

    // 👈 AHORA SÍ: ruta correcta según tu estructura real
    private readonly medicosService: MedicosService,
  ) {}

  // 🔹 Validar usuario al iniciar sesión
  async validateUser(email: string, password: string) {
    const user = await this.usuariosService.findByEmail(email);
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return omitPassword(user);
  }

  // 🔹 Login del sistema
  async login(user: any) {
    const rol = String(user.rol).toUpperCase() as Rol;

    // Para MEDICO, le agregamos su medicoId a su JWT
    let medicoId: number | null = null;

    if (rol === 'MEDICO') {
      try {
        const medico = await this.medicosService.findByUsuarioId(user.id);
        medicoId = medico.id;
      } catch (error) {
        this.logger.warn(`El usuario ${user.email} tiene rol MEDICO pero no tiene registro en medicos.`);
      }
    }

    const payload = {
      sub: user.id,
      email: user.email,
      rol,
      medicoId,   // 👈 ESTO se usará para registrar pacientes
      nombre: user.nombre,
      activo: user.activo,
      createdAt: user.createdAt,
    };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol,
        medicoId,   // 👈 Lo devolvemos también al frontend
        activo: user.activo,
        createdAt: user.createdAt,
      },
    };
  }

  // 🔹 Registro de usuarios con rol
  async registerWithRole(data: Partial<Usuario>, rol: Rol) {
    if (!data.email) throw new ConflictException('El correo es obligatorio');
    if (!data.password) throw new ConflictException('La contraseña es obligatoria');

    const existing = await this.usuarioRepository.findOne({
      where: { email: data.email },
    });
    if (existing) throw new ConflictException('El correo ya está registrado');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const usuario = this.usuarioRepository.create({
      ...data,
      password: hashedPassword,
      rol,
      activo: true,
    });

    const savedUser = await this.usuarioRepository.save(usuario);
    const { password, ...usuarioSinPassword } = savedUser;

    return usuarioSinPassword;
  }
}
