import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleAvailability } from '../Home/home';

import api from '../../api/api';

// Actions
const RESERVE_CAR = 'RESERVE_CAR';
const GET_RESERVATIONS = 'GET_RESERVATIONS';
const DELETE_RESERVATION = 'DELETE_RESERVATION';
const initialState = {
  reservations: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  message: '',
  error: null,
};
// Thunks
export const reserveCar = createAsyncThunk(
  RESERVE_CAR,
  async (reservation, { rejectWithValue }) => {
    try {
      return await api.reserveCar(reservation);
    } catch (err) {
      return rejectWithValue({ code: err.code, message: err.message });
    }
  },
);

export const getReservations = createAsyncThunk(
  GET_RESERVATIONS,
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchReservations();
    } catch (err) {
      return rejectWithValue({ code: err.code, message: err.message });
    }
  },
);

export const deleteReservation = createAsyncThunk(
  DELETE_RESERVATION,
  async (reservationId, { rejectWithValue }) => {
    try {
      return await api.deleteReservation(reservationId);
    } catch (err) {
      return rejectWithValue({ code: err.code, message: err.message });
    }
  },
);

// Reducer
const reservationsSlice = createSlice({
  name: 'reservations',
  initialState,
  reducers: {
    resetReservationState: (state) => ({
      ...state,
      reservations: [],
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
      .addCase(reserveCar.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(reserveCar.fulfilled, (state, action) => ({
        ...state,
        reservations: [action.payload.data, ...state.reservations],
        message: action.payload.message || 'Car reserved successfully',
        status: 'succeeded',
      }))
      .addCase(reserveCar.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        message: action.payload?.message,
        error: action.payload?.message,
      }))
      .addCase(getReservations.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getReservations.fulfilled, (state, action) => ({
        ...state,
        reservations: action.payload.data,
        message: action.payload.message || 'Reservations loaded',
        status: 'succeeded',
      }))
      .addCase(getReservations.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload?.message,
      }))
      .addCase(toggleAvailability.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(toggleAvailability.fulfilled, (state, action) => ({
        ...state,
        reservations: [
          ...state.reservations.map((reservation) =>
            reservation.car.id === action.payload.data.id
              ? {
                  ...reservation,
                  car: {
                    ...reservation.car,
                    available: action.payload.data.available,
                  },
                }
              : reservation,
          ),
        ],
        status: 'succeeded',
        message: `${action.payload.data.name} is ${action.payload.data.available ? 'available' : 'unavailable'}`,
      }))
      .addCase(toggleAvailability.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload?.message,
      }))
      .addCase(deleteReservation.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(deleteReservation.fulfilled, (state, action) => ({
        ...state,
        reservations: state.reservations.filter(
          (reservation) => reservation.id !== action.payload.data.id,
        ),
        message: action.payload.message || 'Reservation deleted',
        status: 'succeeded',
      }))
      .addCase(deleteReservation.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload?.message,
      }));
  },
});

export const carReservations = (state) => state.reservations.reservations;
export const { resetReservationState, setMessageEmpty, setStatusIdle } =
  reservationsSlice.actions;
export const allStatus = (state) => state.reservations.status;
export const allMessages = (state) => state.reservations.message;

export default reservationsSlice.reducer;
