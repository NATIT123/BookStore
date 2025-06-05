import { ObjectType } from "@nestjs/graphql";
import { Field } from "@nestjs/graphql";

import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

// Định nghĩa DTO và Schema cho NestJS
@ObjectType()
@Schema()
export class CreateHistoryDto extends Document {
  @Field()
  @Prop()
  ten!: string; // Trường tên

  @Field()
  @Prop()
  tuoi!: number; // Trường tuổi
}

export const CreateHistorySchema =
  SchemaFactory.createForClass(CreateHistoryDto);
