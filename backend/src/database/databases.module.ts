import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schema';
import { UsersService } from 'src/users/users.service';
import { Order, OrderSchema } from 'src/order/schemas/order.schema';
import { Book, BookSchema } from 'src/book/schemas/book.schema';
import { History, HistorySchema } from 'src/history/schemas/history.schema';
import { Province, ProvinceSchema } from './schemas/province.schema';
import { Country, CountrySchema } from './schemas/country.schema';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Book.name, schema: BookSchema },
      { name: History.name, schema: HistorySchema },
      { name: Province.name, schema: ProvinceSchema },
      { name: Country.name, schema: CountrySchema },
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
})
export class DatabasesModule {}
