import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import useToken from '../redux/Auth/useToken';
import { authenticatedUser } from '../redux/Auth/authSlice';

const AdminRoute = () => {
  const isTokenSet = useToken();
  const { role } = useSelector(authenticatedUser);
  return isTokenSet && role === 1 ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
