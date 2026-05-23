import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { blogApi } from '../../entities/blog/api/blogApi';
import { BlogPost, BlogPostPayload } from '../../entities/blog/model/types';
import { BlogPostForm } from '../../features/blog-post-editor/ui/BlogPostForm';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadPost = async (id: string, setItem: (item: BlogPost) => void, setLoading: (value: boolean) => void) => {
  setLoading(true);
  try {
    setItem(await blogApi.getById(id));
  } finally {
    setLoading(false);
  }
};

export const BlogPostEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(Boolean(id && id !== 'create'));
  const isCreate = !id || id === 'create';

  useEffect(() => {
    if (!isCreate && id) {
      void loadPost(id, setItem, setLoading);
    }
  }, [id, isCreate]);

  const handleSubmit = async (payload: BlogPostPayload) => {
    if (isCreate) {
      await blogApi.create(payload);
    } else if (id) {
      await blogApi.update(id, payload);
    }
    navigate('/dashboard/blog');
  };

  return (
    <>
      <PageHeader title={isCreate ? 'Створити статтю' : 'Редагувати статтю'} />
      {loading ? <Loader /> : <BlogPostForm initialValue={item} onSubmit={handleSubmit} />}
    </>
  );
};
