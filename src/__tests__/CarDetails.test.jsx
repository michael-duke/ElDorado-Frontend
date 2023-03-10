import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { render } from '@testing-library/react';
import store from '../redux/configureStore';
import '@testing-library/jest-dom/';
import CarDetails from '../pages/CarDetails';

describe('Car detail page', () => {
  test('Should render the proper details page for a car', () => {
    const carDetail = render(
      <React.StrictMode>
        <Provider store={store}>
          <Router>
            <CarDetails open />
          </Router>
        </Provider>
      </React.StrictMode>,
    );
    expect(carDetail).toMatchSnapshot();
  });
});
