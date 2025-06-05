import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(); ///nó tìm các trường username và password trong body của request
  }

  //thông tin người dùng sẽ được gắn vào request và có thể sử dụng ở các route handlers.
  ///Check username and password
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Username/password is not valid');
    }
    return user;
  }
}
