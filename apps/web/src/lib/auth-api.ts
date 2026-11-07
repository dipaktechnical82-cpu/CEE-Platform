import type {
  AuthMessageResponse,
  CurrentUserResponse,
  EmailRequest,
  LoginRequest,
  LoginResponse,
  PasswordResetResponse,
  RegisterRequest,
  RegistrationResponse,
  ResetPasswordRequest,
  VerificationResponse,
  VerifyEmailRequest,
} from '@cee/contracts';
import { apiClient } from './api-client';

export const authApi = {
  register: (request: RegisterRequest) =>
    apiClient<RegistrationResponse>('/api/v1/auth/register/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  login: (request: LoginRequest) =>
    apiClient<LoginResponse>('/api/v1/auth/login/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  logout: () =>
    apiClient<{ loggedOut: true }>('/api/v1/auth/logout/', {
      method: 'POST',
    }),

  refresh: () =>
    apiClient<{ refreshed: true }>('/api/v1/auth/refresh/', {
      method: 'POST',
    }),

  me: () => apiClient<CurrentUserResponse>('/api/v1/auth/me/'),

  verifyEmail: (request: VerifyEmailRequest) =>
    apiClient<VerificationResponse>('/api/v1/auth/verify-email/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  resendVerification: (request: EmailRequest) =>
    apiClient<AuthMessageResponse>('/api/v1/auth/resend-verification/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  forgotPassword: (request: EmailRequest) =>
    apiClient<AuthMessageResponse>('/api/v1/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  resetPassword: (request: ResetPasswordRequest) =>
    apiClient<PasswordResetResponse>('/api/v1/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};
