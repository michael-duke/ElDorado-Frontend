import React, { useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from '@material-tailwind/react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  allCars,
  allStatus,
  toggleAvailability,
  setMessageEmpty,
} from '../redux/Home/home';
import useToken from '../redux/Auth/useToken';
import Loader from './Loader';
import Switch from './Switch';

const DeleteCar = () => {
  const cars = useSelector(allCars);
  const status = useSelector(allStatus);
  const isTokenSet = useToken();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDeleteCar = (status, carId) => {
    const car = {
      available: status,
    };

    setTimeout(() => {
      dispatch(toggleAvailability({ carId, car }));
    }, 1000);
  };

  document.title = 'ElDorado | DeleteCar';

  const checkAuthUser = () => {
    if (!isTokenSet) navigate('/login');
  };

  useEffect(() => {
    dispatch(setMessageEmpty());
    checkAuthUser();
  }, [isTokenSet]);
  return status === 'loading' ? (
    <Loader />
  ) : (
    <>
      <CardHeader
        variant="gradient"
        className="sticky top-2 z-40 mb-16 grid h-28 place-items-center text-white bg-black/50 backdrop-blur-md"
      >
        <Typography
          variant="h3"
          color="white"
          className="font-osans uppercase tracking-widest font-light"
        >
          Delete a Car
        </Typography>
      </CardHeader>
      {cars.length === 0 ? (
        <Card className="max-w-sm mt-48 mx-auto h-32">
          <CardBody className="text-center font-bold my-auto text-2xl">
            {' '}
            No Cars Owned
            {' '}
          </CardBody>
        </Card>
      ) : (
        <div className="Car-Grid grid gap-6">
          {cars.map(
            ({
              id: carId,
              name,
              model,
              image,
              daily_price: price,
              available,
            }) => (
              <Card key={carId} className="cursor-pointer my-5">
                <CardHeader
                  color="amber"
                  className="relative h-56 mx-0.5"
                  onClick={() => navigate(`/car-details/${carId}`)}
                >
                  <img
                    src={image}
                    alt="img-blur-shadow"
                    className="h-full w-full object-cover"
                  />
                </CardHeader>
                <CardBody className="px-2 text-center">
                  <Typography variant="h5" className="mb-2 whitespace-pre-wrap">
                    {name}
                  </Typography>
                </CardBody>
                <CardFooter
                  divider
                  className="flex items-center justify-between py-3"
                >
                  <Typography variant="small">
                    $
                    {price}
                  </Typography>
                  <Switch
                    status={available}
                    carName={name}
                    carId={carId}
                    handleRemove={handleDeleteCar}
                  />
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex gap-1"
                  >
                    {model}
                  </Typography>
                </CardFooter>
              </Card>
            ),
          )}
        </div>
      )}
    </>
  );
};

export default DeleteCar;
