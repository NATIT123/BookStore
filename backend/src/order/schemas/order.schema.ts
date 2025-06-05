import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Order extends Document {
  @Prop()
  name!: string;

  @Prop()
  phone!: string;

  @Prop()
  address!: string;

  @Prop({ default: "COD" }) // Hình thức thanh toán (Cash On Delivery mặc định)
  type!: string;

  @Prop()
  detail!: any[]; // Chi tiết đơn hàng, có thể là mảng các sản phẩm

  @Prop()
  totalPrice!: number;

  @Prop({ default: new Date() }) // Thời gian tạo mặc định là hiện tại
  createdAt!: Date;

  @Prop({ default: new Date() }) // Thời gian cập nhật mặc định là hiện tại
  updatedAt!: Date;

  @Prop()
  deletedAt!: Date; // Nếu soft delete
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderDocument = Order & Document;