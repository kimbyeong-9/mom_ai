import { Injectable, Logger } from '@nestjs/common';
// Namespace import, not default — this project's tsconfig doesn't set
// esModuleInterop, so `import nodemailer from 'nodemailer'` compiles to
// `nodemailer_1.default` (undefined) instead of the actual module exports.
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly fromAddress = process.env.GMAIL_USER;
  private readonly transporter: Transporter | null =
    process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD
      ? nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
          },
        })
      : null;

  /** Returns whether the send actually succeeded — callers should only mark
   * a reminder as sent when this is true, so a transient SMTP failure gets
   * retried on the next scheduled check instead of being silently dropped. */
  async send(to: string, subject: string, text: string): Promise<boolean> {
    if (!this.transporter) {
      this.logger.warn(
        'GMAIL_USER/GMAIL_APP_PASSWORD가 설정되지 않아 이메일 발송을 건너뜁니다.',
      );
      return false;
    }

    try {
      await this.transporter.sendMail({
        from: this.fromAddress,
        to,
        subject,
        text,
      });
      return true;
    } catch (error) {
      this.logger.error(`이메일 발송 실패 (to: ${to})`, error);
      return false;
    }
  }
}
