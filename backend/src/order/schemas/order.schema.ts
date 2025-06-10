import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose'; // Import Types từ mongoose

@Schema()
export class Order extends Document {
  @Prop()
  name!: string;

  @Prop()
  phone!: string;

  @Prop()
  address!: string;

  @Prop({ default: 'COD' })
  type!: string;

  // Định nghĩa mảng trực tiếp tại đây
  @Prop({
    type: [
      {
        bookId: { type: Types.ObjectId, ref: 'Book', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    default: [], // Luôn đặt giá trị mặc định là một mảng rỗng
  })
  orderItems!: Array<{
    bookId: Types.ObjectId;
    quantity: number;
    price: number;
  }>;

  @Prop()
  totalPrice!: number;

  @Prop({ default: Date.now })
  createdAt!: Date;

  @Prop({ default: Date.now })
  updatedAt!: Date;

  @Prop({ required: false })
  deletedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Order & Document;
