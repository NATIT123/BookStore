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
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ResponseMessage('Login')
  @Public()
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @UseGuards(ThrottlerGuard, LocalAuthGuard)
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
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Google sends back the user after login
    const data = await this.authService.login(req.user, response);
    return response.redirect(
      `http://localhost:3000/login-success?token=${data.access_token}`,
    );
  }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    // Redirect to Facebook
  }

  @Public()
  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  async facebookCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const data = await this.authService.login(req.user, response);
    return response.redirect(
      `http://localhost:3000/login-success?token=${data.access_token}`,
    );
  }

  @Public()
  @ResponseMessage('Register a new user')
  @Post('/register')
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
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
