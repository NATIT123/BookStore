import { Controller, Post, Body, Req, Get, Query } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req: any) {
    return this.orderService.create(createOrderDto, req.user);
  }

  @Get()
  async findAll(
    @Query() current: string,
    @Query("pageSize") pageSize: string,
    @Query("user") user: string
  ) {
    return this.orderService.findAll(current, pageSize, user);
  }
}
