import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CountryMetaData } from '../init';

@Schema()
export class Country extends Document {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  value!: string;

  @Prop({ type: Object, required: true })
  metaData!: CountryMetaData;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
export type CountryDocument = Country & Document;
