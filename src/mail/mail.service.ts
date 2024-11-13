import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private logger = new Logger('MailService');
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(recieverEmail: string, subject: string, content: string) {
    try {
      await this.mailerService.sendMail({
        to: recieverEmail,
        subject,
        html: content,
      });

      return true;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return false;
    }
  }
}
