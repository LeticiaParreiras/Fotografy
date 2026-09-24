import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { ImagePlus } from 'lucide-react';
import { ModalShell } from '../components/TemplateModal';
import { createPostSchema, type CreatePostFormValues } from '../lib/postSchemas';
import { Button } from '../shared/Button';
import {  useCreatePost } from '../hooks/postMutation';
 
  // <Button onClick={() => NiceModal.show(CreatePostModal)}>Novo post</Button>

export const CreatePostModal = NiceModal.create(() => {
  const modal = useModal(); // controla visibilidade/resultado deste modal específico
  const mutation = useCreatePost();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  const imageFiles = watch('image');

  function handleImageChange(files: FileList | null) {
    if (files && files[0]) {
      setPreview(URL.createObjectURL(files[0]));
    }
  }

 const onSubmit = (data: CreatePostFormValues) => {
  mutation.mutate(data, {
    onSuccess: () => {
      modal.resolve();
      modal.hide();
    },
  });
};

  return (
    <ModalShell
      title="Novo post"
      visible={modal.visible}
      onClose={() => modal.hide()}
      onExited={() => modal.remove()} // desmonta o componente após a animação de saída
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <label
          htmlFor="image"
          className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-neutral-700 bg-card  transition-colors hover:border-primary"
        >
          {preview ? (
            <img src={preview} alt="Pré-visualização" className="h-full w-full object-cover" />
          ) : (
            <>
              <ImagePlus size={28} />
              <span className="text-xs">Escolher imagem</span>
            </>
          )}
          <input
            id="image"
            type="file"
            accept="image/*"
            className="hidden"
            {...register('image', {
              onChange: (e) => handleImageChange(e.target.files),
            })}
          />
        </label>
        {errors.image && (
          <p className="text-xs text-red-400">{errors.image.message}</p>
        )}

        <div>
          <textarea
            {...register('text')}
            rows={3}
            placeholder="Escreva uma legenda…"
            className="w-full resize-none rounded-md border border-border bg-input px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {errors.text && (
            <p className="mt-1 text-xs text-red-400">{errors.text.message}</p>
          )}
        </div>

        {mutation.isError && (
          <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
            Não foi possível publicar. Tente novamente.
          </p>
        )}

        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant='secondary'
            onClick={() => modal.hide()}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant='primary'
            disabled={mutation.isPending || !imageFiles?.length}
          >
            {mutation.isPending ? 'Publicando…' : 'Publicar'}
          </Button>
        </div>
      </form>
    </ModalShell>
  );
});