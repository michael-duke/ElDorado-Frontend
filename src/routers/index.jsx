import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Home from '../pages/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CarDetails from '../pages/CarDetails';
import BookingPage from '../pages/BookingPage';
import ReservationPage from '../pages/ReservationPage';
import AddCarPage from '../pages/AddCarPage';
import DeleteCarPage from '../pages/DeleteCarPage';
import { getAvailableCars } from '../redux/Home/home';
import ProtectedRoute from '../components/ProtectedRoute';
import useToken from '../redux/Auth/useToken';
import { getAuthenticatedUser } from '../redux/Auth/authSlice';

const AppRouter = () => {
  const [open, setOpen] = useState(true);
  const isTokenSet = useToken();
  const handleOpen = (flag) => {
    if (flag === true || flag === false) setOpen(flag);
    else setOpen(!open);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAvailableCars());
  }, []);

  useEffect(() => {
    if (isTokenSet) dispatch(getAuthenticatedUser());
  }, [isTokenSet]);

  return (
    <div className="flex w-full">
      <NavBar open={open} handleOpen={handleOpen} />
      <div className="mb-2 p-7 px-2 flex-1 h-screen overflow-y-scroll">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="car-details/:id" element={<CarDetails open={open} />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/reservation" element={<ReservationPage />} />
            <Route path="/add_car" element={<AddCarPage />} />
            <Route path="/delete_car" element={<DeleteCarPage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </div>
  );
};
export default AppRouter;
