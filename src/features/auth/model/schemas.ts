import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Введіть коректний email'),
  password: z.string().min(1, 'Введіть пароль'),
});
