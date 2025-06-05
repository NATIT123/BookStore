import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Lấy token từ header Authorization
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'), // Khóa bí mật để giải mã JWT
    });
  }

  //Decode JWT token and assign req.user =user
  async validate(payload: IUser) {
    const { _id, name, email, role } = payload;
    return {
      _id,
      name,
      email,
      role,
      permissions: payload.role.permissions,
    };
  }
}
