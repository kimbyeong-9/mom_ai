import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

/** Gates internal endpoints meant to be called by n8n, not end users — a
 * shared secret header stands in for real auth since there's no user
 * session for a scheduled job to present. */
@Injectable()
export class InternalSecretGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const expected = process.env.INTERNAL_CHECK_SECRET;
    const provided = request.headers['x-internal-secret'];

    if (!expected || provided !== expected) {
      throw new UnauthorizedException('유효하지 않은 내부 요청이에요.');
    }
    return true;
  }
}
