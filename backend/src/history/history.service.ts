import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { History, HistoryDocument } from "./schemas/history.schema";

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(History.name)
    private model: Model<HistoryDocument>
  ) {}

  async create(dto: any): Promise<any> {
    return ""; // Chưa xử lý logic tạo mới lịch sử
  }

  async findAll(user: any) {
    return this.model.find({ userId: user?._id }).sort("-createdAt");
  }

  findOne(id: string) {
    return `This action returns a #${id} history`;
  }

  update(id: string, dto: any) {
    return `This action updates a #${id} history`;
  }

  remove(id: string) {
    return `This action removes a #${id} history`;
  }
}
