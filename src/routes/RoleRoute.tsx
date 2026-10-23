import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../types';
import { useAuth, getRoleDashboardPath } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { role } = useAuth();
  const { addToast } = useApp();

  // Super Admin has universal access
  const isAllowed = role === 'SUPER_ADMIN' || allowedRoles.includes(role);

  if (!isAllowed) {
    const targetPath = getRoleDashboardPath(role);
    addToast(
      'Access Restricted',
      `Your current role (${role.replace('_', ' ')}) is not authorized to view that area. Redirecting to your dashboard.`,
      'warning'
    );
    return <Navigate to={targetPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
