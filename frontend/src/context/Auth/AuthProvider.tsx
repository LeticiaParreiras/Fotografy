import { useEffect, useState, type PropsWithChildren } from 'react';
import { AuthContext } from './AuthContext';
import { axiosClient } from '../../lib/axios';
import { useLocation } from 'react-router-dom';

// Url que o não precisa do provider
const UrlNoProvider = ['/login', '/register', '/forgot-password']

export const AuthProvider = ({ children }:PropsWithChildren) => {
  const [username, setUsername] = useState<string | null>(null);
   const location = useLocation().pathname;

  useEffect(() => {
    const loadUsername = async () => {
   try {
        const response = await axiosClient.get('/user', {
          withCredentials: true,
        });

        if (response.data?.username) {
          setUsername(response.data.username);
          localStorage.setItem('username', response.data.username);
          return;
        }

        setUsername(null);
        localStorage.removeItem('username');
      } catch {
        setUsername(null);
        localStorage.removeItem('username');
      }
    };
    // se a location estive dentro do array não não tenta carregar username
   if(UrlNoProvider.includes(location)){
    return
   }

    loadUsername();
  }, [location]);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      localStorage.removeItem('username');
    }
  }, [username]);

  const loginUsername = (userData:string) => setUsername(userData);
  const logoutUsername = () => {
    setUsername(null)
     localStorage.removeItem('username')};

  return (
    <AuthContext.Provider value={{ username, loginUsername, logoutUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
