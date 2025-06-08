// src/book/schemas/book.schema.ts (hoặc đường dẫn tương ứng)

// Import các thành phần cần thiết từ Mongoose và @nestjs/mongoose
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// Định nghĩa kiểu dữ liệu cho Document của Book (bao gồm cả thuộc tính của Mongoose Document)
export type BookDocument = Book & Document;

// Sử dụng decorator @Schema để định nghĩa Schema
@Schema()
export class Book {
  // Định nghĩa các thuộc tính của document sử dụng decorator @Prop
  // Có thể thêm tùy chọn validator, index, required, default, etc. trong @Prop({})

  @Prop()
  thumbnail!: string;

  @Prop()
  slider!: string[]; // Mảng chuỗi

  @Prop()
  mainText!: string;

  @Prop()
  author!: string;

  @Prop()
  price!: number;

  @Prop()
  sold!: number;

  @Prop()
  quantity!: number;

  @Prop()
  category!: string;

  // Thêm tùy chọn timestamps vào Schema thay vì định nghĩa thủ công createdAt/updatedAt
  // @Prop({ default: Date.now }) // Nếu không dùng timestamps tự động, có thể dùng default
  // createdAt: Date;

  // @Prop({ default: Date.now }) // Nếu không dùng timestamps tự động, có thể dùng default
  // updatedAt: Date;

  @Prop()
  deletedAt?: Date; // Dùng optional (?) nếu thuộc tính này có thể null/undefined (cho soft delete)

  // NestJS/Mongoose sẽ tự thêm trường _id kiểu ObjectId
}

// Tạo Mongoose Schema từ lớp Book
// Thêm tùy chọn timestamps: true để Mongoose tự động quản lý createdAt và updatedAt
export const BookSchema = SchemaFactory.createForClass(Book).set(
  'timestamps',
  true,
);

// Export cả lớp Book (để dùng trong InjectModel) và BookSchema
// export { BookSchema }; // Hoặc export riêng BookSchema nếu cần
