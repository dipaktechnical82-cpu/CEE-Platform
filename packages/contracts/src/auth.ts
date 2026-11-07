/**
 * User Roles and Authentication Contracts
 */

export type UserRole =
  'STUDENT' | 'TEACHER' | 'CONTENT_CREATOR' | 'INSTITUTION_ADMIN' | 'SUPER_ADMIN';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface RoleAwareNavigationItem {
  allowedRoles?: readonly UserRole[];
}

export function hasRole(
  user: Pick<AuthenticatedUser, 'role'> | null | undefined,
  role: UserRole,
): boolean {
  return user?.role === role;
}

export function hasAnyRole(
  user: Pick<AuthenticatedUser, 'role'> | null | undefined,
  roles: readonly UserRole[],
): boolean {
  return user !== null && user !== undefined && roles.includes(user.role);
}

export function canAccessRoles(
  user: Pick<AuthenticatedUser, 'role'> | null | undefined,
  allowedRoles?: readonly UserRole[],
): boolean {
  return allowedRoles === undefined || hasAnyRole(user, allowedRoles);
}

export function filterNavigationByRole<T extends RoleAwareNavigationItem>(
  items: readonly T[],
  user: Pick<AuthenticatedUser, 'role'> | null | undefined,
): T[] {
  return items.filter((item) => canAccessRoles(user, item.allowedRoles));
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface EmailRequest {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface RegistrationResponse {
  user: AuthenticatedUser;
  verificationRequired: true;
}

export interface LoginResponse {
  user: AuthenticatedUser;
}

export interface CurrentUserResponse {
  user: AuthenticatedUser;
}

export interface VerificationResponse {
  verified: true;
}

export interface PasswordResetResponse {
  passwordReset: true;
}

export interface AuthMessageResponse {
  message: string;
}
