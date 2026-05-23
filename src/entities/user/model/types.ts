export type UserRole = 'admin' | 'author' | 'user';

export type User = {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type UserUpdatePayload = Partial<{
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}>;
