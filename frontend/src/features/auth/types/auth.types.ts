export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

export type AuthUserProfile = AuthUser & {
  createdAt: string;
};

export type AuthResult = {
  accessToken: string;
  user: AuthUser;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
};
