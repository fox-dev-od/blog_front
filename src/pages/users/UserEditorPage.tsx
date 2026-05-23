import { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { usersApi } from '../../entities/user/api/usersApi';
import { User, UserRole } from '../../entities/user/model/types';
import { AppButton } from '../../shared/ui/AppButton';
import { AppTextField } from '../../shared/ui/AppTextField';
import { Loader } from '../../shared/ui/Loader';
import { PageHeader } from '../../shared/ui/PageHeader';

type UserFormValues = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  isActive: boolean;
};

const toDefaultValues = (user?: User | null): UserFormValues => ({
  email: user?.email ?? '',
  name: user?.name ?? '',
  password: '',
  role: user?.role ?? 'user',
  isActive: user?.isActive ?? true,
});

const loadUser = async (
  id: string,
  setItem: (item: User) => void,
  reset: (values: UserFormValues) => void,
  setLoading: (value: boolean) => void,
) => {
  setLoading(true);
  try {
    const user = await usersApi.getById(id);
    setItem(user);
    reset(toDefaultValues(user));
  } finally {
    setLoading(false);
  }
};

export const UserEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<UserFormValues>({ defaultValues: toDefaultValues() });

  useEffect(() => {
    if (id) {
      void loadUser(id, setItem, reset, setLoading);
    }
  }, [id, reset]);

  const submit = handleSubmit(async (values) => {
    if (!id) {
      return;
    }

    await usersApi.update(id, {
      email: values.email,
      name: values.name,
      role: values.role,
      isActive: values.isActive,
      ...(values.password ? { password: values.password } : {}),
    });
    navigate('/dashboard/users');
  });

  return (
    <>
      <PageHeader title={item ? `Редагувати ${item.email}` : 'Редагувати користувача'} />
      {loading ? (
        <Loader />
      ) : (
        <Paper component="form" onSubmit={submit} sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <AppTextField label="Email" type="email" {...register('email')} />
            <AppTextField label="Імʼя користувача" {...register('name')} />
            <AppTextField label="Новий пароль" type="password" {...register('password')} />
            <AppTextField select label="Роль" {...register('role')}>
              <MenuItem value="admin">Адміністратор</MenuItem>
              <MenuItem value="author">Автор</MenuItem>
              <MenuItem value="user">Користувач</MenuItem>
            </AppTextField>
            <FormControlLabel control={<Checkbox {...register('isActive')} />} label="Активний" />
            <AppButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Збереження...' : 'Зберегти користувача'}
            </AppButton>
          </Stack>
        </Paper>
      )}
    </>
  );
};
