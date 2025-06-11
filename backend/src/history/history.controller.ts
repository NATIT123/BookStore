import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
} from "@nestjs/common";
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from "./dto/update-history.dto";

@Controller("history") // Định nghĩa route cho controller
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  // Tạo mới bản ghi lịch sử
  @Post()
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  // Lấy tất cả bản ghi lịch sử của người dùng
  @Get()
  findAll(@Req() req: any) {
    return this.historyService.findAll(req.user); // req.user giả sử là thông tin người dùng từ middleware
  }

  // Lấy một bản ghi lịch sử theo ID
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.historyService.findOne(id); // Chuyển id thành số
  }

  // Cập nhật một bản ghi lịch sử theo ID
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateHistoryDto: UpdateHistoryDto) {
    return this.historyService.update(id, updateHistoryDto); // Chuyển id thành số và gọi service để cập nhật
  }

  // Xoá một bản ghi lịch sử theo ID
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.historyService.remove(id); // Chuyển id thành số và gọi service để xoá
  }
}
