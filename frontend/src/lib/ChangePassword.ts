import { z } from 'zod';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Informe sua senha atual'),
  newPassword: z
    .string()
    .min(8, 'Mínimo de 8 caracteres')
    .max(12, 'Máximo de 12 caracteres')
    .regex(
      strongPasswordRegex,
      'Precisa de 1 maiúscula, 1 minúscula, 1 número e 1 símbolo',
    ),
});

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordSchema>;
