import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert as MaterialAlert } from '@material-tailwind/react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setStatusIdle as setReservationStatus } from '../redux/Reservations/reservationsSlice';
import { setStatusIdle as setAuthStatus } from '../redux/Auth/authSlice';
import { setStatusIdle as setHomeStatus } from '../redux/Home/home';

const Alert = ({ message }) => {
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const setReservationStatusIdle = () => {
    if (pathname === '/booking') dispatch(setReservationStatus());
  };

  const setAuthStatusIdle = () => {
    if (pathname === '/login') dispatch(setAuthStatus());
  };

  const setCarStatusIdle = () => {
    if (pathname === '/add_car') dispatch(setHomeStatus());
  };

  setTimeout(() => {
    setShow(false);
    setReservationStatusIdle();
    setAuthStatusIdle();
    setCarStatusIdle();
  }, 5000);

  const filterMessage = (msg) => {
    const fm = [
      ...new Set(
        msg
          .replace(/Validation failed:/g, '')
          .replace(/can't be blank/g, 'is required')
          .split(','),
      ),
    ].join(', ');
    return fm;
  };

  return (
    <>
      <MaterialAlert
        className="mb-12 ml-2 smax:ml-0 z-50"
        show={show}
        color="red"
        dismissible={{
          onClose: () => {
            setReservationStatusIdle();
            setAuthStatusIdle();
            setCarStatusIdle();
            setShow(false);
          },
        }}
      >
        {filterMessage(message) || ''}
      </MaterialAlert>
    </>
  );
};

Alert.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Alert;
