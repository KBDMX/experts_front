'use client';
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getMe, logout, initiate2FA, verify2FA } from '@/api/usuarios/auth.api';
import { dispatchMenssage } from '@/app/utils/menssageDispatcher';

interface User {
  id: string;
  rol: string;
}

interface TwoFactorResponse {
  tempToken: string;
  expiresAt: Date;
}

interface VerifyTwoFactorResponse {
  ok: boolean;
  isValid: boolean;
  shouldRetry: boolean;
  remainingAttempts: number;
  message: string;
}

interface AuthContextProps {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  rol: string | null;
  setRol: (rol: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  checkToken: () => Promise<boolean>;
  handleLogin: (username: string, password: string, recordar: boolean) => Promise<TwoFactorResponse | null>;
  handleVerify2FA: (code: string, tempToken: string, recordar: boolean) => Promise<VerifyTwoFactorResponse>;
  handleLogout: () => Promise<void>;
  isChecking: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [rol, setRol] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkToken = async () => {
    if (isChecking) return false;
    setIsChecking(true);
    try {
      const response = await getMe();
      if (response.ok && response.user) {
        setUser(response.user);
        setIsLoggedIn(true);
        setRol(response.user.rol);
        return true;
      } else {
        setUser(null);
        setIsLoggedIn(false);
        setRol(null);
        return false;
      }
    } catch (error: any) {
      console.error('Error al verificar el token:', error);
      setUser(null);
      setIsLoggedIn(false);
      setRol(null);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (
    username: string, 
    password: string, 
    recordar: boolean
  ): Promise<TwoFactorResponse | null> => {
    try {
      const response = await initiate2FA(username, password, recordar);
      if (response.ok) {
        return {
          tempToken: response.tempToken,
          expiresAt: new Date(response.expiresAt)
        };
      } else {
        dispatchMenssage('fail', 'Credenciales inválidas');
        return null;
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      dispatchMenssage('fail', 'Error al iniciar sesión');
      return null;
    }
  };

  const handleVerify2FA = async (
    code: string,
    tempToken: string,
    recordar: boolean
  ): Promise<VerifyTwoFactorResponse> => {
    try {
      const response = await verify2FA(code, tempToken, recordar);
      
      if (response.ok) {
        await checkToken(); // Verifica y actualiza el estado con la información del usuario
        if (user) {
          dispatchMenssage('info', `Has ingresado con rol: ${user.rol}`);
        }
      }

      return response;
    } catch (error: any) {
      console.error('Error en la verificación 2FA:', error);
      return {
        ok: false,
        isValid: false,
        shouldRetry: true,
        remainingAttempts: 0,
        message: 'Error en la verificación'
      };
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setRol(null);
      dispatchMenssage('info', 'Se ha cerrado la sesión');
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        rol,
        setRol,
        user,
        setUser,
        checkToken,
        handleLogin,
        handleVerify2FA,
        handleLogout,
        isChecking,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};