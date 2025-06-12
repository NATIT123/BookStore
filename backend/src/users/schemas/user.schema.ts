import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Role } from 'src/roles/schemas/Role.schema';
import { UserType } from '../dto/create-user.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: Role;

  @Prop({
    required: true,
    enum: UserType,
    default: UserType.LOCAL,
  })
  type: UserType;

  @Prop()
  googleId: string;

  @Prop()
  facebookId: string;

  @Prop()
  refreshToken: string;

  @Prop()
  phone: string;

  @Prop()
  name: string;

  @Prop()
  isActive: boolean;

  @Prop()
  age: number;

  @Prop()
  avatar: string;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: Date;

  @Prop()
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
