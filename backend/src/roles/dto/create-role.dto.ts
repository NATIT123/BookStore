import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Description khong dc de trong' })
  description: string;

  @IsBoolean({ message: 'isActive is not empty' })
  @IsNotEmpty({ message: 'Status khong dc de trong' })
  isActive: string;

  @IsNotEmpty({ message: 'Permissions is not empty' })
  @IsMongoId({ each: true, message: 'each permission is mongo objectid' })
  @IsArray({ message: 'permissions must be an array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
