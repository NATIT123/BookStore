import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';

import { Order, OrderSchema } from './schemas/order.schema';
import { Book, BookSchema } from '../book/schemas/book.schema';
import { History, HistorySchema } from '../history/schemas/history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Book.name, schema: BookSchema },
      { name: History.name, schema: HistorySchema },
    ]),
  ],
  exports: [OrderService],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
