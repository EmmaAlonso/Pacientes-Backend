import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailEnviado } from '../entities/email-enviado.entity';
import { TipoEmail } from '../../common/enums/tipo-email.enum';

@Injectable()
export class EmailsService {
  private readonly logger = new Logger(EmailsService.name);

  constructor(
    @InjectRepository(EmailEnviado)
    private readonly emailRepository: Repository<EmailEnviado>,
    private readonly mailerService: MailerService,
  ) {}

  async enviarEmail(
    destinatario: string,
    asunto: string,
    mensaje: string,
    tipo: TipoEmail,
    estudianteId?: number,
  ): Promise<EmailEnviado> {
    try {
      // Crear registro de email
      const emailEnviado = this.emailRepository.create({
        destinatario,
        asunto,
        mensaje,
        tipo,
        enviado: false,
        intentoNumero: 0,
      });

      if (estudianteId) {
        emailEnviado.student = { id: estudianteId } as any;
      }

      // Intentar enviar el email
      await this.mailerService.sendMail({
        to: destinatario,
        subject: asunto,
        html: mensaje,
      });

      // Actualizar registro como enviado
      emailEnviado.enviado = true;
      emailEnviado.intentoNumero += 1;

      // Guardar registro
      return await this.emailRepository.save(emailEnviado);
    } catch (error) {
      this.logger.error(`Error al enviar email: ${error.message}`, error.stack);

      // Guardar registro con error
      const emailEnviado = this.emailRepository.create({
        destinatario,
        asunto,
        mensaje,
        tipo,
        enviado: false,
        intentoNumero: 1,
        errorLog: error.message,
      });

      if (estudianteId) {
        emailEnviado.student = { id: estudianteId } as any;
      }

      return await this.emailRepository.save(emailEnviado);
    }
  }

  async reenviarEmail(id: number): Promise<EmailEnviado> {
    const email = await this.emailRepository.findOne({ where: { id } });
    if (!email) {
      throw new NotFoundException(`Email con ID ${id} no encontrado`);
    }

    try {
      await this.mailerService.sendMail({
        to: email.destinatario,
        subject: email.asunto,
        html: email.mensaje,
      });

      email.enviado = true;
      email.intentoNumero += 1;
      email.errorLog = '';

      return await this.emailRepository.save(email);
    } catch (error) {
      this.logger.error(
        `Error al reenviar email: ${error.message}`,
        error.stack,
      );

      email.intentoNumero += 1;
      email.errorLog = error.message;

      return await this.emailRepository.save(email);
    }
  }

  async findAll(): Promise<EmailEnviado[]> {
    return this.emailRepository.find({
      relations: ['student'],
      order: { fechaEnvio: 'DESC' },
    });
  }

  async findOne(id: number): Promise<EmailEnviado> {
    const email = await this.emailRepository.findOne({
      where: { id },
      relations: ['student'],
    });

    if (!email) {
      throw new NotFoundException(`Email con ID ${id} no encontrado`);
    }

    return email;
  }

  async findByEstudiante(estudianteId: number): Promise<EmailEnviado[]> {
    return this.emailRepository.find({
      where: { student: { id: estudianteId } },
      order: { fechaEnvio: 'DESC' },
    });
  }
}
