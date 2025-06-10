import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionStatusDto {
  @ApiProperty({
    description: 'New status of the transaction',
    enum: ['pending', 'success', 'fail'],
  })
  @IsEnum(['pending', 'success', 'fail'])
  status!: 'pending' | 'success' | 'fail';
}
