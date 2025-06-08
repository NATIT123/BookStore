// src/book/dto/update-book.dto.ts (hoặc đường dẫn tương ứng)

// Import OmitType từ @nestjs/swagger
import { OmitType } from '@nestjs/swagger';

// Import CreateBookDto từ file tương ứng
import { CreateBookDto } from './create-book.dto';

// Định nghĩa UpdateBookDto bằng cách kế thừa từ CreateBookDto
// và sử dụng OmitType để bỏ qua trường 'sold'.
// Điều này tạo ra một DTO mới với tất cả các trường của CreateBookDto
// ngoại trừ trường 'sold'.
export class UpdateBookDto extends OmitType(CreateBookDto, ['sold']) {
  // Các trường khác từ CreateBookDto sẽ tự động được bao gồm,
  // ngoại trừ trường 'sold'.
  // Nếu cần thêm các trường mới hoặc ghi đè kiểu, có thể định nghĩa ở đây.
  // Ví dụ: someNewField: string;
}

// Phần làm rối mã nguồn và boilerplate được loại bỏ
// vì TypeScript và NestJS xử lý việc áp dụng decorator và cấu trúc module tự động.
