import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

const SHOW_CARS = 'SHOW_CARS';
const SHOW_CAR = 'SHOW_CAR';
const GET_OWNER_CARS = 'GET_OWNER_CARS';
const ADD_CAR = 'ADD_CAR';
const TOGGLE_CAR_AVAILABILITY = 'TOGGLE_CAR_AVAILABILITY';

const initialState = {
  cars: [],
  car: {},
  ownerCars: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Thunks
export const getCars = createAsyncThunk(SHOW_CARS, async () => {
  try {
    return await api.fetchCars();
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

export const addCar = createAsyncThunk(ADD_CAR, async ({ ownerId, car }) => {
  try {
    return await api.addCar(ownerId, car);
  } catch (error) {
    return error.message;
  }
});

export const getOwnerCars = createAsyncThunk(
  GET_OWNER_CARS,
  async (ownerId) => {
    try {
      return await api.fetchOwnerCars(ownerId);
    } catch (error) {
      return error.message;
    }
  },
);

export const toggleAvailability = createAsyncThunk(
  TOGGLE_CAR_AVAILABILITY,
  async ({ ownerId, carId, car }) => {
    try {
      return await api.toggleCarAvailability(ownerId, carId, car);
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
    resetOwnerCarsState: (state) => ({
      ...state,
      ownerCars: [],
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
      .addCase(getCars.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getCars.fulfilled, (state, action) => ({
        ...state,
        cars: action.payload,
        status: 'succeeded',
      }))
      .addCase(getCars.rejected, (state, action) => ({
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
        cars: [
          ...(action.payload.data.available && action.payload.status === 201
            ? [action.payload.data]
            : []),
          ...state.cars,
        ],
        ownerCars: [
          ...(action.payload.status === 201 ? [action.payload.data] : []),
          ...state.ownerCars,
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
        cars: [
          ...(action.payload.data.available ? [action.payload.data] : []),
          ...state.cars.filter(({ id }) => id !== action.payload.data.id),
        ],
        ownerCars: [
          action.payload.data,
          ...state.ownerCars.filter(({ id }) => id !== action.payload.data.id),
        ],
        message: action.payload.message,
        status: 'succeeded',
      }))
      .addCase(toggleAvailability.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }))
      .addCase(getOwnerCars.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getOwnerCars.fulfilled, (state, action) => ({
        ...state,
        ownerCars: action.payload,
        status: 'succeeded',
      }))
      .addCase(getOwnerCars.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.error.message,
      }));
  },
});

export const {
  resetCarState, resetOwnerCarsState, setMessageEmpty, setStatusIdle,
} = carsSlice.actions;
export const allCars = (state) => state.cars.cars;
export const allStatus = (state) => state.cars.status;
export const allMessages = (state) => state.cars.message;
export const car = (state) => state.cars.car;
export const ownerCars = (state) => state.cars.ownerCars;

export default carsSlice.reducer;
