import {
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Body,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { RegisterUserDto, UserLoginDto } from 'src/users/dto/create-user.dto';
import { Request, Response } from 'express';
import { IUser } from 'src/users/users.interface';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ResponseMessage('Login')
  @Public()
  @Throttle(5, 60)
  @UseGuards(ThrottlerGuard)
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Post('/login')
  //passthrough: true using when assign cookie to response before return response
  handleLogin(@Req() req: any, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @ResponseMessage('Get User Information')
  @Get('/account')
  getProfile(@User() user: IUser) {
    return user;
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    console.log(registerUserDto);
    return this.authService.register(registerUserDto);
  }

  @ResponseMessage('Get User by refresh token')
  @Post('/refresh')
  handleRefreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];

    return this.authService.processNewToken(refreshToken, response);
  }

  @ResponseMessage('Logout User')
  @Post('/logout')
  handleLogout(
    @User() user: IUser,
    @Res({ passthrough: true })
    response: Response,
  ) {
    return this.authService.logout(response, user);
  }
}
