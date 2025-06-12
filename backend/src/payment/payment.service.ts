import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PaymentTransaction,
  PaymentTransactionDocument,
} from './schemas/payment.schema';
import { OrderService } from 'src/order/order.service';
import { VnpayService } from 'nestjs-vnpay';
import { ProductCode, VnpLocale } from 'vnpay';

@Injectable()
export class PaymentService {
  constructor(
    private readonly vnpayService: VnpayService,
    private readonly orderService: OrderService,
    @InjectModel(PaymentTransaction.name)
    private paymentTransactionModel: Model<PaymentTransactionDocument>,
  ) {}
  create(createPaymentDto: CreatePaymentDto) {
    return 'This action adds a new payment';
  }

  findAll() {
    return `This action returns all payment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }

  async createVnpayOrder(dto: CreatePaymentDto, user: any) {
    try {
      const {
        totalPrice,
        contentPayment,
        bankSelect,
        orderItems,
        name,
        address,
        phone,
        type,
      } = dto;
      const order = await this.orderService.create({
        userId: user.id,
        totalPrice,
        status: 'pending',
        name,
        address,
        phone,
        orderItems,
        type,
      });

      const vnp_TxnRef = `${order._id}-${Date.now()}`;
      const data = {
        vnp_Amount: totalPrice,
        vnp_IpAddr: '127.0.0.1',
        vnp_OrderInfo: contentPayment,
        vnp_ReturnUrl:
          process.env.VNPAY_RETURN_URL ??
          'http://localhost:3000/payment-result',
        vnp_TxnRef,
        vnp_BankCode: bankSelect ?? undefined,
        vnp_Locale: VnpLocale.VN,
        vnp_OrderType: ProductCode.Other,
      };

      const paymentUrl = this.vnpayService.buildPaymentUrl(data);

      await this.paymentTransactionModel.create({
        orderId: order._id,
        vnp_TxnRef,
        vnp_Amount: order.totalPrice,
        vnp_TransactionStatus: 'pending',
        vnp_BankCode: data.vnp_BankCode || null,
      });

      return {
        message: 'Order and payment created successfully',
        url: paymentUrl,
      };
    } catch (err) {
      console.log('err', err);
    }
  }

  async handleVnpayReturn(query: any) {
    try {
      const result = await this.vnpayService.verifyReturnUrl(query);
      const transaction = await this.paymentTransactionModel.findOne({
        vnp_TxnRef: result.vnp_TxnRef,
      });

      if (!transaction) throw new BadRequestException('Transaction not found');

      if (result.vnp_ResponseCode === '00') {
        transaction.vnp_TransactionStatus = 'success';
        transaction.vnp_PayDate = result.vnp_PayDate.toString();
        await transaction.save();

        await this.orderService.updateStatus(
          transaction.orderId.toString(),
          'paid',
        );
      } else {
        transaction.vnp_TransactionStatus = 'fail';
        await transaction.save();
      }

      return {
        message: 'Payment return processed successfully',
        status: 'success',
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async handleVnpayIpn(query: any) {
    try {
      const verify = await this.vnpayService.verifyIpnCall(query);

      if (!verify.isVerified) {
        throw new BadRequestException('IPN Checksum failed');
      }

      const transaction = await this.paymentTransactionModel.findOne({
        vnp_TxnRef: verify.vnp_TxnRef,
      });

      if (!transaction) throw new BadRequestException('Transaction not found');

      if (transaction.vnp_Amount !== verify.vnp_Amount) {
        throw new BadRequestException('Invalid amount');
      }

      if (transaction.vnp_TransactionStatus === 'success') {
        return { message: 'Order already confirmed', status: 'success' };
      }

      transaction.vnp_TransactionStatus = 'success';
      transaction.vnp_PayDate = verify.vnp_PayDate.toString();
      await transaction.save();

      await this.orderService.updateStatus(
        transaction.orderId.toString(),
        'paid',
      );

      return {
        message: 'IPN processed successfully',
        status: 'success',
      };
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
