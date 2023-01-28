import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from '@material-tailwind/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setMessageEmpty,
  allMessages,
  allStatus,
  carReservations,
  deleteReservation,
} from '../redux/Reservations/reservationsSlice';
import useToken from '../redux/Auth/useToken';
import { authenticatedUser } from '../redux/Auth/authSlice';
import Loader from './Loader';
import ReservationDetail from './ReservationDetail';

const Reservation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const message = useSelector(allMessages);
  const reservations = useSelector(carReservations);
  const status = useSelector(allStatus);
  const currentUser = useSelector(authenticatedUser); // useAuthUser();
  const isTokenSet = useToken();

  const handleRemoveReservation = (reservationId) => {
    const removeOptions = {
      userId: currentUser.id,
      reservationId,
    };

    dispatch(deleteReservation(removeOptions));
  };

  const checkAuthUser = () => {
    if (!isTokenSet) navigate('/login');
  };

  const handleResevationMessage = () => {
    if (message === 'Car has been successfully booked') dispatch(setMessageEmpty(''));
  };

  useEffect(() => {
    checkAuthUser();
    handleResevationMessage();
  }, [message, isTokenSet]);

  document.title = `ElDorado | Reservations: ${reservations.length}`;
  return status === 'loading' ? (
    <Loader />
  ) : (
    <div className="max-w-sm mt-3 mb-5 mx-auto flex flex-col gap-y-12 h-[95%]">
      <div>
        <Typography
          variant="h1"
          className="uppercase font-osans font-extralight tracking-widest mb-3 text-center text-[1.37rem] leading-7 sm:text-2xl md:text-3xl border-b-2 pb-2"
        >
          reservations
        </Typography>
      </div>
      {reservations.length === 0 ? (
        <Card className="max-w-sm my-auto h-32">
          <CardBody className="text-center font-bold my-auto text-2xl">
            {' '}
            No Reservations
            {' '}
          </CardBody>
        </Card>
      ) : (
        reservations.map(
          ({
            id: reservationId,
            pickup_date: pickupDate,
            return_date: returnDate,
            car: {
              name: carName,
              model,
              image,
              daily_price: dailyPrice,
              available,
            },
          }) => (
            <Card key={reservationId} className="max-w-sm">
              <CardHeader color="amber" className="relative h-56">
                <img
                  src={image}
                  alt={`${carName}-img`}
                  className="h-full w-full"
                />
              </CardHeader>
              <CardBody className="text-center">
                <ReservationDetail
                  title={carName}
                  pickupDate={pickupDate}
                  returnDate={returnDate}
                  model={model}
                  available={available}
                />
              </CardBody>
              <CardFooter
                divider
                className="flex items-center justify-between py-3"
              >
                <Typography
                  variant="small"
                  className="text-blue-gray-500 font-bold"
                >
                  {`$${dailyPrice}/day`}
                </Typography>
                <Typography variant="small" color="gray" className="flex gap-1">
                  <button
                    onClick={() => handleRemoveReservation(reservationId)}
                    type="button"
                    className="flex gap-2 items-center border border-red-600 rounded p-1"
                  >
                    <TrashIcon className="w-7 text-red-500" />
                    <span className="capitalize">remove</span>
                  </button>
                </Typography>
              </CardFooter>
            </Card>
          ),
        )
      )}
    </div>
  );
};

export default Reservation;
