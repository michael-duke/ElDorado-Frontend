import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import store from '../redux/configureStore';
import '@testing-library/jest-dom/';
import ReservationDetail from '../components/ReservationDetail';

describe('Reservation Detail component', () => {
  test('Should render the proper Reservation Detail component', () => {
    const reservationDetail = render(
      <React.StrictMode>
        <Provider store={store}>
          <Router>
            <ReservationDetail title pickupDate returnDate model />
          </Router>
        </Provider>
        ,
      </React.StrictMode>,
    );
    expect(reservationDetail).toMatchSnapshot();
  });
});
