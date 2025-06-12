import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_APP_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_APP_CLIENT_SECRET'),
      callbackURL:
        configService.get('FACEBOOK_APP_CALLBACK_URL') ||
        'http://localhost:8080/api/v1/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name', 'displayName', 'photos'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    const email = emails?.[0]?.value;
    const photo = photos?.[0]?.value;

    const user = await this.authService.validateFacebookUser({
      facebookId: id,
      email,
      fullname: displayName,
      photo,
    });

    return user; // sẽ gán vào req.user
  }
}
