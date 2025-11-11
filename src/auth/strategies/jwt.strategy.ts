import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'supersecret',
    });
    this.logger.debug('JwtStrategy initialized');
  }

  validate(payload: any) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    // Asegurarse de que el rol esté en mayúsculas
    const rol = String(payload.rol).toUpperCase();

    return {
      id: payload.sub,
      email: payload.email,
      rol: rol,
      nombre: payload.nombre,
      activo: payload.activo,
      createdAt: payload.createdAt,
    };
  }
}
