import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './users.interface';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Get all user with paginate') //decorator with custom message
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @ResponseMessage('Get a user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage('Update a user')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user,
  ) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @ResponseMessage('Update new password')
  @Post('change-password/:id')
  updatePassword(
    @Param('id') id: string,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @User() user,
  ) {
    return this.usersService.changePassword(id, updateUserPasswordDto, user);
  }

  @ResponseMessage('Remove a new user')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.remove(id, user);
  }

  @ResponseMessage('Create a new user')
  @Post('')
  register(@Body() createUser: CreateUserDto, @User() user: IUser) {
    return this.usersService.createUser(createUser, user);
  }
}
