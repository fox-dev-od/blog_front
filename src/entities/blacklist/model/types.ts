export type BlacklistEntryType = 'ip' | 'user';

export type BlacklistEntry = {
  _id: string;
  type: BlacklistEntryType;
  ip?: string | null;
  userId?: string | null;
  reason?: string | null;
  expiresAt?: string | null;
  isActive: boolean;
};

export type BlacklistPayload = Omit<BlacklistEntry, '_id'>;
