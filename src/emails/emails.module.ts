import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailEnviado } from './entities/email-enviado.entity';
import { EmailsService } from './services/emails.service';
import { EmailsController } from './controllers/emails.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmailEnviado]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      defaults: {
        from: process.env.SMTP_FROM || '"CRM System" <noreply@tudominio.com>',
      },
    }),
  ],
  controllers: [EmailsController],
  providers: [EmailsService],
  exports: [EmailsService],
})
export class EmailsModule {}
