import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import type { AuthProvider } from '../entities/user.entity';

export type CurrentUserPayload = {
  id: string;
  email: string | null;
  name: string;
  provider: AuthProvider;
  createdAt: Date;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: CurrentUserPayload }>();
    return request.user;
  },
);
