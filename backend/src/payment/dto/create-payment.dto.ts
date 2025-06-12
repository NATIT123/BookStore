import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  @IsNotEmpty()
  bookId: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsNotEmpty()
  bookName: string;

  @IsNumber()
  price: number;
}

export class CreatePaymentDto {
  @IsNumber()
  totalPrice: number;

  @IsString()
  contentPayment: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  bankSelect?: string;

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  type: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
