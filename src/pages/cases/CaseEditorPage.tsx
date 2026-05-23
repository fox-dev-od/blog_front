import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { caseCategoriesApi } from '../../entities/case-category/api/caseCategoriesApi';
import { CaseCategory } from '../../entities/case-category/model/types';
import { casesApi } from '../../entities/case/api/casesApi';
import { CaseItem, CasePayload } from '../../entities/case/model/types';
import { CaseForm } from '../../features/case-editor/ui/CaseForm';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

const loadEditorData = async (
  id: string | undefined,
  isCreate: boolean,
  setItem: (item: CaseItem | null) => void,
  setCategories: (items: CaseCategory[]) => void,
  setLoading: (value: boolean) => void,
) => {
  setLoading(true);
  try {
    const [categories, item] = await Promise.all([
      caseCategoriesApi.getAll(),
      !isCreate && id ? casesApi.getById(id) : Promise.resolve(null),
    ]);
    setCategories(categories);
    setItem(item);
  } finally {
    setLoading(false);
  }
};

export const CaseEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isCreate = !id || id === 'create';
  const [item, setItem] = useState<CaseItem | null>(null);
  const [categories, setCategories] = useState<CaseCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadEditorData(id, isCreate, setItem, setCategories, setLoading);
  }, [id, isCreate]);

  const handleSubmit = async (payload: CasePayload) => {
    if (isCreate) {
      await casesApi.create(payload);
    } else if (id) {
      await casesApi.update(id, payload);
    }
    navigate('/dashboard/cases');
  };

  return (
    <>
      <PageHeader title={isCreate ? 'Create case' : 'Edit case'} />
      {loading ? <Loader /> : <CaseForm initialValue={item} categories={categories} onSubmit={handleSubmit} />}
    </>
  );
};
