import { z } from 'zod';

export const createPostSchema = z.object({
  text: z.string().max(200, 'Máximo de 200 caracteres').optional(),
  image: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, 'Selecione uma imagem'),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;