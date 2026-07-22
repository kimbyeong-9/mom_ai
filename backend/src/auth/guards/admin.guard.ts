import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { Request } from 'express';

import type { CurrentUserPayload } from '../decorators/current-user.decorator';

/** Gates internal-only screens (e.g. the Loop metrics dashboard) to a single
 * founder account — there's no role/admin system in this codebase, so a
 * plain env-var email comparison stands in for one. Must run after
 * JwtAuthGuard, which populates request.user. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: CurrentUserPayload }>();
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail || request.user?.email !== adminEmail) {
      throw new ForbiddenException('접근 권한이 없어요.');
    }
    return true;
  }
}
