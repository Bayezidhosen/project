import { Studio, Booking, User, Review } from '../types';

const API_BASE = '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('studiospace_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('studiospace_token', token);
  } else {
    localStorage.removeItem('studiospace_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include' // Send HTTPOnly cookies
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (body: { name: string; email: string; password: string; photoUrl?: string }) =>
    request<{ success: boolean; message: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  login: (body: { email: string; password: string }) =>
    request<{ success: boolean; message: string; token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  googleLogin: (body: { email: string; name: string; photoUrl?: string }) =>
    request<{ success: boolean; message: string; token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  getMe: () => request<{ success: boolean; user: User }>('/auth/me'),

  logout: () =>
    request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST'
    }),

  // Studios
  getStudios: (params?: {
    category?: string;
    search?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    limit?: number;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
    }
    const qStr = query.toString() ? `?${query.toString()}` : '';
    return request<{ success: boolean; count: number; studios: Studio[] }>(`/studios${qStr}`);
  },

  getStudioById: (id: string) =>
    request<{ success: boolean; studio: Studio; reviews: Review[] }>(`/studios/${id}`),

  getMyStudios: () =>
    request<{ success: boolean; count: number; studios: Studio[] }>('/studios/host/me'),

  createStudio: (body: Partial<Studio>) =>
    request<{ success: boolean; message: string; studio: Studio }>('/studios', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  updateStudio: (id: string, body: Partial<Studio>) =>
    request<{ success: boolean; message: string; studio: Studio }>(`/studios/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    }),

  deleteStudio: (id: string) =>
    request<{ success: boolean; message: string }>(`/studios/${id}`, {
      method: 'DELETE'
    }),

  // Bookings
  getUserBookings: () =>
    request<{ success: boolean; count: number; bookings: Booking[] }>('/bookings'),

  getHostBookings: () =>
    request<{ success: boolean; count: number; bookings: Booking[] }>('/bookings/host'),

  getBookingById: (id: string) =>
    request<{ success: boolean; booking: Booking }>(`/bookings/${id}`),

  createBooking: (body: {
    studioId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
  }) =>
    request<{ success: boolean; message: string; booking: Booking }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  cancelBooking: (id: string) =>
    request<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/cancel`, {
      method: 'PATCH'
    }),

  updateBookingStatus: (id: string, status: string) =>
    request<{ success: boolean; message: string; booking: Booking }>(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }),

  // Reviews
  addReview: (body: { studioId: string; rating: number; comment: string }) =>
    request<{ success: boolean; review: Review }>('/reviews', {
      method: 'POST',
      body: JSON.stringify(body)
    }),

  // Wishlist
  getWishlist: () =>
    request<{ success: boolean; wishlist: string[] }>('/wishlist'),

  toggleWishlist: (studioId: string) =>
    request<{ success: boolean; saved: boolean }>('/wishlist/toggle', {
      method: 'POST',
      body: JSON.stringify({ studioId })
    })
};
