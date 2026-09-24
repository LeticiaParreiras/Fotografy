// src/components/RootRedirect.tsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/Auth/AuthContext';

export function RootRedirect() {
  const auth = useContext(AuthContext);

  if (auth?.username) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
}