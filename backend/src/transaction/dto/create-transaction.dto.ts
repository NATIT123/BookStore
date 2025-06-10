import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Nếu bạn dùng Swagger

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID of the associated order',
    example: '60d5ec49f8c7e00015f8e2a1',
  })
  @IsString() // Hoặc @IsMongoId() nếu bạn cài class-validator
  orderId!: string;

  @ApiProperty({
    description: 'Transaction reference from payment gateway',
    example: 'TXN_REF_12345',
  })
  @IsString()
  vnp_TxnRef!: string;

  @ApiProperty({ description: 'Amount of the transaction', example: 100000 })
  @IsNumber()
  vnp_Amount!: number;

  @ApiProperty({
    description: 'Bank code used for payment (optional)',
    required: false,
    example: 'NCB',
  })
  @IsOptional()
  @IsString()
  vnp_BankCode?: string;

  @ApiProperty({
    description: 'Response code from payment gateway',
    example: '00',
  })
  @IsString()
  vnp_ResponseCode!: string;

  @ApiProperty({
    description: 'Status of the transaction',
    enum: ['pending', 'success', 'fail'],
    default: 'pending',
  })
  @IsOptional()
  @IsEnum(['pending', 'success', 'fail'])
  vnp_TransactionStatus?: 'pending' | 'success' | 'fail' = 'pending';

  @ApiProperty({
    description: 'Date of payment (optional)',
    required: false,
    example: '20250610143000',
  })
  @IsOptional()
  @IsString()
  vnp_PayDate?: string;
}
