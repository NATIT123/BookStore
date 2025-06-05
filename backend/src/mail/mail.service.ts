import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  sendMail(arg0: { to: string; from: string; subject: string; html: string }) {
    throw new Error('Method not implemented.');
  }
}
