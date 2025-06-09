import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import {
  Permission,
  PermissionDocument,
} from 'src/permissions/schemas/permission.schema';
import { Role, RoleDocument } from 'src/roles/schemas/Role.schema';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';
import { Order, OrderDocument } from '../order/schemas/order.schema'; // Adjust path as necessary
import { History, HistoryDocument } from '../history/schemas/history.schema'; // Adjust path as necessary
import { Book, BookDocument } from '../book/schemas/book.schema';
import {
  initCountries,
  initProvinces,
  listBooks,
  // Make sure these match the actual exports from your init file
} from './init';
import { Country, CountryDocument } from './schemas/country.schema';
import { Province, ProvinceDocument } from './schemas/province.schema';
// Define types for method return values for clarity
export interface DashboardData {
  countOrder: number;
  countUser: number;
}

interface LocationOption {
  label: string;
  value: string;
}

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(History.name)
    private modelHistory: SoftDeleteModel<HistoryDocument>, // Assuming HistoryDocument exists
    @InjectModel(Order.name) private modelOrder: SoftDeleteModel<OrderDocument>, // Assuming OrderDocument exists
    @InjectModel(Book.name) private modelBook: SoftDeleteModel<BookDocument>,
    @InjectModel(Country.name)
    private modelCountry: SoftDeleteModel<CountryDocument>,
    @InjectModel(Province.name)
    private modelProvince: SoftDeleteModel<ProvinceDocument>,
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}
  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (Boolean(isInit)) {
      const countUser = await this.userModel.countDocuments({});
      const countPermission = await this.permissionModel.countDocuments({});
      const countRole = await this.roleModel.countDocuments({});
      const countCountry = await this.modelCountry.countDocuments({});
      const countProvince = await this.modelProvince.countDocuments({});
      const countBook = await this.modelBook.countDocuments({});

      // Initialize Countries
      if (countCountry === 0) {
        const countriesToInsert = initCountries.map((country) => ({
          name: country.name,
          value: country.value, // Use value from initCountries
          metaData: country.metaData, // Keep metadata
        }));
        await this.modelCountry.insertMany(countriesToInsert);
        this.logger.log(`Inserted ${countriesToInsert.length} countries.`);
      }

      // Initialize Provinces
      if (countProvince === 0) {
        const provincesToInsert = initProvinces.map((province) => ({
          name: province.name,
          value: province.value, // Use value from initProvinces
          metaData: province.metaData, // Keep metadata
        }));
        await this.modelProvince.insertMany(provincesToInsert);
        this.logger.log(`Inserted ${provincesToInsert.length} provinces.`);
      }

      // Initialize Books
      if (countBook === 0) {
        // Assuming listBooks structure matches Book schema
        await this.modelBook.insertMany(listBooks);
        this.logger.log(`Inserted ${listBooks.length} books.`);
      }

      //create permissions
      if (countPermission === 0) {
        await this.permissionModel.insertMany(INIT_PERMISSIONS);
        //bulk create
      }

      // create role
      if (countRole === 0) {
        const permissions = await this.permissionModel.find({}).select('_id');
        await this.roleModel.insertMany([
          {
            name: ADMIN_ROLE,
            description: 'Admin thì full quyền :v',
            isActive: true,
            permissions: permissions,
          },
          {
            name: USER_ROLE,
            description: 'Người dùng/Ứng viên sử dụng hệ thống',
            isActive: true,
            permissions: [], //không set quyền, chỉ cần add ROLE
          },
        ]);
      }

      if (countUser === 0) {
        const adminRole = await this.roleModel.findOne({ name: ADMIN_ROLE });
        const userRole = await this.roleModel.findOne({ name: USER_ROLE });
        await this.userModel.insertMany([
          {
            name: "I'm admin",
            email: 'admin@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 69,
            gender: 'MALE',
            address: 'VietNam',
            role: adminRole?._id,
          },
          {
            name: "I'm Hỏi Dân IT",
            email: 'hoidanit@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 96,
            gender: 'MALE',
            address: 'VietNam',
            role: adminRole?._id,
          },
          {
            name: "I'm normal user",
            email: 'user@gmail.com',
            password: this.userService.getHashPassword(
              this.configService.get<string>('INIT_PASSWORD'),
            ),
            age: 69,
            gender: 'MALE',
            address: 'VietNam',
            role: userRole?._id,
          },
        ]);
      }

      if (
        countUser > 0 &&
        countRole > 0 &&
        countPermission > 0 &&
        countCountry > 0 &&
        countProvince > 0 &&
        countBook > 0
      ) {
        this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
      }
    }
  }

  async getDashboard(): Promise<DashboardData> {
    const countOrder = await this.modelOrder.countDocuments({});
    const countUser = await this.userModel.countDocuments({});
    return {
      countOrder,
      countUser,
    };
  }

  async getProvince(): Promise<LocationOption[]> {
    let provinceOptions: LocationOption[] = [];
    // Find all provinces and map them to { label: name, value: value }
    const provinces = await this.modelProvince.find({}).exec();

    if (provinces && provinces.length > 0) {
      provinceOptions = provinces.map((province) => ({
        label: province.name,
        value: province._id.toString(), // Use _id as the value field
      }));
    }

    return provinceOptions;
  }

  async getCountry(): Promise<LocationOption[]> {
    let countryOptions: LocationOption[] = [];
    // Find all countries and map them to { label: name, value: value }
    const countries = await this.modelCountry.find({}).exec();

    if (countries && countries.length > 0) {
      countryOptions = countries.map((country) => ({
        label: country.name,
        value: country._id.toString(), // Use _id as the value field
      }));
    }

    return countryOptions;
  }
}
