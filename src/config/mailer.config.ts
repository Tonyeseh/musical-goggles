import { MailerOptions } from '@nestjs-modules/mailer';

export const mailerConfig: MailerOptions = {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'computerminna@gmail.com',
      pass: 'nakm fvxu apdw vcjl',
    },
  },
};
