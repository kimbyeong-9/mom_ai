import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

import type { OAuthProfile } from './oauth-profile.type';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID ?? '',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
      callbackURL: `${process.env.BACKEND_URL ?? 'http://localhost:3000'}/auth/kakao/callback`,
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: (err: unknown, user?: OAuthProfile) => void,
  ) {
    const kakaoAccount = (
      profile._json as { kakao_account?: { email?: string } }
    )?.kakao_account;
    const email = kakaoAccount?.email ?? `kakao_${profile.id}@kakao.local`;
    const oauthProfile: OAuthProfile = {
      email,
      name: profile.displayName ?? profile.username ?? '카카오 사용자',
      provider: 'kakao',
      providerId: String(profile.id),
    };
    done(null, oauthProfile);
  }
}
