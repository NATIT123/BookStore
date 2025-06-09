import { Controller, Get } from '@nestjs/common';
import { DatabasesService, DashboardData } from './databases.service';
import { BOOK_CATEGORY } from '../enum';
import { Public } from '../decorator/customize';
@Controller('database')
export class DatabasesController {
  constructor(private readonly databasesService: DatabasesService) {}
  @Get('dashboard')
  dashboard(): Promise<DashboardData> {
    return this.databasesService.getDashboard();
  }

  @Public()
  @Get('category')
  getCategory() {
    return Object.values(BOOK_CATEGORY);
  }
}
