import { IsNotEmpty } from 'class-validator';

export class UpdateUserPasswordDto {
  @IsNotEmpty({ message: 'Password khong dc de trong' })
  password: string;

  @IsNotEmpty({ message: 'NewPassword khong dc de trong' })
  newPassword: string;
}
