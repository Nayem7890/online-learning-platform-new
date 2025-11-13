import React from 'react';
import { useAuth } from '../Providers/AuthProvider';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" aria-label="Loading" />
      </div>
    );
  }

  
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  
  if (roles && roles.length) {
    const hasRole = roles.some((r) => user?.role === r);
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;