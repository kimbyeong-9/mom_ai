import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

import {
  CurrentUser,
  CurrentUserPayload,
} from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import type { OAuthProfile } from './strategies/oauth-profile.type';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback(req, res);
  }

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoAuth() {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(
    @Req() req: Request & { user: OAuthProfile },
    @Res() res: Response,
  ) {
    await this.handleOAuthCallback(req, res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: CurrentUserPayload) {
    return user;
  }

  private async handleOAuthCallback(
    req: Request & { user: OAuthProfile },
    res: Response,
  ) {
    const result = await this.authService.validateOAuthLogin(req.user);
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    res.redirect(`${frontendUrl}/oauth-callback?token=${result.accessToken}`);
  }
}
