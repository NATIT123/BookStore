import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get('GOOGLE_APP_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_APP_CLIENT_SECRET'),
      callbackURL:
        configService.get('GOOGLE_APP_CALLBACK_URL') ||
        'http://localhost:8080/api/v1/auth/google/callback',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { id, emails, displayName, photos } = profile;

    const user = await this.authService.validateGoogleUser({
      googleId: id,
      email: emails[0].value,
      fullname: displayName,
      photo: photos?.[0]?.value,
    });

    return user; // sẽ gán vào req.user
  }
}
