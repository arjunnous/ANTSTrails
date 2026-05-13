import { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import api from '../api';

type UserRole = 'admin' | 'learner' | string;

interface UserState {
  token: string;
  role: UserRole;
  id: number;
  full_name: string;
}

interface AuthContextType {
  user: UserState | null;
  login: (email: string, password: string) => Promise<any>;
  register: (full_name: string, email: string, password: string) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('user_id');

    const full_name = localStorage.getItem('full_name') ?? '';
    if (token && role && storedUserId) {
      setUser({ token, role, id: Number(storedUserId), full_name });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('role', res.data.role);
    localStorage.setItem('user_id', String(res.data.user_id));
    localStorage.setItem('full_name', res.data.full_name ?? '');
    const userState = { token: res.data.access_token, role: res.data.role, id: res.data.user_id, full_name: res.data.full_name ?? '' };
    setUser(userState);
    return res.data;
  };

  const register = async (full_name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { full_name, email, password });
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('role', res.data.role);
    localStorage.setItem('user_id', String(res.data.user_id));
    localStorage.setItem('full_name', res.data.full_name ?? '');
    const userState = { token: res.data.access_token, role: res.data.role, id: res.data.user_id, full_name: res.data.full_name ?? '' };
    setUser(userState);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('full_name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext) as AuthContextType;