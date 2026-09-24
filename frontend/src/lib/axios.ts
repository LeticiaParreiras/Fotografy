// src/lib/axios.ts
import NiceModal from '@ebay/nice-modal-react';
import axios from 'axios';
import { NoLoggedModal } from '../components/NoLoggedModal';

const API_URL = import.meta.env.VITE_API_URL;

export const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('username');
      NiceModal.show(NoLoggedModal);
      
    }
    return Promise.reject(error);
  },
);