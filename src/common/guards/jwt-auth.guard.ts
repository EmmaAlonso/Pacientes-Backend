import { Injectable, Logger, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    this.logger.debug(
      `handleRequest - err: ${JSON.stringify(err)}, user: ${JSON.stringify(user)}, info: ${JSON.stringify(info)}`,
    );
    return super.handleRequest(err, user, info, context);
  }
}
