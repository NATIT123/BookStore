import apiQueryParams from 'api-query-params';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Book, BookDocument } from '../book/schemas/book.schema';
import { Order, OrderDocument } from './schemas/order.schema';
import { History, HistoryDocument } from '../history/schemas/history.schema';
@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private modelOrder: Model<OrderDocument>,
    @InjectModel(Book.name) private modelBook: Model<BookDocument>,
    @InjectModel(History.name) private modelHistory: Model<HistoryDocument>,
  ) {}

  // Tạo đơn hàng mới
  async create(orderDto: any, user?: any): Promise<Order> {
    const items = orderDto.orderItems;
    const ids = items.map(
      (item: { bookId: any }) => new mongoose.Types.ObjectId(item.bookId),
    );

    // Lấy thông tin sách theo ID
    const books = await this.modelBook.find({ _id: { $in: ids } });
    if (books.length > 0 && books.length === ids.length) {
      let hasError = false;
      let errorMsg = '';

      // Kiểm tra tồn kho và tính tổng tiền
      items.forEach(
        (item: { bookId: any; quantity: number; bookName: any }) => {
          const book = books.find((b) => b._id.toString() === item.bookId);
          if (book) {
            if (book.quantity < item.quantity) {
              hasError = true;
              errorMsg = `Book ${item.bookName} không đủ số lượng yêu cầu = ${item.quantity}`;
            }
          }
        },
      );

      if (hasError) {
        throw new BadRequestException(errorMsg);
      }

      // Cập nhật số lượng sách trong kho
      const bulkOps = items.map((item: { bookId: any; quantity: number }) => ({
        updateOne: {
          filter: { _id: item.bookId },
          update: {
            $inc: {
              quantity: -item.quantity,
              sold: item.quantity,
            },
            updatedAt: new Date(),
          },
        },
      }));
      await this.modelBook.bulkWrite(bulkOps);

      // Lưu đơn hàng
      const order = await this.modelOrder.create({
        ...orderDto,
      });

      // Lưu lịch sử giao dịch
      await this.modelHistory.create({
        name: orderDto.name,
        email: user?.email,
        userId: user?._id,
        phone: orderDto.phone,
        totalPrice: orderDto.totalPrice,
        detail: orderDto.orderItems,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return order;
    }

    throw new BadRequestException('Books trong order không tồn tại');
  }

  // Tìm tất cả đơn hàng có phân trang, lọc, sắp xếp, populate
  async findAll(query: any, page: string, pagesize: string) {
    const { current, pageSize, ...restQuery } = query;
    const { filter, projection, population, sort } = apiQueryParams(restQuery);
    const skip = (+page - 1) * +pagesize;
    const limit = +pagesize || 10;
    const total = (await this.modelOrder.find(filter)).length;

    return {
      meta: {
        current: page,
        pagesize,
        pages: Math.ceil(total / limit),
        total,
      },
      result: await this.modelOrder
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort(sort as any)
        .select(projection)
        .populate(population)
        .exec(),
    };
  }

  // Xử lý tên riêng
  findOne(id: string) {
    return `This action returns a #${id} order`;
  }

  // Xóa đơn hàng (chưa xử lý logic, chỉ trả về 'ok')
  async remove(id: string, user?: any) {
    return 'ok';
  }

  async updateStatus(orderId: string, status: string) {
    await this.modelOrder.findByIdAndUpdate(orderId, { status });
  }
}
