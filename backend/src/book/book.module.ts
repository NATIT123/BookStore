// src/book/book.module.ts (hoặc đường dẫn tương ứng)

// Import các thành phần cần thiết từ NestJS common module, Mongoose và các file nội bộ
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose"; // Import MongooseModule
import { BookController } from "./book.controller"; // Import BookController
import { BookService } from "./book.service"; // Import BookService
import { Book, BookSchema } from "./schemas/book.schema"; // Import Schema và Document Book

// Sử dụng decorator @Module để định nghĩa BookModule
@Module({
  imports: [
    // Đăng ký Mongoose model cho Book trong module này
    MongooseModule.forFeature([
      {
        name: Book.name, // Tên model (thường lấy từ tên lớp Schema)
        schema: BookSchema, // Schema Mongoose cho model này
      },
    ]),
    // Thêm các module khác nếu cần (ví dụ: CoreModule, AuthModule, UploadModule...)
  ],
  controllers: [BookController], // Khai báo các controller của module
  providers: [BookService], // Khai báo các providers (services) của module
  exports: [BookService], // Export các providers cần dùng ở các module khác
})
export class BookModule {}

// Phần làm rối mã nguồn và boilerplate __decorate được loại bỏ
// vì TypeScript và NestJS xử lý việc áp dụng decorator và cấu trúc module tự động.
