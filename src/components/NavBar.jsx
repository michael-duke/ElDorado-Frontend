import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import {
  ChevronLeftIcon,
  HomeIcon,
  CreditCardIcon,
  BookmarkIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import useToken from '../redux/Auth/useToken';
import {
  signOut,
  allStatus,
  authenticatedUser,
  getAuthenticatedUser,
} from '../redux/Auth/authSlice';
import {
  getReservations,
  resetReservationState,
} from '../redux/Reservations/reservationsSlice';
import RandomLuxLogo from './RandomLuxLogo';
import whiteLogo from '../assets/logo-transparent-white.png';
import { Dots } from './Loader';
import { resetCarState, getOwnerCars, resetOwnerCarsState } from '../redux/Home/home';

const NavBar = ({ open, handleOpen }) => {
  const [hide, setHide] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [authenticated, setAuthenticated] = useState(false);
  const { id, name: userName } = useSelector(authenticatedUser);
  const dispatch = useDispatch();
  const status = useSelector(allStatus);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isTokenSet = useToken();
  const menu = [
    {
      id: 1,
      name: 'Home',
      icon: <HomeIcon className="w-7" />,
      path: '/',
    },
    {
      id: 2,
      name: 'Booking',
      icon: <CreditCardIcon className="w-7" />,
      path: '/booking',
    },
    {
      id: 3,
      name: 'Reservation',
      icon: <BookmarkIcon className="w-7" />,
      path: '/reservation',
    },
    {
      id: 4,
      name: 'Add Car',
      icon: <PlusCircleIcon className="w-7" />,
      path: '/add_car',
    },
    {
      id: 5,
      name: 'Delete Car',
      icon: <MinusCircleIcon className="w-7" />,
      path: '/delete_car',
    },
  ];

  const handleHide = () => {
    if (width < 768) setHide(!hide);
    else setHide(false);
  };

  const hideSidebar = () => {
    if (width < 768) {
      handleOpen(false);
      setHide(true);
    } else {
      handleOpen(true);
      setHide(false);
    }
  };

  const handleAuth = () => {
    if (isTokenSet) {
      setAuthenticated(true);
      dispatch(getAuthenticatedUser());
      dispatch(getReservations(id));
      dispatch(getOwnerCars(id));
    } else setAuthenticated(false);
  };

  const handleSignOut = () => {
    dispatch(signOut());
    dispatch(resetReservationState());
    dispatch(resetOwnerCarsState());
    dispatch(resetCarState());
    navigate('/');
  };

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    hideSidebar();
    return () => window.removeEventListener('resize', handleResize);
  }, [width]);

  useEffect(() => {
    handleAuth();
  }, [isTokenSet]);

  useEffect(() => {
    if (pathname !== '/booking') {
      dispatch(resetCarState());
    }
  }, [pathname]);
  return (
    <div
      className={`${
        open ? 'w-72' : 'w-20'
      } bg-black/90 relative drop-shadow-xl duration-300 smax:absolute smax:bottom-0 smax:top-0 smax:z-50 ${
        hide && 'h-max rounded-b-full duration-300'
      } `}
    >
      <button
        type="button"
        onClick={() => handleOpen()}
        className={`absolute flex justify-center items-center bg-amber-700 p-0 hover:border-black top-9 w-6 h-6 border rounded-full cursor-pointer -right-3 ${
          !open && 'rotate-180'
        } ${width < 768 && 'hidden'}`}
      >
        <ChevronLeftIcon className="w-5 stroke-white" />
      </button>

      {open ? (
        <div>
          <img
            src={whiteLogo}
            alt="sidebar-white-logo"
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <RandomLuxLogo hideSideBar={handleHide} />
      )}
      <ul
        className={`pt-6 flex flex-col justify-center ${
          hide && 'hidden duration-300'
        }`}
      >
        {authenticated && (
          <span
            className={`bg-white/90 rounded-sm'
               flex gap-x-4 text-sm text-black items-center ${
                 !open
                 && 'justify-center w-max p-1 mx-auto transition-[display] duration-100'
               } cursor-pointer p-3 my-2 text-black`}
          >
            <UserIcon className="w-7" />
            <span className={`${!open && 'hidden'} text-black`}>
              {status === 'loading' ? <Dots /> : userName}
            </span>
          </span>
        )}
        {menu.map(({
          id, name, icon, path,
        }) => (
          <li className="" key={id}>
            <NavLink
              end
              to={path}
              className={({ isActive }) => `${
                isActive && 'bg-amber-600/90 rounded-md'
              } flex gap-x-4 text-sm text-white items-center ${
                !open
                  && 'justify-center w-max p-1 mx-auto transition-[display] duration-100'
              } cursor-pointer p-3 my-2 hover:bg-amber-600/90 hover:text-black hover:rounded-md`}
            >
              {icon}
              <span className={`${!open && 'hidden'}`}>{name}</span>
            </NavLink>
          </li>
        ))}
        <li>
          {authenticated ? (
            <>
              <button
                type="button"
                onClick={handleSignOut}
                className={`group bg-transparent border-none rounded-md flex ${
                  open && 'w-full'
                } gap-x-4 text-sm text-white items-center ${
                  !open
                  && 'justify-center w-max p-1 mx-auto transition-[display] duration-100'
                } cursor-pointer p-3 my-2 hover:bg-amber-600/90 hover:text-black hover:rounded-md`}
              >
                <ArrowRightOnRectangleIcon className="w-7 rotate-180 group-hover:-translate-x-0.5 transition duration-300" />
                <span className={`${!open && 'hidden'}`}>Logout</span>
              </button>
            </>
          ) : (
            <NavLink
              end
              to="/login"
              className={({ isActive }) => `${
                isActive && 'bg-amber-600/90 rounded-md '
              } group flex gap-x-4 text-sm text-white items-center ${
                !open
                  && 'justify-center w-max p-1 mx-auto transition-[display] duration-100'
              } cursor-pointer p-3 my-2 hover:bg-amber-600/90 hover:text-black hover:rounded-md ${
                hide && 'hidden duration-150'
              }`}
            >
              <ArrowRightOnRectangleIcon className="w-7 group-hover:translate-x-0.5 transition duration-300" />
              <span className={`${!open && 'hidden'}`}>Login</span>
            </NavLink>
          )}
        </li>
      </ul>
    </div>
  );
};

NavBar.propTypes = {
  open: PropTypes.bool.isRequired,
  handleOpen: PropTypes.func.isRequired,
};

export default NavBar;
