import { Injectable } from '@nestjs/common';
import { VnpayService } from 'nestjs-vnpay';
@Injectable()
export class AppService {
  constructor(private readonly vnpayService: VnpayService) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getBankList() {
    return this.vnpayService.getBankList();
  }
}
