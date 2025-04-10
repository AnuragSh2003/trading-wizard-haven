import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface User {
  id: string;
  name: string;
  email: string;
  isZerodhaLinked?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  getToken: () => string | null;
  linkZerodha: () => void;
  unlinkZerodha: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
  getToken: () => null,
  linkZerodha: () => {},
  unlinkZerodha: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        console.log('Stored user:', userStr);
        console.log('Stored token:', token);
        
        if (userStr && token) {
          const user = JSON.parse(userStr);
          setUser(user);
          console.log('Loaded user:', user);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleZerodhaReturn = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const requestToken = params.get('request_token');
    const status = params.get('status');
    
    console.log('Zerodha callback params:', { requestToken, status });

    if (status === 'success' && requestToken) {
      try {
        const response = await api.post<ApiResponse<{ sessionToken: string }>>('/zerodha/generate-session', { requestToken });
        
        if (response.success) {
          toast({
            title: "Success",
            description: "Successfully connected to Zerodha",
          });
          
          // Update user state to reflect Zerodha connection
          if (user) {
            const updatedUser = { ...user, isZerodhaLinked: true };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          
          // Store the Zerodha session token
          if (response.data?.sessionToken) {
            localStorage.setItem('zerodhaSessionToken', response.data.sessionToken);
          }
          
          // Get the stored redirect URL or default to dashboard
          const redirectUrl = localStorage.getItem('zerodhaRedirectUrl') || '/dashboard';
          localStorage.removeItem('zerodhaRedirectUrl'); // Clean up
          
          // Redirect back to the original page
          window.location.href = redirectUrl;
        } else {
          throw new Error(response.message || 'Failed to generate session');
        }
      } catch (error: any) {
        console.error('Error linking Zerodha account:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to connect to Zerodha",
          variant: "destructive",
        });
      }
    } else if (status === 'error') {
      toast({
        title: "Error",
        description: "Failed to connect to Zerodha. Please try again.",
        variant: "destructive",
      });
    }
  }, [user]);

  useEffect(() => {
    // Only handle Zerodha return if we have a request_token in the URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('request_token')) {
      handleZerodhaReturn();
    }
  }, [handleZerodhaReturn]);

  const linkZerodha = async () => {
    try {
      const response = await api.get<ApiResponse<{ loginUrl: string }>>('/zerodha/login-url');
      if (response.success && response.data?.loginUrl) {
        console.log('Redirecting to Zerodha login:', response.data.loginUrl);
        // Store the current URL as the redirect URL in localStorage
        localStorage.setItem('zerodhaRedirectUrl', window.location.href);
        window.location.href = response.data.loginUrl;
      } else {
        throw new Error('Invalid login URL response');
      }
    } catch (error: any) {
      console.error('Error getting Zerodha login URL:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get Zerodha login URL",
        variant: "destructive",
      });
    }
  };

  const unlinkZerodha = () => {
    if (user) {
      const updatedUser = { ...user, isZerodhaLinked: false };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast({
        title: "Success",
        description: "Successfully disconnected from Zerodha",
      });
    }
  };

  const login = (token: string, user: User) => {
    console.log('Logging in with token:', token);
    console.log('Logging in user:', user);
    
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    console.log('Logging out');
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/sign-in';
  };

  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        getToken,
        linkZerodha,
        unlinkZerodha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
