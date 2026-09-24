import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { loginSchema, type LoginFormValues } from '../lib/schemas';
import { useLogin } from '../hooks/AuthMutation';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { AuthContext } from '../context/Auth/AuthContext';
import { PasswordInput } from '../components/PasswordInput';


export function LoginPage() {
  const navigate = useNavigate();
  const login = useLogin();
  const { loginUsername } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login.mutate(data, {

      onSuccess: (response) => {
        loginUsername('username' in response ? response.username ?? response.username : null)
        navigate('/home')}
    }
  );
  };

  return (
    <AuthLayout
      eyebrow="Bem-vindo de volta"
      title="Entrar"
      subtitle="Acesse sua conta para ver seu feed e continuar publicando."
      footer={
        <>
          Ainda não tem conta?{' '}
          <Link to="/register" className="text-primary hover:opacity-80">
            Criar conta
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <Input
            type="email"
            autoComplete="email"
            label='E-mail'
            error={errors.email?.message}
            placeholder="seu-email@gmail.com"
            {...register('email')}
          />

        </div>

        <div>
          <PasswordInput
            autoComplete="current-password"
            label='Senha'
            error={errors.password?.message}
            placeholder="Sua senha"
            {...register('password')}
          />
          <div className="mt-2 text-right">
            <Link
              to="/forgot-password"
              className=" text-xs text-muted-foreground hover:text-primary"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </div>

        {login.isError && (
  <p className="text-red-400">
    {login.error.response?.data?.message ?? 'Não foi possível entrar. Tente novamente.'}
  </p>
)}

        <Button
        variant='primary'
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-pink-400 disabled:opacity-50"
        >
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  );
}