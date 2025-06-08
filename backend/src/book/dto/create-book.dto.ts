// src/book/dto/create-book.dto.ts (hoặc đường dẫn tương ứng)

// Import các decorator cần thiết từ class-validator
import {
  IsNotEmpty,
  IsArray,
  IsNumber,
  Min,
  IsEnum,
  IsString, // Có thể thêm IsString cho rõ ràng, mặc dù IsNotEmpty ngầm định
} from 'class-validator';

// Import enum BOOK_CATEGORY từ file tương ứng
import { BOOK_CATEGORY } from '../../enum'; // Giả định đường dẫn file enum

// Định nghĩa lớp CreateBookDto và áp dụng các decorator validation
export class CreateBookDto {
  @IsNotEmpty({ message: 'thumbnail không được để trống' })
  @IsString() // Thêm decorator IsString cho rõ ràng
  thumbnail!: string;

  @IsNotEmpty({ message: 'slider không được để trống' })
  @IsArray({ message: 'slider phải có định dạng là array' })
  // Có thể thêm @ArrayOf(IsString()) nếu sử dụng class-transformer và validator phức tạp
  slider!: string[]; // Mảng chuỗi

  @IsNotEmpty({ message: 'mainText không được để trống' })
  @IsString() // Thêm decorator IsString
  mainText!: string;

  @IsNotEmpty({ message: 'author không được để trống' })
  @IsString() // Thêm decorator IsString
  author!: string;

  @IsNotEmpty({ message: 'price không được để trống' })
  @IsNumber({}, { message: 'price phải có định dạng là số nguyên' }) // Giữ nguyên cấu hình gốc
  @Min(0, { message: 'price phải lớn hơn hoặc bằng 0' })
  price!: number;

  @IsNotEmpty({ message: 'sold không được để trống' })
  @IsNumber({}, { message: 'sold phải có định dạng là số nguyên' }) // Giữ nguyên cấu hình gốc
  @Min(0, { message: 'sold phải lớn hơn hoặc bằng 0' }) // Lưu ý: Thông báo lỗi trong mã gốc bị nhầm lẫn là của quantity
  sold!: number;

  @IsNotEmpty({ message: 'quantity không được để trống' })
  @IsNumber({}, { message: 'quantity phải có định dạng là số nguyên' }) // Giữ nguyên cấu hình gốc
  @Min(0, { message: 'quantity phải lớn hơn hoặc bằng 0' })
  quantity!: number;

  @IsNotEmpty({ message: 'category không được để trống' })
  @IsEnum(BOOK_CATEGORY, { message: 'category không tồn tại' })
  category!: BOOK_CATEGORY; // Sử dụng kiểu dữ liệu enum cho rõ ràng
}

// Phần làm rối mã nguồn và boilerplate __decorate, __metadata được loại bỏ
// vì TypeScript và NestJS xử lý việc áp dụng decorator và cấu trúc module tự động.
