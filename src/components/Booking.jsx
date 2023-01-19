import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from 'antd';
import moment from 'moment';
import dayjs from 'dayjs';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
  Select,
  Option,
} from '@material-tailwind/react';
import {
  allMessages,
  bookCar,
  allStatus,
} from '../redux/Reservations/reservationsSlice';
import useToken from '../redux/Auth/useToken';
import { allCars, car } from '../redux/Home/home';
import { authenticatedUser } from '../redux/Auth/authSlice';
import Alert from './Alert';
import { Spinner } from './Loader';

const Booking = () => {
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const currentUser = useSelector(authenticatedUser);
  const cars = useSelector(allCars);
  const message = useSelector(allMessages);
  const status = useSelector(allStatus);
  const selectedCar = useSelector(car).id;
  const [carId, setCarId] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isTokenSet = useToken();

  const handleDateFormat = (date) => moment(dayjs(date).toDate()).format('YYYY-MM-DD');

  const handleCarId = (carId) => setCarId(+carId);

  const handleReserve = () => {
    const reservation = {
      pickup_date: pickupDate,
      return_date: returnDate,
      car_id: carId,
    };

    const reservationObject = {
      reservation,
      userId: currentUser.id,
    };
    dispatch(bookCar(reservationObject));
  };

  const navigateReservation = () => {
    if (message === 'Car has been successfully booked') navigate('/reservation');
  };

  const checkAuthUser = () => {
    if (!isTokenSet) navigate('/login');
  };

  const handleSelectedCar = () => {
    if (selectedCar) setCarId(selectedCar);
  };

  useEffect(() => {
    handleSelectedCar();
    navigateReservation();
    checkAuthUser();
  }, [message, isTokenSet, selectedCar]);

  document.title = 'ElDorado | Booking';
  return (
    <>
      {status === 'failed' && <Alert message={message} />}
      <Card className="mt-5 mb-64 max-w-sm mx-auto bg-white/90 backdrop-blur-md">
        <CardHeader
          variant="gradient"
          className="mb-4 grid h-28 place-items-center text-white bg-black/50 backdrop-blur-md"
        >
          <Typography
            variant="h3"
            color="white"
            className="font-osans uppercase tracking-widest font-light"
          >
            Book a Car
          </Typography>
        </CardHeader>
        <CardBody className="text-center">
          <Typography variant="h5" className="mb-2">
            Kind Note
          </Typography>
          <Typography className="text-left">
            From Lamborghini to Mercedes, we have it all. El Dorado provides you
            with the best luxary car rental services worldwide.
          </Typography>
        </CardBody>
        <CardBody className="flex flex-col gap-4 text-red-500">
          <DatePicker
            placeholder="Pickup Date"
            placement="bottomLeft"
            size="large"
            format="YYYY/MM/DD"
            allowClear
            disabledDate={(current) => current && current < moment().startOf('day')}
            onChange={(date) => setPickupDate(handleDateFormat(date))}
          />
          <DatePicker
            placeholder="Return Date"
            placement="bottomLeft"
            size="large"
            format="YYYY/MM/DD"
            allowClear
            disabledDate={(current) => current && current < moment().endOf('day')}
            onChange={(date) => setReturnDate(handleDateFormat(date))}
          />
          <Select
            color="amber"
            className=""
            name="car"
            value={selectedCar?.toString()}
            label="Select a car"
            onChange={handleCarId}
            required
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
          >
            {cars.map(({ id: carId, name }) => (
              <Option value={carId.toString()} key={carId}>
                {name}
              </Option>
            ))}
          </Select>
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            type="button"
            onClick={handleReserve}
            color="amber"
            variant="gradient"
            fullWidth
            className="capitalize flex justify-center items-center"
          >
            {status === 'loading' ? <Spinner /> : <span>Add Car</span>}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default Booking;
