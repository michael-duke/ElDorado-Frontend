import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import authReducer from './Auth/authSlice';
import carReducer from './Home/home';
import reservationReducer from './Reservations/reservationsSlice';

// root Reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cars: carReducer,
  reservations: reservationReducer,
});

// Redux store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export default store;
