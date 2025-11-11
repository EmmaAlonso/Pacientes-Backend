import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    this.logger.debug(
      `Required roles for this endpoint: ${JSON.stringify(requiredRoles)}`,
    );

    if (!requiredRoles) {
      this.logger.debug('No roles required for this endpoint');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      this.logger.warn('No user found in request');
      return false;
    }

    // 🔹 Acepta tanto "rol" como "role" desde el JWT
    const userRole = String
      (user.rol || user.role || '').toString().toUpperCase();

    this.logger.debug(`User object from request: ${JSON.stringify(user)}`);
    this.logger.debug(`Detected user role: ${userRole}`);

    const hasRole = requiredRoles.includes(userRole);

    this.logger.debug(
      `User role: ${userRole}, Required roles: ${requiredRoles.join(', ')}, Has role: ${hasRole}`,
    );

    if (!hasRole) {
      this.logger.warn(
        `Access denied. User role ${userRole} does not have required roles: ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}
