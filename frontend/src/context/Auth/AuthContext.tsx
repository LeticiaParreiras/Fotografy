import { createContext } from "react";
interface AuthContextType {
  username: string | null;
  loginUsername: (username: string) => void;
  logoutUsername: () => void;
}
export const AuthContext = createContext<AuthContextType|undefined>(undefined);