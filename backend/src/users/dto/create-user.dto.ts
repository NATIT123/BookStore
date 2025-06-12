import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export enum UserType {
  LOCAL = 'local',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}
export class CreateUserDto {
  @IsEmail({})
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Password khong dc de trong' })
  password: string;

  @IsNotEmpty({ message: 'Phone khong dc de trong' })
  phone: string;

  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  @IsNotEmpty({ message: 'Gender khong dc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'Age khong dc de trong' })
  age: number;

  @IsNotEmpty({ message: 'Address khong dc de trong' })
  address: string;

  @IsNotEmpty({ message: 'RoleId khong dc de trong' })
  role: string;

  googleId: string;

  facebookId: string;
}

export class RegisterUserDto {
  @IsEmail({})
  @IsNotEmpty({ message: 'Email khong dc de trong' })
  email: string;

  @IsNotEmpty({ message: 'Password khong dc de trong' })
  password: string;

  confirmPassword: string;

  @IsNotEmpty({ message: 'Phone khong dc de trong' })
  phone: string;

  @IsNotEmpty({ message: 'Name khong dc de trong' })
  name: string;

  googleId: string;

  avatar: string;

  @IsEnum(UserType)
  @ApiProperty({
    enum: UserType,
    default: UserType.LOCAL,
  })
  type: UserType = UserType.LOCAL;

  @IsNotEmpty({ message: 'Gender khong dc de trong' })
  gender: string;

  @IsNotEmpty({ message: 'Age khong dc de trong' })
  age: number;

  @IsNotEmpty({ message: 'Address khong dc de trong' })
  address: string;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ajanuw', description: '账号' })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: '密码',
  })
  readonly password: string;
}
