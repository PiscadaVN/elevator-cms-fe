import {
  apiPostFormData,
  apiPost,
  getAuthToken,
  setAuthToken,
  setRefreshToken,
  removeAuthToken,
  getRefreshToken,
} from '@/lib/api-client';
import type {
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
  PasswordChangeRequest,
} from '@/types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiPostFormData<TokenResponse>(
      'auth/login',
      {
        username: data.username,
        password: data.password,
        grant_type: data.grant_type || 'password',
        scope: data.scope || '',
      },
      false,
    );

    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);

    return response;
  },

  refreshToken: async (): Promise<TokenResponse> => {
    const refresh_token = getRefreshToken();
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await apiPost<TokenResponse>(
      'auth/refresh_token',
      { refresh_token } as RefreshTokenRequest,
      false,
    );

    setAuthToken(response.access_token);
    setRefreshToken(response.refresh_token);

    return response;
  },

  logout: async (): Promise<void> => {
    await apiPost<void>('auth/logout', undefined, true);
    removeAuthToken();
  },

  changePassword: async (data: PasswordChangeRequest): Promise<void> => {
    return apiPost<void>('auth/password', data, true);
  },

  isAuthenticated: (): boolean => {
    return !!getAuthToken();
  },
};
