import { BlogContentBlock } from '../../blog/model/types';

export type CaseInfoItem = {
  label: string;
  value: string;
  icon?: string | null;
  order?: number;
};

export type CaseTab = {
  title: string;
  slug: string;
  order?: number;
  isActive?: boolean;
  blocks: BlogContentBlock[];
};

export type CaseItem = {
  _id: string;
  title: string;
  slug: string;
  categoryId: string;
  subtitle?: string | null;
  description?: string | null;
  coverImage?: string | null;
  info: CaseInfoItem[];
  tabs: CaseTab[];
  order: number;
  isActive: boolean;
};

export type CasePayload = Omit<CaseItem, '_id'>;
