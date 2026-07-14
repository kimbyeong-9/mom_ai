import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Like JwtAuthGuard, but a missing/invalid token means "anonymous" (user:
// null) instead of a 401 — for endpoints usable both signed-in and signed-out.
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = unknown>(_err: unknown, user: TUser): TUser | null {
    return user || null;
  }
}
