import { z } from 'zod';

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const verifyTokenForgotPasswordSchema = z.object({
  token: z.string().length(4, 'O código precisa ter 4 caracteres'),
});

export type VerifyTokenForgotPasswordFormValues = z.infer<
  typeof verifyTokenForgotPasswordSchema
>;

export const resetPasswordSchema = z
  .object({
   
    password: z
      .string()
      .min(8, 'Mínimo de 8 caracteres')
      .max(12, 'Máximo de 12 caracteres')
      .regex(
        strongPasswordRegex,
        'Precisa de 1 maiúscula, 1 minúscula, 1 número e 1 símbolo',
      ),

  })

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;