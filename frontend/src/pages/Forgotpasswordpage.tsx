import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../shared/Input';
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyTokenForgotPasswordSchema,
  type ForgotPasswordFormValues,
  type ResetPasswordFormValues,
  type VerifyTokenForgotPasswordFormValues,
} from '../lib/PasswordResetSchemas';
import { useForgotPassword, useResetPassword, useVerifyToken } from '../hooks/useResetPassword';
import { Button } from '../shared/Button';
import { PasswordInput } from '../components/PasswordInput';

type Step = 'request' | 'verify' | 'reset';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('')

  const forgotPassword = useForgotPassword();
  const resetPassword = useResetPassword();
  const verifyTokenMutation = useVerifyToken();

  // Etapa 1 — pedir o e-mail
  const requestForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onRequestSubmit = (data: ForgotPasswordFormValues) => {
    forgotPassword.mutate(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('verify');
      },
    });
  };
  // Etapa 2 - Verificar Token

  const verifyForm = useForm<VerifyTokenForgotPasswordFormValues>({
    resolver: zodResolver(verifyTokenForgotPasswordSchema),
  });

  const onVerifySubmit = (data: VerifyTokenForgotPasswordFormValues) => {
    verifyTokenMutation.mutate({ ...data, email }, {
      onSuccess: () => {
        setToken(data.token);
        setStep('reset');
      },
      onError: (e)=>{
        console.log(e.message)
      }
    });
  };

  // Etapa 3 — nova senha
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });


  const onResetSubmit = (data: ResetPasswordFormValues) => {
    resetPassword.mutate(
      { ...data, email, token },
      {
        onSuccess: () => navigate('/login'),
      },
    );
  };

  // ---------- Etapa 2 : Verificar token ----------
  if (step === 'verify') {
    return (
      <AuthLayout
        eyebrow="Verifique seu e-mail"
        title="Enviamos um código"
        subtitle={`Mandamos um código de recuperação para ${email}.`}
        footer={
          <>
            Não recebeu?{' '}
            <Button
              variant='ghost'
              onClick={() => setStep('request')}
              className="text-primary hover:opacity-80"
            >
              Tentar outro e-mail
            </Button>
          </>
        }
      >
        <form
          onSubmit={verifyForm.handleSubmit(onVerifySubmit)}
          noValidate
          className="flex flex-col items-center gap-4 rounded-md border border-border bg-card px-4 py-8 text-center"
        >
          <MailCheck size={32} className="text-primary" />
          <p className="text-sm text-muted-foreground">
            Confira sua caixa de entrada (e o spam) e cole o código abaixo para
            continuar.
          </p>
            <Input
            label="Código"
            type="text"
            autoComplete="one-time-code"
            placeholder="Cole o código do e-mail"
            error={verifyForm.formState.errors.token?.message}
            {...verifyForm.register('token')}
          />
          <Button variant="primary" type="submit" disabled={verifyTokenMutation.isPending}>
            {verifyTokenMutation.isPending ? 'Verificando…' : 'Verificar código'}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // ---------- Etapa: nova senha ----------
  if (step === 'reset') {
    return (
      <AuthLayout
        eyebrow="Última etapa"
        title="Redefinir senha"
        subtitle="Digite sua nova senha."
        footer={
          <Link to="/login" className="text-primary hover:opacity-80">
            Voltar para o login
          </Link>
        }
      >
        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          noValidate
          className="space-y-5"
        >
          

          <PasswordInput
            label="Nova senha"
            autoComplete="new-password"
            placeholder="Nova senha"
            showRequirements
            error={resetForm.formState.errors.password?.message}
            {...resetForm.register('password')}
          />
          <Button
          variant='primary'
            type="submit"
            disabled={resetPassword.isPending}
            className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {resetPassword.isPending ? 'Salvando…' : 'Redefinir senha'}
          </Button>
        </form>
      </AuthLayout>
    );
  }

  // ---------- Etapa: pedir e-mail (padrão) ----------
  return (
    <AuthLayout
      eyebrow="Esqueceu a senha?"
      title="Recuperar acesso"
      subtitle="Informe seu e-mail e enviaremos um código de recuperação."
      footer={
        <>
          Lembrou a senha?{' '}
          <Link to="/login" className="text-primary hover:opacity-80">
            Voltar para o login
          </Link>
        </>
      }
    >
      <form
        onSubmit={requestForm.handleSubmit(onRequestSubmit)}
        noValidate
        className="space-y-5"
      >
        <Input
          label="E-mail"
          type="email"
          autoComplete="email"
          placeholder="voce@exemplo.com"
          error={requestForm.formState.errors.email?.message}
          {...requestForm.register('email')}
        />

        <Button
        variant='primary'
          type="submit"
          disabled={forgotPassword.isPending}
          className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {forgotPassword.isPending ? 'Enviando…' : 'Enviar código'}
        </Button>
      </form>
    </AuthLayout>
  );
}