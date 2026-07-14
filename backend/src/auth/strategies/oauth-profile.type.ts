import type { AuthProvider } from '../entities/user.entity';

export type OAuthProfile = {
  email: string | null;
  name: string;
  provider: AuthProvider;
  providerId: string;
};
