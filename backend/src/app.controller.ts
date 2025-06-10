import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Public } from './decorator/customize';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  @Render('home')
  handleHomePage() {
    ///Port form ENV
    console.log(`Port:${this.configService.get<string>('PORT')}`);
    const message1 = this.appService.getHello();

    return {
      message: message1,
    };
  }

  @Get('getAllBanks')
  getBankLists() {
    return this.appService.getBankList();
  }
}
