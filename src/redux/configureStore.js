import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
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
const store = configureStore(
  {
    reducer: rootReducer,
  },

);

export default store;
