import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { Role, RoleDocument } from 'src/roles/schemas/Role.schema';
import { USER_ROLE } from 'src/database/sample';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    const offset = (+currentPage - 1) * +limit;
    const defaultLimit = +limit ? +limit : 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .select(projection)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result: result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }
    const user = await this.userModel
      .findById(id)
      .populate({
        path: 'role',
        select: 'name email avatar role phone',
        populate: {
          path: 'permissions', // chính là field bên trong schema Role
          select: 'method apiPath', // các field bạn muốn lấy từ permission
        },
      })
      .select('-password')
      .lean();
    if (!user) {
      throw new BadRequestException('User is not valid');
    }
    return user;
  }

  async isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  async findOneByUserName(userName: string) {
    return await this.userModel.findOne({ email: userName });
  }

  async update(id: string, updateUserDto: UpdateUserDto, userUpdated: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User is not valid');
    }
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          ...updateUserDto,
          updatedBy: {
            _id: userUpdated._id,
            email: userUpdated.email,
          },
        },
      );
      return { message: true };
    } catch (err) {
      return err;
    }
  }

  async changePassword(
    id: string,
    updateUserPassword: UpdateUserPasswordDto,
    currentUser: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Id is not valid');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new BadRequestException('User is not valid');
    }
    const isValid = await this.isValidPassword(
      updateUserPassword.password,
      user.password,
    );

    if (!isValid) {
      throw new BadRequestException('Password is wrong');
    }
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          ...user,
          password: this.getHashPassword(updateUserPassword.newPassword),
          updatedBy: {
            _id: currentUser._id,
            email: currentUser.email,
          },
        },
      );
      return { message: true };
    } catch (err) {
      return err;
    }
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { message: 'Id is not valid' };
    }
    const userFind = await (
      await this.userModel.findById(id)
    ).populate({
      path: 'role',
      select: { name: 1 },
    });
    if (
      !userFind ||
      userFind.email === 'admin@gmail.com' ||
      userFind.role.name === 'Admin'
    ) {
      throw new BadRequestException('Can not delete Admin');
    }
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          deletedBy: {
            _id: user._id,
            email: user.email,
          },
        },
      );

      return this.userModel.softDelete({ _id: id });
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async registerUser(user: RegisterUserDto) {
    const { email, name, password, address, age, phone, gender } = user;
    const isExistEmail = await this.userModel.findOne({ email: email });
    if (isExistEmail) {
      throw new BadRequestException(`Email:${email} is exist`);
    }
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      email,
      name,
      password: hashPassword,
      address,
      age,
      phone,
      isActive: true,
      avatar: 'ee11cbb19052e40b07aac0ca060c23ee.png',
      gender,
      role: userRole?._id,
    });
    return newUser;
  }

  async createUser(user: CreateUserDto, userCreated: IUser) {
    const { email, name, password, address, age, phone, gender, role } = user;
    const isExistEmail = await this.userModel.findOne({ email: email });
    if (isExistEmail) {
      throw new BadRequestException(`Email:${email} is exist`);
    }
    const hashPassword = this.getHashPassword(password);
    const newUser = await this.userModel.create({
      email,
      name,
      password: hashPassword,
      address,
      age,
      phone,
      gender,
      role,
      isActive: true,
      avatar: 'ee11cbb19052e40b07aac0ca060c23ee.png',
      createdBy: {
        _id: userCreated._id,
        email: userCreated.email,
      },
    });
    return newUser;
  }

  async updateUserToken(refreshToken: string, _id: string) {
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new BadRequestException('Id is not valid');
    }
    const user = await this.userModel.findById(_id);
    if (!user) {
      throw new BadRequestException('User is not valid');
    }
    return await user.updateOne({ refreshToken });
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModel
      .findOne({ refreshToken })
      .populate({ path: 'role' });
  };

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
}
