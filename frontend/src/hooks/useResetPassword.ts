import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosClient } from '../lib/axios';
import type {
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  VerifyTokenForgotPasswordFormValues,
} from '../lib/PasswordResetSchemas';


async function requestPasswordReset(data: ForgotPasswordFormValues): Promise<void> {
  await axiosClient.patch('/auth/change-password', data);
}

export function useForgotPassword() {
  return useMutation<void, AxiosError, ForgotPasswordFormValues>({
    mutationFn: requestPasswordReset,
  });
}

interface ResetPasswordPayload extends ResetPasswordFormValues {
  token: string
  email: string;
}

interface VerifyTokenPayload extends VerifyTokenForgotPasswordFormValues {
  email: string;
}


async function resetPassword(data: ResetPasswordPayload): Promise<void> {
  const { ...payload } = data;
  await axiosClient.patch('/auth/forgot-password', payload);
}

export function useResetPassword() {
  return useMutation<void, AxiosError, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });

}
async function verifyToken(data: VerifyTokenPayload): Promise<void> {
    console.log(data)
  await axiosClient.post('/auth/forgot-password/verify',  data );
}

export function useVerifyToken() {
  return useMutation<void, AxiosError, VerifyTokenPayload>({
    mutationFn: verifyToken,
  });
}