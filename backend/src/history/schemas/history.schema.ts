import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
  @Prop()
  userId!: string;

  @Prop()
  email!: string;

  @Prop()
  name!: string;

  @Prop()
  phone!: string;

  @Prop()
  detail!: string[];

  @Prop({ default: 0 })
  totalPrice!: number;

  @Prop({ default: new Date() })
  createdAt!: Date;

  @Prop({ default: new Date() })
  updatedAt!: Date;

  @Prop()
  deletedAt!: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);
export type HistoryDocument = History & Document;
