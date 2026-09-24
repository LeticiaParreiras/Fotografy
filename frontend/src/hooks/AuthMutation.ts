import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { LoginFormValues, RegisterFormValues } from "../lib/schemas";
import type ApiErrorResponse from "../lib/apiSchema";
import { axiosClient } from "../lib/axios";

interface AuthResponse {
  message: string;
}

type AuthData = LoginFormValues | RegisterFormValues;

async function authApi(type: "register" | "login", data: AuthData) {
  const response = await axiosClient.post<AuthResponse>(`/auth/${type}`, data, {
    withCredentials: true,
  });

  return response.data;
}

export function useLogin() {
  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    LoginFormValues
  >({
    mutationFn: (data) => authApi("login", data),
  });
}

export function useRegister() {
  return useMutation<
    AuthResponse,
    AxiosError<ApiErrorResponse>,
    RegisterFormValues
  >({
    mutationFn: (data: RegisterFormValues) => authApi("register", data),
  });
}
export function useLogout() {
  return useMutation<AuthResponse, AxiosError<ApiErrorResponse>, void>({
    mutationFn: async () => {
      const response = await axiosClient.delete<AuthResponse>("/auth/logout");
      return response.data;
    },
  });
}
