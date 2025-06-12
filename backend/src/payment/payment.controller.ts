import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Post()
  // create(@Body() createPaymentDto: CreatePaymentDto) {
  //   return this.paymentService.create(createPaymentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.paymentService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.paymentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
  //   return this.paymentService.update(+id, updatePaymentDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }

  @Post('payment-url')
  async createPaymentUrl(
    @Body() createPaymentDto: CreatePaymentDto,
    @User() user: IUser,
  ) {
    return this.paymentService.createVnpayOrder(createPaymentDto, user);
  }

  @Get('vnpay-return')
  async handleVnpayReturn(@Query() query: any) {
    return this.paymentService.handleVnpayReturn(query);
  }

  @Get('vnpay-ipn')
  async handleVnpayIpn(@Query() query: any) {
    return this.paymentService.handleVnpayIpn(query);
  }
}
