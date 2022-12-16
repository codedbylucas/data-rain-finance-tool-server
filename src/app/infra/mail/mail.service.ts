import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { serverError } from 'src/app/util/server-error';

export interface SendMailProps {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
}

@Injectable()
export class MailService {
  async sendMail(sendMailProps: SendMailProps) {
    try {
      const { subject, to, html, text } = sendMailProps;

      var transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transport.sendMail({
        from: '"Data Rain 👻" <data.rain.bootcamp@gmail.com>',
        to,
        subject,
        text,
        html,
      });
    } catch (error) {
      console.log(error);
      return serverError(error);
    }
  }
}
