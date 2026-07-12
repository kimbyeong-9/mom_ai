import { Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KakaoStrategy } from './strategies/kakao.strategy';

// Only register a provider's OAuth strategy once its credentials are configured,
// since passport-google-oauth20 / passport-kakao throw at construction time
// (crashing app bootstrap) when clientID/clientSecret are empty.
const oauthStrategies: Provider[] = [
  ...(process.env.GOOGLE_CLIENT_ID ? [GoogleStrategy] : []),
  ...(process.env.KAKAO_CLIENT_ID ? [KakaoStrategy] : []),
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ...oauthStrategies],
  exports: [AuthService],
})
export class AuthModule {}
