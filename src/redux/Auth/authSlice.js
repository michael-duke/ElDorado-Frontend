import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/api';

// Actions
const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const REGISTER = 'REGISTER';
const GET_AUTH_USER = 'GET_AUTH_USER';

const initialState = {
  authenticatedUser: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' | 'unauthorized' | 'expired'
  message: '',
  error: null,
};

export const signUp = createAsyncThunk(REGISTER, async (user, { rejectWithValue }) => {
  try {
    return await api.register(user);
  } catch (err) {
    return rejectWithValue({ code: err.code, message: err.message });
  }
});

export const signIn = createAsyncThunk(LOGIN, async (user, { rejectWithValue }) => {
  try {
    return await api.login(user);
  } catch (err) {
    return rejectWithValue({ code: err.code, message: err.message });
  }
});

export const signOut = createAsyncThunk(LOGOUT, async (_, { rejectWithValue }) => {
  try {
    return await api.logout();
  } catch (err) {
    return rejectWithValue({ code: err.code, message: err.message });
  }
});

export const getAuthenticatedUser = createAsyncThunk(
  GET_AUTH_USER,
  async (_, { rejectWithValue }) => {
    try {
      return await api.fetchAuthUser();
    } catch (err) {
      return rejectWithValue({ code: err.code, message: err.message });
    }
  },
);

// Reducer
const authSlice = createSlice({
  name: 'authenticatedUser',
  initialState,
  reducers: {
    setStatusIdle: (state) => ({
      ...state,
      status: 'idle',
      message: '',
    }),
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(signUp.fulfilled, (state, action) => ({
        ...state,
        authenticatedUser: action.payload.data,
        message: action.payload.message || 'Signed up successfully',
        status: 'succeeded',
      }))
      .addCase(signUp.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload?.message,
      }))
      .addCase(signIn.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(signIn.fulfilled, (state, action) => ({
        ...state,
        authenticatedUser: action.payload.data,
        message: action.payload.message || 'Logged in successfully',
        status: 'succeeded',
      }))
      .addCase(signIn.rejected, (state, action) => ({
        ...state,
        status: 'unauthorized',
        message: action.payload?.message,
        error: action.payload?.message,
      }))
      .addCase(signOut.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(signOut.fulfilled, (state, action) => ({
        ...state,
        authenticatedUser: {},
        message: action.payload.message || 'Logged out successfully',
        status: 'succeeded',
      }))
      .addCase(signOut.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        message: action.payload?.message,
        error: action.payload?.message,
      }))
      .addCase(getAuthenticatedUser.pending, (state) => ({
        ...state,
        status: 'loading',
      }))
      .addCase(getAuthenticatedUser.fulfilled, (state, action) => ({
        ...state,
        authenticatedUser: action.payload.data,
        message: action.payload.message || 'User authenticated',
        status: 'succeeded',
      }))
      .addCase(getAuthenticatedUser.rejected, (state, action) => ({
        ...state,
        status: 'failed',
        error: action.payload?.message,
      }));
  },
});

export const { setStatusIdle } = authSlice.actions;
export const authenticatedUser = (state) => state.auth.authenticatedUser;
export const allStatus = (state) => state.auth.status;
export const allMessages = (state) => state.auth.message;

export default authSlice.reducer;
