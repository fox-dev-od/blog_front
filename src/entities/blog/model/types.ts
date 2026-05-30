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
  authorId?: {
    _id: string;
    name: string;
    email: string;
  } | string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogBlockLayout =
  | 'image_top_text_bottom'
  | 'image_bottom_text_top'
  | 'image_left_text_right'
  | 'image_right_text_left'
  | 'image_only'
  | 'text_only';

export type BlogPostPayload = {
  title: string;
  slug: string;
  subtitle?: string | null;
  coverImage?: string | null;
  description?: string | null;
  tags?: string[];
  status?: BlogPostStatus;
  blocks?: Array<{
    type?: string;
    heading?: string | null;
    text?: string | null;
    imageUrl?: string | null;
    images?: string[];
    html?: string | null;
    layout: BlogBlockLayout;
    order?: number;
  }>;
};
