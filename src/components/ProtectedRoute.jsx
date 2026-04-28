import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import useToken from '../redux/Auth/useToken';

const ProtectedRoute = () => {
  const isTokenSet = useToken();
  return isTokenSet ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ProtectedRoute;
