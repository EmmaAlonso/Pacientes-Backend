import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { EmailsService } from '../services/emails.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';
import { TipoEmail } from '../../common/enums/tipo-email.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('emails')
export class EmailsController {
  constructor(private readonly emailsService: EmailsService) {}

  @Roles(Rol.ADMIN)
  @Post()
  async enviarEmail(
    @Body()
    body: {
      destinatario: string;
      asunto: string;
      mensaje: string;
      tipo: TipoEmail;
      estudianteId?: number;
    },
  ) {
    return this.emailsService.enviarEmail(
      body.destinatario,
      body.asunto,
      body.mensaje,
      body.tipo,
      body.estudianteId,
    );
  }

  @Roles(Rol.ADMIN)
  @Post(':id/reenviar')
  async reenviarEmail(@Param('id') id: string) {
    return this.emailsService.reenviarEmail(+id);
  }

  @Roles(Rol.ADMIN)
  @Get()
  findAll() {
    return this.emailsService.findAll();
  }

  @Roles(Rol.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailsService.findOne(+id);
  }

  @Roles(Rol.ADMIN, Rol.ESTUDIANTE)
  @Get('estudiante/:estudianteId')
  findByEstudiante(@Param('estudianteId') estudianteId: string) {
    return this.emailsService.findByEstudiante(+estudianteId);
  }
}
