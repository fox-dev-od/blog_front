export type BlogPostStatus = 'draft' | 'pending' | 'published';

export type BlogContentBlock = {
  type?: 'text' | 'gallery' | 'text-images';
  heading?: string | null;
  text?: string | null;
  html?: string | null;
  images?: string[];
  imageUrl?: string | null;
  layout: string;
  order?: number;
};

export type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  coverImage?: string | null;
  tags: string[];
  status: BlogPostStatus;
  blocks: BlogContentBlock[];
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPostPayload = Omit<BlogPost, '_id' | 'createdAt' | 'updatedAt'>;
