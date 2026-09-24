import { Button } from '../shared/Button';
import { PasswordInput } from './PasswordInput';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChangePasswordSchema, type ChangePasswordFormValues } from '../lib/ChangePassword'; // ajuste o path real
import { useChangePassword } from '../hooks/ChangePasswordMunation'; // hook de mutation

export default function FormChangePassword() {
  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: ""
    }
  });

  const changePassword = useChangePassword();

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePassword.mutate(data,{onSuccess: ()=>{
        reset()
    }})
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Trocar senha</h2>

      <PasswordInput
        label="Sua senha atual"
        error={errors.currentPassword?.message}
        {...register('currentPassword')}
      />

      <PasswordInput
        label="Nova senha"
        showRequirements
        error={errors.newPassword?.message}
        {...register('newPassword')}
      />

      {changePassword.isError && (
        <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-400">
          Não foi possível trocar a senha. Confira a senha atual.
        </p>
      )}
      {changePassword.isSuccess && (
        <p className="rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-xs text-green-400">
          Senha alterada com sucesso
        </p>
      )}

      <Button variant="primary" type="submit" disabled={changePassword.isPending}>
        {changePassword.isPending ? 'Salvando…' : 'Enviar'}
      </Button>
    </form>
  );
}