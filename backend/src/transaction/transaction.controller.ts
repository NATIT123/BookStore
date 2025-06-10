import { Controller } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction') // Lưu ý: Nest CLI đặt tên endpoint mặc định là tên module/controller
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
}
