import { ConfigService } from '@nestjs/config';
import { RegisterUserDto } from './../users/dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';
const ms = require('ms');
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //userName and password are two arguments that are returned from the validate method of LocalStrategy
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUserName(username);
    if (user) {
      const isValid = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        const returnUser = await user.populate({
          path: 'role',
          select: { _id: 1, name: 1, permissions: 1 },
          populate: [
            { path: 'permissions', select: { method: 1, apiPath: 1 } },
          ],
        });
        return returnUser;
      }
    }
    return null;
  }

  async login(user: IUser, response: Response) {
    const { _id, name, email, role } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
      name,
      email,
      role,
    };
    const refreshToken = this.createRefreshToken(payload);

    //Update user refreshToken
    await this.usersService.updateUserToken(refreshToken, _id);

    ///Set Cookie refresh_token
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        name,
        email,
        role,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    let newUser = await this.usersService.registerUser(registerUserDto);
    return {
      _id: newUser?._id,
      createdAt: newUser?.createdAt,
    };
  }

  createRefreshToken = (payload) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000,
    });
    return refreshToken;
  };

  processNewToken = async (refreshToken: string, response: Response) => {
    try {
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const { _id, name, email } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role: user.role.name,
        };
        const refreshToken = this.createRefreshToken(payload);

        //Update user refreshToken
        await this.usersService.updateUserToken(refreshToken, _id.toString());

        ///Set Cookie refresh_token
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            name,
            email,
            role: user.role.name,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token is not valid.Please sign in again',
        );
      }
    } catch (err) {
      throw new BadRequestException(
        'Refresh token is not valid.Please sign in again',
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };
}
