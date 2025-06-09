// src/book/book.service.ts (hoặc đường dẫn tương ứng)

// Import các thành phần cần thiết từ NestJS common module, Mongoose và các file nội bộ
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import aqp from 'api-query-params'; // api-query-params là một thư viện JS, import như thế này
import { CreateBookDto } from './dto/create-book.dto'; // Cần tạo DTO này
import { UpdateBookDto } from './dto/update-book.dto'; // Cần tạo DTO này
import { Book, BookDocument } from './schemas/book.schema'; // Cần định nghĩa Schema/Document Book

// Định nghĩa interface cho metadata phân trang
interface PaginationMeta {
  current: number;
  pageSize: number;
  pages: number;
  total: number;
}

// Định nghĩa interface cho kết quả findAll có phân trang
export interface PaginatedResult<T> {
  meta: PaginationMeta;
  result: T[];
}

// Sử dụng decorator @Injectable để đánh dấu lớp này có thể được inject
@Injectable()
export class BookService {
  // Sử dụng @InjectModel để inject Model Mongoose cho Book
  constructor(@InjectModel(Book.name) private model: Model<BookDocument>) {}

  /**
   * Tạo một bản ghi Book mới.
   * @param createBookDto DTO chứa dữ liệu tạo Book.
   * @returns Promise<BookDocument> Bản ghi Book đã tạo.
   */
  async create(createBookDto: CreateBookDto): Promise<BookDocument> {
    // Kết hợp DTO với thời gian tạo/cập nhật hiện tại và tạo bản ghi
    const createdBook = await this.model.create({
      ...createBookDto,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
    return createdBook;
  }

  /**
   * Tìm tất cả bản ghi Book với tùy chọn phân trang và lọc.
   * @param query Đối tượng query từ request (ví dụ: { page: 1, limit: 10, sort: "-price", ... }).
   * @param currentPage Số trang hiện tại.
   * @param limit Số bản ghi trên mỗi trang.
   * @returns Promise<PaginatedResult<BookDocument> | BookDocument[]> Kết quả có phân trang hoặc toàn bộ danh sách.
   */
  async findAll(
    query: any,
    currentPage?: string,
    limit?: string,
  ): Promise<PaginatedResult<BookDocument> | BookDocument[]> {
    if (currentPage && limit) {
      // Chế độ phân trang
      const { current, limit, ...restQuery } = query;

      const { filter, sort, population } = aqp(restQuery);

      const skip = (+current - 1) * +limit;
      const pageSize = +limit || 10; // Mặc định 10 bản ghi mỗi trang
      const totalItems = await this.model.find(filter).countDocuments(); // Sử dụng countDocuments() để đếm số lượng khớp với filter
      const totalPages = Math.ceil(totalItems / pageSize);

      const result = await this.model
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort(sort as any) // aqp trả về kiểu string|object, cần ép kiểu nếu TS báo lỗi
        .populate(population as any) // aqp trả về kiểu string|object, cần ép kiểu nếu TS báo lỗi
        .exec();

      return {
        meta: {
          current: +currentPage,
          pageSize: pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result: result,
      };
    } else {
      // Chế độ không phân trang, trả về tất cả
      return await this.model.find({}).exec();
    }
  }

  /**
   * Tìm một bản ghi Book theo ID.
   * @param id ID của bản ghi cần tìm.
   * @returns Promise<BookDocument> Bản ghi Book tìm được.
   * @throws BadRequestException Nếu không tìm thấy bản ghi.
   */
  async findOne(id: string): Promise<BookDocument> {
    const foundBook = await this.model.findById(id);
    if (foundBook) {
      return foundBook;
    }
    throw new BadRequestException(
      `Book với id = ${id} không tồn tại trên hệ thống.`,
    );
  }

  /**
   * Cập nhật một bản ghi Book theo ID.
   * @param id ID của bản ghi cần cập nhật.
   * @param updateBookDto DTO chứa dữ liệu cập nhật Book.
   * @returns Promise<any> Kết quả của thao tác cập nhật (từ Mongoose updateOne).
   * @throws BadRequestException Nếu không tìm thấy bản ghi.
   */
  async update(id: string, updateBookDto: UpdateBookDto): Promise<any> {
    // Mongoose updateOne trả về OperationResult
    const foundBook = await this.model.findById(id);
    if (foundBook) {
      return this.model.updateOne(
        { _id: id },
        {
          ...updateBookDto,
          updatedAt: new Date(),
        },
      );
    }
    throw new BadRequestException(
      `Book với id = ${id} không tồn tại trên hệ thống.`,
    );
  }

  /**
   * Xóa một bản ghi Book theo ID.
   * @param id ID của bản ghi cần xóa.
   * @returns Promise<any> Kết quả của thao tác xóa (từ Mongoose deleteOne).
   * @throws BadRequestException Nếu không tìm thấy bản ghi.
   */
  async remove(id: string): Promise<any> {
    // Mongoose deleteOne trả về DeleteResult
    const foundBook = await this.model.findById(id);
    if (foundBook) {
      return this.model.deleteOne({ _id: id });
    }
    throw new BadRequestException(
      `Book với id = ${id} không tồn tại trên hệ thống.`,
    );
  }

  /**
   * Cập nhật ảnh cho Book (thumbnail hoặc thêm vào slider).
   * @param id ID của Book.
   * @param type Loại ảnh ('thumbnail' hoặc 'slider').
   * @param fileName Tên file ảnh mới.
   * @returns Promise<any> Kết quả của thao tác cập nhật (từ Mongoose updateOne).
   * @throws BadRequestException Nếu không tìm thấy bản ghi.
   */
  async updateImageBook(
    id: string,
    type: 'thumbnail' | 'slider',
    fileName: string,
  ): Promise<any> {
    const foundBook = await this.model.findById(id);
    if (foundBook) {
      if (type === 'slider') {
        // Thêm ảnh vào mảng slider
        return this.model.updateOne(
          { _id: id },
          {
            slider: [...foundBook.slider, fileName],
            updatedAt: new Date(),
          },
        );
      } else {
        // Cập nhật ảnh thumbnail
        return this.model.updateOne(
          { _id: id },
          {
            thumbnail: fileName,
            updatedAt: new Date(),
          },
        );
      }
    }
    throw new BadRequestException(
      `Book với id = ${id} không tồn tại trên hệ thống.`,
    );
  }

  /**
   * Xóa một ảnh cụ thể khỏi Book (thumbnail hoặc từ slider).
   * @param id ID của Book.
   * @param imagePath Đường dẫn/tên file ảnh cần xóa.
   * @param type Loại ảnh ('thumbnail' hoặc 'slider').
   * @returns Promise<any> Kết quả của thao tác cập nhật (từ Mongoose updateOne).
   * @throws BadRequestException Nếu không tìm thấy bản ghi.
   */
  async deleteAnImage(
    id: string,
    imagePath: string,
    type: 'thumbnail' | 'slider',
  ): Promise<any> {
    const foundBook = await this.model.findById(id);
    if (foundBook) {
      if (type === 'slider') {
        // Lọc bỏ ảnh khỏi mảng slider
        return this.model.updateOne(
          { _id: id },
          {
            slider: foundBook.slider.filter((img) => img !== imagePath),
            updatedAt: new Date(),
          },
        );
      } else {
        // Xóa ảnh thumbnail (đặt thành rỗng)
        return this.model.updateOne(
          { _id: id },
          {
            thumbnail: '',
            updatedAt: new Date(),
          },
        );
      }
    }
    throw new BadRequestException(
      `Book với id = ${id} không tồn tại trên hệ thống.`,
    );
  }
}

// Phần làm rối mã nguồn và boilerplate __decorate, __metadata, __param được loại bỏ
// vì TypeScript và NestJS xử lý việc áp dụng decorator và cấu trúc module tự động.
