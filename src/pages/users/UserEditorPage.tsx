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
    formState: { isSubmitting, errors },
  } = useForm<UserFormValues>({ defaultValues: toDefaultValues() });

  useEffect(() => {
    if (id) {
      void loadUser(id, setItem, reset, setLoading);
    } else {
      setItem(null);
      reset(toDefaultValues(null));
      setLoading(false);
    }
  }, [id, reset]);

  const submit = handleSubmit(async (values) => {
    if (id) {
      await usersApi.update(id, {
        email: values.email,
        name: values.name,
        role: values.role,
        isActive: values.isActive,
        ...(values.password ? { password: values.password } : {}),
      });
    } else {
      await usersApi.create({
        email: values.email,
        name: values.name,
        password: values.password || undefined,
        role: values.role,
        isActive: values.isActive,
      });
    }
    navigate('/dashboard/users');
  });

  return (
    <>
      <PageHeader
        title={
          id
            ? item
              ? `Редагувати ${item.email}`
              : 'Редагувати користувача'
            : 'Створити користувача'
        }
      />
      {loading ? (
        <Loader />
      ) : (
        <Paper component="form" onSubmit={submit} sx={{ p: 3, borderRadius: 2 }}>
          <Stack spacing={2}>
            <AppTextField
              label="Email"
              type="email"
              {...register('email', { required: 'Email обовʼязковий' })}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <AppTextField
              label="Імʼя користувача"
              {...register('name', { required: 'Імʼя користувача обовʼязкове' })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <AppTextField
              label={id ? 'Новий пароль (необовʼязково)' : 'Пароль'}
              type="password"
              {...register('password', {
                required: id ? false : 'Пароль обовʼязковий',
                minLength: { value: 6, message: 'Мінімум 6 символів' },
              })}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <AppTextField select label="Роль" {...register('role', { required: 'Роль обовʼязкова' })}>
              <MenuItem value="admin">Адміністратор</MenuItem>
              <MenuItem value="author">Автор</MenuItem>
              <MenuItem value="user">Користувач</MenuItem>
            </AppTextField>
            <FormControlLabel control={<Checkbox {...register('isActive')} />} label="Активний" />
            <AppButton type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? 'Збереження...'
                : id
                ? 'Зберегти користувача'
                : 'Створити користувача'}
            </AppButton>
          </Stack>
        </Paper>
      )}
    </>
  );
};
