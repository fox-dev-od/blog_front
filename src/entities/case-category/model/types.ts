export type CaseCategory = {
  _id: string;
  title: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  order: number;
  isActive: boolean;
};

export type CaseCategoryPayload = Omit<CaseCategory, '_id'>;
