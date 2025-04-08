const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:5000/api';

interface User {
  _id: string;
  name: string;
  email: string;
  isVerified: boolean;
  createdAt: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  token?: string;
}

export const api = {
  async register(data: RegisterData): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async login(data: LoginData): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response.json();
  },

  async verifyEmail(token: string): Promise<ApiResponse<null>> {
    const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
      method: 'GET',
    });

    return response.json();
  },
};
