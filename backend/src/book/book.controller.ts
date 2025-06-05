// src/book/book.controller.ts (hoặc đường dẫn tương ứng)

// Import các thành phần cần thiết từ NestJS common module, và các file nội bộ
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { BookService } from "./book.service"; // Import BookService
import { CreateBookDto } from "./dto/create-book.dto"; // Import CreateBookDto
import { UpdateBookDto } from "./dto/update-book.dto"; // Import UpdateBookDto
import { Public } from "../auth/public.decorator";


// Sử dụng decorator @Controller để định nghĩa BookController với base route 'book'
@Controller("book")
export class BookController {
  // Inject BookService vào constructor
  constructor(private readonly bookService: BookService) {}

  // Endpoint POST /book
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  // Endpoint GET /book
  // Đánh dấu Public vì không yêu cầu xác thực
  @Public()
  @Get()
  async findAll(
    @Query() query: any, // Lấy toàn bộ query object
    @Query("current") currentPage?: string, // Lấy query param 'current' (tùy chọn)
    @Query("pageSize") limit?: string // Lấy query param 'pageSize' (tùy chọn)
  ) {
    return this.bookService.findAll(query, currentPage, limit);
  }

  // Endpoint GET /book/:id
  // Đánh dấu Public vì không yêu cầu xác thực
  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.bookService.findOne(id);
  }

  // Endpoint PUT /book/:id
  @Put(":id")
  update(@Param("id") id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  // Endpoint DELETE /book/:id
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.bookService.remove(id);
  }

  @Public()
  @Post("/delete-image") // Original code used POST here
  // Lấy các giá trị 'id', 'type', 'imagePath' từ body
  deleteImage(
    @Body("id") id: string,
    @Body("type") type: "thumbnail" | "slider", // Rõ ràng hơn về kiểu của 'type'
    @Body("imagePath") imagePath: string
  ) {
    // Giả định bookService có phương thức này, cần kiểm tra lại Service
    // Dựa trên phân tích Service, phương thức tương ứng là deleteAnImage
    return this.bookService.deleteAnImage(id, imagePath, type);
    // Nếu cần update ảnh, phương thức updateImageBook có vẻ phù hợp hơn với POST /delete-image
    // Có vẻ tên phương thức trong Controller và Service hơi lệch nhau trong mã gốc.
    // Dựa trên code gốc, phương thức deleteImage trong Controller gọi bookService.deleteAnImage
  }
}
