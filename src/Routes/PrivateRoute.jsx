import React from 'react';
import { useAuth } from '../Providers/AuthProvider';
import { Navigate, useLocation } from 'react-router';

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // show a centered spinner while auth state resolves
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" aria-label="Loading" />
      </div>
    );
  }

  // not logged in → go to login, keep intended route
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // optional role guard: pass e.g. roles={['instructor']}
  if (roles && roles.length) {
    const hasRole = roles.some((r) => user?.role === r);
    if (!hasRole) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PrivateRoute;