import { ConfigService } from '@nestjs/config';
import { RegisterUserDto, UserType } from './../users/dto/create-user.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
import { Response } from 'express';
import * as ms from 'ms';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from 'src/roles/schemas/Role.schema';
import { USER_ROLE } from 'src/database/sample';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
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
          select: {
            _id: 1,
            name: 1,
            permissions: 1,
            avatar: 1,
            phone: 1,
            address: 1,
          },
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
    const { _id, name, email, role, avatar } = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      _id,
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
        avatar,
      },
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    const newUser = await this.usersService.registerUser(registerUserDto);
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
      // Verify refresh token
      this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      // Nếu verify thành công nghĩa là refresh token còn hạn
      // => chỉ cấp access token mới thôi, không cấp refresh token mới
      const user = await this.usersService.findUserByToken(refreshToken);
      if (!user) {
        throw new BadRequestException(
          'Refresh token is not valid. Please sign in again',
        );
      }

      const { _id, name, email, role } = user;
      const payload = {
        sub: 'token refresh',
        iss: 'from server',
        _id,
        name,
        email,
        role: role.name,
      };

      return {
        access_token: this.jwtService.sign(payload),
        user: { _id, name, email, role: role.name },
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        // Refresh token hết hạn => cấp refresh token + access token mới
        // Có thể lấy user từ DB theo refresh token cũ hoặc JWT payload (tùy cách lưu)
        const user = await this.usersService.findUserByToken(refreshToken);
        if (!user) {
          throw new BadRequestException(
            'Refresh token is not valid. Please sign in again',
          );
        }
        const { _id, name, email, role } = user;
        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role: role.name,
        };

        // Tạo refresh token mới
        const newRefreshToken = this.createRefreshToken(payload);
        await this.usersService.updateUserToken(
          newRefreshToken,
          _id.toString(),
        );

        // Set lại cookie mới
        response.clearCookie('refresh_token');
        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: { _id, name, email, role: role.name },
        };
      }

      // Các lỗi khác
      throw new BadRequestException(
        'Refresh token is not valid. Please sign in again',
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateUserToken('', user._id);
    response.clearCookie('refresh_token');
    return 'ok';
  };

  async validateGoogleUser(profile: {
    googleId: string;
    email: string;
    fullname: string;
    photo?: string;
  }) {
    const existingUser = await this.userModel.findOne({ email: profile.email });

    if (existingUser) {
      if (!existingUser.googleId) {
        existingUser.googleId = profile.googleId;
        await existingUser.save();
      }
      return existingUser;
    }
    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    const newUser = await this.userModel.create({
      googleId: profile.googleId,
      email: profile.email,
      name: profile.fullname,
      avatar: profile.photo,
      type: UserType.GOOGLE,
      role: userRole._id,
      password: 'default_password',
      confirmPassword: 'default_password',
      address: 'default address',
      gender: 'other',
      age: 0,
      phone: '0000000000',
    });

    return newUser;
  }

  async validateFacebookUser(profile: {
    facebookId: string;
    email: string;
    fullname: string;
    photo?: string;
  }) {
    const existingUser = await this.userModel.findOne({ email: profile.email });

    if (existingUser) {
      if (!existingUser.facebookId) {
        existingUser.facebookId = profile.facebookId;
        await existingUser.save();
      }
      return existingUser;
    }

    const userRole = await this.roleModel.findOne({ name: USER_ROLE });
    console.log(profile);
    const newUser = await this.userModel.create({
      facebookId: profile.facebookId,
      email: profile.email,
      name: profile.fullname,
      avatar: profile.photo,
      type: UserType.FACEBOOK,
      role: userRole._id,
      password: 'default_password',
      confirmPassword: 'default_password',
      address: 'default address',
      gender: 'other',
      age: 0,
      phone: '0000000000',
    });

    return newUser;
  }
}
