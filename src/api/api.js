const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const setAuthToken = ({ headers }) => localStorage.setItem('token', headers.get('Authorization'));

const unsetAuthToken = () => localStorage.removeItem('token');

/**
 * A centralized wrapper around fetch for handling authorization,
 * parsing JSON, and throwing standard errors.
 */
const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
    ...customConfig.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...customConfig,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });

    const payload = await response.json();

    if (response.status === 401) {
      unsetAuthToken();
    }

    if (!response.ok) {
      const error = new Error(payload?.message || response.statusText);
      error.code = response.status || 500;
      error.data = payload?.data;
      throw error;
    }

    if (['/auth/login', '/auth/register'].includes(endpoint) && response.ok) {
      setAuthToken(response);
    } else if (endpoint === '/auth/logout') {
      unsetAuthToken();
    }

    return payload;
  } catch (err) {
    // Ensure all errors (including network errors) have a code
    err.code = err.code || 500;
    throw err;
  }
};

const api = {
  register: async (user) => apiClient('/auth/register', { method: 'POST', body: user }),
  login: async (user) => apiClient('/auth/login', { method: 'POST', body: user }),
  logout: async () => apiClient('/auth/logout', { method: 'DELETE' }),
  fetchAuthUser: async () => apiClient('/profile'),
  fetchAvailableCars: async () => apiClient('/cars'),
  fetchCar: async (id) => apiClient(`/cars/${id}`),
  reserveCar: async (reservation) => apiClient('/reservations', { method: 'POST', body: reservation }),
  fetchReservations: async () => apiClient('/reservations'),
  deleteReservation: async (reservationId) => apiClient(`/reservations/${reservationId}`, { method: 'DELETE' }),
  fetchAllCars: async () => apiClient('/admin/cars'),
  addCar: async (car) => apiClient('/admin/cars', { method: 'POST', body: { car } }),
  toggleCarAvailability: async (carId, car) => apiClient(`/admin/cars/${carId}/availability`, { method: 'PATCH', body: { car } }),
};

export default api;
