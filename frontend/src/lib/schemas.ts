import { z } from 'zod';

// Mesma regra do backend: 8+ caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 símbolo
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  password: z.string().min(1, 'Informe sua senha'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, 'Mínimo de 4 caracteres')
      .max(10, 'Máximo de 10 caracteres')
      .regex(/^[a-zA-Z0-9_]+$/, 'Use apenas letras, números e _'),
    name: z
    .string() 
     .min(3, 'Mínimo de 3 caracteres')
      .max(20, 'Máximo de 20 caracteres'),
    email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
    password: z
      .string()
      .min(8, 'Mínimo de 8 caracteres')
      .max(12, 'Máximo de 12 caracteres')
      .regex(
        strongPasswordRegex,
        'Precisa de 1 maiúscula, 1 minúscula, 1 número e 1 símbolo',
      ),

  })

export type RegisterFormValues = z.infer<typeof registerSchema>;