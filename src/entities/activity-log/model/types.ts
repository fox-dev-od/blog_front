export type ActivityLog = {
  _id: string;
  action: string;
  entity?: string | null;
  userId?: string | null;
  userEmail?: string | null;
  method: string;
  url: string;
  ip?: string | null;
  userAgent?: string | null;
  statusCode?: number;
  success: boolean;
  errorMessage?: string | null;
  createdAt: string;
};
