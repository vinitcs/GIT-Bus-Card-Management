import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';


export const StudentProtectedRoute = () => {
  const isLoggedIn = useSelector((state) => state.studentAuth.isLoggedIn);
  return isLoggedIn ? <Outlet /> : <Navigate to="/" />;
};
