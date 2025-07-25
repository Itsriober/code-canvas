import { createContext, useContext, useState, useEffect } from 'react';
import axios, { initializeCsrf } from '../utils/axios';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  initializing: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeCsrf();
        
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          try {
            await fetchUser();
          } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('token');
            setToken(null);
            delete axios.defaults.headers.common['Authorization'];
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setInitializing(false);
      }
    };
    
    initialize();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      await logout();
    }
  };

  const login = async (email: string, password: string) => {
    await initializeCsrf();
    const response = await axios.post('/api/login', { email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const register = async (name: string, email: string, password: string) => {
    await initializeCsrf();
    const response = await axios.post('/api/register', { name, email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = async () => {
    try {
      await axios.post('/api/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    }
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
