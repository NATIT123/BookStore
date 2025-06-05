import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'ApiPath khong dc de trong' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method khong dc de trong' })
  method: string;

  @IsNotEmpty({ message: 'Module khong dc de trong' })
  module: string;
}
