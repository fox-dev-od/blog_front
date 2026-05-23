import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { AppButton } from '../../../shared/ui/AppButton';
import { AppTextField } from '../../../shared/ui/AppTextField';
import { useAuthStore } from '../model/authStore';
import { loginSchema } from '../model/schemas';
import { z } from 'zod';

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    await login(values);
    navigate('/dashboard');
  });

  return (
    <Paper sx={{ width: '100%', maxWidth: 420, p: 4, borderRadius: 2 }}>
      <Box component="form" onSubmit={onSubmit}>
        <Stack spacing={2.5}>
          <Stack spacing={0.5}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Sign in
            </Typography>
            <Typography color="text.secondary">
              Use your administrator account to continue.
            </Typography>
          </Stack>
          <AppTextField
            label="Email"
            autoComplete="email"
            {...register('email')}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />
          <AppTextField
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
          />
          <AppButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </AppButton>
        </Stack>
      </Box>
    </Paper>
  );
};
