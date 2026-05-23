export type UserRole = 'admin' | 'author' | 'user';

export type CurrentUser = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: CurrentUser;
  accessToken: string;
  refreshToken?: string;
};
