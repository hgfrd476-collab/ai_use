import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { useApp } from './AppContext';

export interface AuthContextType {
  user: User;
  role: UserRole;
  isAuthenticated: boolean;
  login: (role?: UserRole, email?: string, password?: string) => string;
  logout: () => void;
  switchRole: (role: UserRole) => string;
  getRoleDashboardPath: (role: UserRole) => string;
}

export const getRoleDashboardPath = (role: UserRole): string => {
  if (role === 'SUPER_ADMIN') return '/admin/dashboard';
  if (role === 'BUSINESS_OWNER') return '/owner/dashboard';
  return '/customer/dashboard';
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, currentRole, setCurrentRole, addToast } = useApp();

  const login = (targetRole: UserRole = 'CUSTOMER', _email?: string, _password?: string): string => {
    setCurrentRole(targetRole);
    const dest = getRoleDashboardPath(targetRole);
    addToast('Signed In Successfully', `Welcome back, ${targetRole === 'SUPER_ADMIN' ? 'Super Admin' : targetRole === 'BUSINESS_OWNER' ? 'Partner Host' : 'Traveler'}!`, 'success');
    return dest;
  };

  const logout = () => {
    setCurrentRole('CUSTOMER');
    addToast('Signed Out', 'You have been signed out to the public marketplace.', 'info');
  };

  const switchRole = (newRole: UserRole): string => {
    setCurrentRole(newRole);
    const dest = getRoleDashboardPath(newRole);
    addToast('Persona Switched', `Active role is now ${newRole.replace('_', ' ')}`, 'info');
    return dest;
  };

  const value: AuthContextType = {
    user: currentUser,
    role: currentRole,
    isAuthenticated: true, // Mock authenticated user
    login,
    logout,
    switchRole,
    getRoleDashboardPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
