import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { car, getCar } from '../redux/Home/home';

const CarDetails = ({ open }) => {
  const { id } = useParams();
  const carDetails = useSelector(car);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleReserve = () => {
    navigate('/booking');
  };

  document.title = `ElDorado | ${carDetails.name}`;

  useEffect(() => {
    dispatch(getCar(id));
  }, []);
  return (
    <>
      <div className="overflow-auto mt-10 mx-auto px-4 py-5 bg-gray-200 rounded">
        <div className="md:flex">
          <div className="mr-4">
            <h1 className="text-4xl text-black font-bold self-end justify-self-start font-osans pl-2 mb-12 border-l-4 border-amber-500">{carDetails.name}</h1>
            <img className="w-[1000px] min-w-[270px] rounded-lg object-cover self-stretch" src={carDetails.image} alt="Modern building architecture" />
          </div>
          <div className="flex flex-col">
            <div className="mx-auto mt-2 text-2xl text-black font-bold self-end justify-self-start font-osans bg-amber-300 px-6 py-2 max-w-fit rounded">
              $
              {carDetails.daily_price}
              <sub className="font-features subs font-normal">/per day</sub>
            </div>
            <p className="text-xs text-black font-light text-center">Included Taxes and Checkup</p>
            <div className="text-black bg-white border border-gray-200 p-3 my-2 drop-shadow">
              <h2 className="text-xl border-l-2 border-amber-500 font-bold p-1 mb-4 bg-amber-50">SPECIFICATIONS</h2>
              <p className="">
                <span className="font-semibold ">Make:</span>
                {' '}
                {carDetails.name}
              </p>
              <p className="text-gray ">
                <span className="font-semibold ">Model:</span>
                {' '}
                {carDetails.model}
              </p>
              <p className={`text-gray text-base max-w-[420px] ${open}`}>
                <span className="font-semibold">Description:</span>
                {' '}
                {carDetails.description}
              </p>
            </div>
            <button className="my-3 mx-auto self-center" onClick={handleReserve} type="button">
              <span className="text-black font-bold bg-amber-500 border px-4  hover:bg-amber-600 py-3 rounded-sm my-2">
                Reserve
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

CarDetails.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default CarDetails;
