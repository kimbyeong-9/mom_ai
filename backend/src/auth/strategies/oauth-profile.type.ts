import type { AuthProvider } from '../entities/user.entity';

export type OAuthProfile = {
  email: string;
  name: string;
  provider: AuthProvider;
  providerId: string;
};
