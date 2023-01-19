const baseURL = 'https://eldorado.onrender.com/api/v1';

const setAuthToken = ({ headers }) => localStorage.setItem('token', headers.get('Authorization'));

const unsetAuthToken = () => localStorage.removeItem('token');

const loginOptions = (user) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(user),
});

const registerOptions = (user) => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(user),
});

const carBookingOptions = (booking) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token'),
  },
  body: JSON.stringify(booking),
});

const addCarOptions = (car) => ({
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token'),
  },
  body: JSON.stringify(car),
});

const toggleCarAvailabilityOptions = (car) => ({
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('token'),
  },
  body: JSON.stringify(car),
});

const removeReservationOptions = () => ({
  method: 'DELETE',
  headers: { Authorization: localStorage.getItem('token') },
});

const logoutOptions = () => ({
  method: 'DELETE',
  headers: { Authorization: localStorage.getItem('token') },
});

const api = {
  register: async (user) => {
    const response = await fetch(`${baseURL}/register`, {
      ...registerOptions({ user }),
    });

    const { status: code } = response;

    if (code === 200) setAuthToken(response);

    const data = await response.json();
    return data;
  },
  login: async (user) => {
    const response = await fetch(`${baseURL}/login`, {
      ...loginOptions({ user }),
    });

    const { status: code } = response;

    if (code === 200) {
      setAuthToken(response);
      const { data, message } = await response.json();
      return {
        user: data,
        status: 'succeeded',
        message,
      };
    }

    if (code === 401) {
      return {
        user: {},
        status: 'unauthorized',
        error: 'Unauthorized, You must Login or Register',
        message: 'Login failed, Please check your email and password',
      };
    }

    return null;
  },
  logout: async () => {
    const response = await fetch(`${baseURL}/logout`, {
      ...logoutOptions(),
    });

    const { status: code } = response;

    if (code === 200) {
      unsetAuthToken();
      const data = await response.json();
      return {
        user: {},
        status: 'succeeded',
        message: data.message,
      };
    }
    if (code === 500) {
      unsetAuthToken();
      return {
        user: {},
        status: 'expired',
        error: 'Unauthorized, You must Login or Register',
        message: 'Session for User has expired',
      };
    }
    return null;
  },
  fetchAuthUser: async () => {
    const response = await fetch(`${baseURL}/users`, {
      headers: { Authorization: localStorage.getItem('token') },
    });

    const { status: code } = response;

    if (code === 401) {
      unsetAuthToken();
      return {
        user: {},
        status: 'expired',
        error: 'Unauthorized, You must Login or Register',
        message: 'Session for User has expired',
      };
    }
    if (code === 200) {
      const currentUser = await response.json();
      return {
        user: currentUser,
        status: 'succeeded',
        error: null,
        message: 'User is authenticated',
      };
    }
    return null;
  },
  fetchCars: async () => {
    const response = await fetch(`${baseURL}/cars`);
    const cars = await response.json();
    return cars;
  },
  fetchCar: async (id) => {
    const response = await fetch(`${baseURL}/cars/${id}`);
    const car = await response.json();
    return car;
  },
  reserveCar: async (id, booking) => {
    const response = await fetch(`${baseURL}/users/${id}/reservations`, {
      ...carBookingOptions({ booking }),
    });

    const data = await response.json();
    return data;
  },
  fetchReservations: async (id) => {
    const response = await fetch(`${baseURL}/users/${id}/reservations`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    const reservations = await response.json();
    return reservations;
  },
  deleteReservation: async (userId, reservationId) => {
    const response = await fetch(
      `${baseURL}/users/${userId}/reservations/${reservationId}`,
      {
        ...removeReservationOptions(),
      },
    );
    const data = await response.json();
    return data;
  },
  fetchOwnerCars: async (ownerId) => {
    const response = await fetch(`${baseURL}/owners/${ownerId}/cars`, {
      headers: { Authorization: localStorage.getItem('token') },
    });
    const cars = await response.json();
    return cars;
  },
  addCar: async (ownerId, car) => {
    const response = await fetch(`${baseURL}/users/${ownerId}/cars`, {
      ...addCarOptions({ car }),
    });
    const data = await response.json();
    const { status: code } = response;
    if (code === 422) {
      return {
        status: 'failed',
        data: car,
        message: data.message,
      };
    }

    return data;
  },
  toggleCarAvailability: async (ownerId, carId, car) => {
    const response = await fetch(
      `${baseURL}/users/${ownerId}/cars/${carId}/availability`,
      {
        ...toggleCarAvailabilityOptions({ car }),
      },
    );

    const data = await response.json();
    return data;
  },
};

export default api;
