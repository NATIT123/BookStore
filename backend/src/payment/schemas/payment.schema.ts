import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PaymentTransactionDocument = PaymentTransaction & Document;

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class PaymentTransaction {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  vnp_TxnRef: string;

  @Prop({ required: true })
  vnp_Amount: number;

  @Prop()
  vnp_BankCode?: string;

  @Prop()
  vnp_ResponseCode?: string;

  @Prop({
    enum: ['pending', 'success', 'fail'],
    default: 'pending',
  })
  vnp_TransactionStatus: 'pending' | 'success' | 'fail';

  @Prop()
  vnp_PayDate?: string;
}

export const PaymentTransactionSchema =
  SchemaFactory.createForClass(PaymentTransaction);
