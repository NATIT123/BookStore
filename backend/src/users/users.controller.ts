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
import {
  ResponseMessage,
  SkipCheckPermission,
  User,
} from 'src/decorator/customize';
import { IUser } from './users.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ResponseMessage('Get all user with paginate') //decorator with custom message
  @SkipCheckPermission()
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
