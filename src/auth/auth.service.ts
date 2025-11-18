import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import * as bcrypt from 'bcrypt';
import { Rol } from '../common/enums/rol.enum';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

function omitPassword<T extends { password?: string }>(user: T): Omit<T, 'password'> {
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
  ) {}

  // 🔹 Validar credenciales al iniciar sesión
  async validateUser(email: string, password: string) {
    const user = await this.usuariosService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Usuario no encontrado: ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Contraseña inválida para usuario: ${email}`);
      return null;
    }

    this.logger.debug(`Usuario autenticado: ${email}, Rol: ${user.rol}`);
    return omitPassword(user);
  }

  // 🔹 Login: genera el token JWT
login(user: any) {
  const rol = String(user.rol).toUpperCase() as Rol;

  this.logger.debug(`Generando token para usuario: ${user.email}, Rol: ${rol}`);

  const payload = {
    id: user.id,
    email: user.email,
    rol: rol, // 👈 CORREGIDO: antes decía "role"
    nombre: user.nombre,
    activo: user.activo,
    createdAt: user.createdAt,
  };

  this.logger.debug(`Payload JWT: ${JSON.stringify(payload)}`);

  const token = this.jwtService.sign(payload);
  this.logger.debug(`Token generado correctamente`);

  return {
    access_token: token,
    user: {
      id: user.id,
      email: user.email,
      nombre: user.nombre,
      rol: rol,
      activo: user.activo,
      createdAt: user.createdAt,
    },
  };
}

  // 🔹 Registro con rol (para PACIENTE o MÉDICO)
async registerWithRole(data: Partial<Usuario>, rol: Rol) {
  if (!data.email) {
    throw new ConflictException('El correo es obligatorio');
  }

  if (!data.password) {
    throw new ConflictException('La contraseña es obligatoria');
  }

  const existing = await this.usuarioRepository.findOne({ where: { email: data.email } });
  if (existing) throw new ConflictException('El correo ya está registrado');

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const usuario = this.usuarioRepository.create({
    ...data,
    password: hashedPassword,
    rol,
    activo: true,
  });

  const savedUser = await this.usuarioRepository.save(usuario);

  this.logger.log(`Usuario registrado: ${savedUser.email} con rol ${rol}`);

  const { password, ...usuarioSinPassword } = savedUser;
  return usuarioSinPassword;
}
}