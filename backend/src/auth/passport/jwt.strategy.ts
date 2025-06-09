import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';
import { UsersService } from 'src/users/users.service';
import { Permission } from 'src/permissions/schemas/permission.schema';
export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  status?: string;
}

interface Role {
  permissions: Permission[];
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Khóa bí mật để giải mã JWT
    });
  }

  //Decode JWT token and assign req.user =user
  async validate(payload: IUser) {
    const user = await this.userService.findOne(payload._id);

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    };
  }
}
