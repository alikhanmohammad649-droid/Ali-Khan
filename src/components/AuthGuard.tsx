import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../lib/AppContext';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useApp();
  const location = useLocation();

  // Show a loading backdrop during authorization checks for premium feel
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-medium text-gray-500 font-sans tracking-wide">Syncing secure gateway sessions...</p>
        </div>
      </div>
    );
  }

  // Not authenticated? Divert to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Admin routing check
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
