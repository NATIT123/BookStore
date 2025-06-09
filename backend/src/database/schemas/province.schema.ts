import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProvinceMetaData } from '../init';

@Schema()
export class Province extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ type: Object, required: true })
  metaData!: ProvinceMetaData;
}

export const ProvinceSchema = SchemaFactory.createForClass(Province);
export type ProvinceDocument = Province & Document;
