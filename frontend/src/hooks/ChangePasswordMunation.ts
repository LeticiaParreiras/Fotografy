import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosClient } from '../lib/axios';
import type { ChangePasswordFormValues } from '../lib/ChangePassword';


async function changePassword(data: ChangePasswordFormValues): Promise<void> {
  await axiosClient.patch('/auth/change-password', data);
}

export function useChangePassword() {
  return useMutation<void, AxiosError,ChangePasswordFormValues>({
    mutationFn: changePassword,
  });
}