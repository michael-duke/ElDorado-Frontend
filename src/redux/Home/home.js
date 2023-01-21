import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

const SHOW_CARS = 'SHOW_CARS';
const SHOW_CAR = 'SHOW_CAR';
const GET_OWNER_CARS = 'GET_OWNER_CARS';
const ADD_CAR = 'ADD_CAR';
const TOGGLE_CAR_AVAILABILITY = 'TOGGLE_CAR_AVAILABILITY';

const initialState = {
  availableCars: [],
  car: {},
  allCars: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunks
export const getAvailableCars = createAsyncThunk(SHOW_CARS, async () => {
  try {
    return await api.fetchAvailableCars();
  } catch (error) {
    return error.message;
  }
});
export const getCar = createAsyncThunk(SHOW_CAR, async (id) => {
  try {
    return await api.fetchCar(id);
  } catch (error) {
    return error.message;
  }
});

export const addCar = createAsyncThunk(ADD_CAR, async (car) => {
  try {
    return await api.addCar(car);
  } catch (error) {
    return error.message;
  }
});

export const getAllCars = createAsyncThunk(GET_OWNER_CARS, async () => {
  try {
    return await api.fetchAllCars();
  } catch (error) {
    return error.message;
  }
});

export const toggleAvailability = createAsyncThunk(
  TOGGLE_CAR_AVAILABILITY,
  async ({ carId, car }) => {
    try {
      return await api.toggleCarAvailability(carId, car);
    } catch (error) {
      return error.message;
    }
  },
);

// Reducer
const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    resetCarState: (state) => ({
      ...state,
      car: {},
      status: 'idle',
      message: '',
      error: null,
    }),
    resetAllCarsState: (state) => ({
      ...state,
      allCars: [],
      status: 'idle',
      message: '',
      error: null,
    }),
    setMessageEmpty: (state, action) => ({
      ...state,
      message: action.payload,
    }),
    setStatusIdle: (state) => ({
      ...state,
      status: 'idle',
      message: '',
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAvailableCars.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getAvailableCars.fulfilled, (state, action) => ({
        ...state,
        availableCars: action.payload,
        status: 'succeeded',
      }))
      .addCase(getAvailableCars.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }))
      .addCase(getCar.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getCar.fulfilled, (state, action) => ({
        ...state,
        car: action.payload,
        status: 'succeeded',
      }))
      .addCase(getCar.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }))
      .addCase(addCar.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(addCar.fulfilled, (state, action) => ({
        ...state,
        availableCars: [
          ...(action.payload.data.available && action.payload.status === 201
            ? [action.payload.data]
            : []),
          ...state.availableCars,
        ],
        allCars: [
          ...(action.payload.status === 201 ? [action.payload.data] : []),
          ...state.allCars,
        ],
        message: action.payload.message,
        status: action.payload.status === 200 ? 'succeeded' : 'failed',
      }))
      .addCase(addCar.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }))
      .addCase(toggleAvailability.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(toggleAvailability.fulfilled, (state, action) => ({
        ...state,
        availableCars: [
          ...(action.payload.data.available ? [action.payload.data] : []),
          ...state.availableCars.filter(
            ({ id }) => id !== action.payload.data.id,
          ),
        ],
        allCars: [
          action.payload.data,
          ...state.allCars.filter(({ id }) => id !== action.payload.data.id),
        ],
        message: action.payload.message,
        status: 'succeeded',
      }))
      .addCase(toggleAvailability.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }))
      .addCase(getAllCars.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getAllCars.fulfilled, (state, action) => ({
        ...state,
        allCars: action.payload,
        status: 'succeeded',
      }))
      .addCase(getAllCars.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }));
  },
});

export const {
  resetCarState,
  resetAllCarsState,
  setMessageEmpty,
  setStatusIdle,
} = carsSlice.actions;
export const availableCars = (state) => state.cars.availableCars;
export const allStatus = (state) => state.cars.status;
export const allMessages = (state) => state.cars.message;
export const car = (state) => state.cars.car;
export const allCars = (state) => state.cars.allCars;

export default carsSlice.reducer;
