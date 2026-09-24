import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { registerSchema, type RegisterFormValues } from '../lib/schemas';
import { useRegister } from '../hooks/AuthMutation';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { PasswordInput } from '../components/PasswordInput';


export function RegisterPage() {
  const navigate = useNavigate();
  const registerUser = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    registerUser.mutate(data, {
      onSuccess: () => navigate('/login'),
    });
  };

  return (
    <AuthLayout
      eyebrow="Comece agora"
      title="Criar conta"
      subtitle="Publique fotos, siga pessoas e construa sua galeria."
      footer={
        <>
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:opacity-80">
            Entrar
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate >
          <Input
            label='Username'
            type="text"
            autoComplete="username"
            error={errors.username?.message}
            placeholder="seu_usuario"
            {...register('username')}
          />
          <Input
            type="text"
            label='Nome'
            autoComplete="name"
            placeholder="seu nome"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            type="email"
            label='E-mail'
            autoComplete="email"
            placeholder="seu-email@exemplo.com"
            {...register('email')}
          />
            <PasswordInput
            label='Senha'
            showRequirements
            error={errors.password?.message}
            autoComplete="new-password"
            placeholder="Sua senha"
            {...register('password')}
          />

        {registerUser.isError && (
  <p className="text-red-400">
    {registerUser.error.response?.data?.message ?? 'Não foi possível entrar. Tente novamente.'}
  </p>
)}
        <Button
        variant='primary'
          type="submit"
          disabled={registerUser.isPending}
          className="w-full rounded-md bg-pink-500 py-2.5 text-sm font-medium text-neutral-950 transition-colors hover:bg-pink-400 disabled:opacity-50"
        >
          {registerUser.isPending ? 'Criando conta…' : 'Criar conta'}
        </Button>
      </form>
    </AuthLayout>
  );
}