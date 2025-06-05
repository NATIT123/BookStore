import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsMongoId, IsNotEmpty, IsNumber, Min, ValidateNested } from "class-validator";

class DetailOrder {
  @IsNotEmpty({ message: "bookName không được để trống" })
  bookName!: string;

  @IsNotEmpty({ message: "quantity không được để trống" })
  @IsNumber({}, { message: "quantity phải có định dạng là số nguyên" })
  @Min(0, { message: "quantity phải lớn hơn hoặc bằng 0" })
  quantity!: number;

  @IsNotEmpty({ message: "_id không được để trống" })
  @IsMongoId({ message: "_id phải có định dạng là mongodb id" })
  _id!: string;
}
export class CreateOrderDto {
  @IsNotEmpty({ message: "name không được để trống" })
  name!: string;

  @IsNotEmpty({ message: "address không được để trống" })
  address!: string;

  @IsNotEmpty({ message: "phone không được để trống" })
  phone!: string;

  @IsNotEmpty({ message: "detail không được để trống" })
  @IsArray({ message: "detail có định dạng là array" })
  @ArrayNotEmpty({ message: "detail cần ít nhất 1 phần tử" })
  @ValidateNested({ each: true })
  @Type(() => DetailOrder)
  detail!: DetailOrder[];

  @IsNotEmpty({ message: "totalPrice không được để trống" })
  @IsNumber({}, { message: "totalPrice phải có định dạng là số nguyên" })
  @Min(0, { message: "totalPrice phải lớn hơn hoặc bằng 0" })
  totalPrice!: number;
}

