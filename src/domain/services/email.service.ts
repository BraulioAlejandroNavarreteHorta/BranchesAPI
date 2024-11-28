import nodemailer from 'nodemailer';
import { envs } from '../../config/envs.plugin';

interface MailOptions {
  to: string;
  subject: string;
  htmlBody: string;
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAIL_SERVICE,
    auth: {
      user: envs.MAIL_USER,
      pass: envs.MAIL_SECRET_KEY
    }
  });

  async sendEmail(options: MailOptions) {
    try {
      console.log('Intentando enviar email...');
      console.log('Destinatarios:', options.to);
      console.log('Usando cuenta:', envs.MAIL_USER);

      const sentInformation = await this.transporter.sendMail({
        from: `"Sistema de Tickets" <${envs.MAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        html: options.htmlBody
      });

      console.log('Email enviado exitosamente');
      console.log('ID del mensaje:', sentInformation.messageId);
      return sentInformation;
    }
    catch(error) {
      console.error('Error detallado al enviar email:', error);
      console.error('Configuración actual:', {
        service: envs.MAIL_SERVICE,
        user: envs.MAIL_USER,
        hasPassword: !!envs.MAIL_SECRET_KEY
      });
      //@ts-ignore
      throw new Error(`Error al enviar email: ${error.message}`);
    }
  }

  // Método para verificar la configuración
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('Configuración de email correcta y funcionando');
      return true;
    } catch (error) {
      console.error('Error en la configuración de email:', error);
      return false;
    }
  }
}