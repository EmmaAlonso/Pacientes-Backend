import { Controller, Get, Req, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('debug')
export class DebugController {
  private readonly logger = new Logger(DebugController.name);

  @Get('whoami')
  whoami(@Req() req) {
    this.logger.debug(`whoami called, user=${JSON.stringify(req.user)}`);
    return req.user;
  }
}
