import { apiGet, apiPost, apiPostPublic, type ApiResult } from "./api-client";

export type AuthRole =
  | "PLATFORM_CREATOR"
  | "ADMIN"
  | "EDITOR"
  | "TRANSLATOR"
  | "PROOFREADER"
  | "REVIEWER"
  | "DESIGNER"
  | "NARRATOR"
  | "AUDIO_NARRATOR"
  | "AUTHOR"
  | "COLLABORATOR"
  | "READER"
  | "GUEST"
  | "VIEWER";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  lastLoginAt?: string;
  emailVerifiedAt?: string;
}

export interface AuthOrganization {
  id: string;
  name: string;
  organizationType: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  id: string;
  token: string;
  organizationId: string;
  userId: string;
  roles: AuthRole[];
  createdAt: string;
  expiresAt?: string;
  lastSeenAt?: string;
  revokedAt?: string;
}

export interface AuthSessionSummary {
  id: string;
  organizationId: string;
  userId: string;
  roles: AuthRole[];
  createdAt: string;
  expiresAt?: string;
  lastSeenAt?: string;
  revokedAt?: string;
  active: boolean;
  current?: boolean;
}

export interface AuthActivityEvent {
  id: string;
  action: string;
  message: string;
  createdAt: string;
}

export interface LoginResult {
  user: AuthUser;
  organization: AuthOrganization;
  session: AuthSession;
  actor: {
    userId: string;
    organizationId: string;
    roles: AuthRole[];
  };
}

export interface AuthProfileResult {
  user: AuthUser;
  organization: AuthOrganization;
  roles: AuthRole[];
  permissions: string[];
  activityLog: AuthActivityEvent[];
}

export interface AuthSessionsResult {
  sessions: AuthSessionSummary[];
}

export interface AuthMutationResult {
  accepted: true;
  message: string;
}

export interface RefreshSessionResult {
  session: AuthSession;
}

export function login(input: {
  email: string;
  password?: string;
  loginSecret?: string;
  displayName?: string;
  organizationName?: string;
}): Promise<ApiResult<LoginResult>> {
  return apiPostPublic<LoginResult, typeof input>("/auth/login", input);
}

export function requestPasswordReset(input: {
  email: string;
  newPassword?: string;
  token?: string;
}): Promise<ApiResult<AuthMutationResult>> {
  return apiPostPublic<AuthMutationResult, typeof input>("/auth/password/reset", input);
}

export function verifyEmail(input: {
  email: string;
  token?: string;
}): Promise<ApiResult<AuthMutationResult>> {
  return apiPostPublic<AuthMutationResult, typeof input>("/auth/email/verify", input);
}

export function logout(): Promise<ApiResult<AuthMutationResult>> {
  return apiPost<AuthMutationResult, Record<string, never>>("/auth/logout", {});
}

export function refreshSession(): Promise<ApiResult<RefreshSessionResult>> {
  return apiPost<RefreshSessionResult, Record<string, never>>("/auth/session/refresh", {});
}

export function changePassword(input: {
  currentPassword?: string;
  newPassword: string;
}): Promise<ApiResult<AuthMutationResult>> {
  return apiPost<AuthMutationResult, typeof input>("/auth/password/change", input);
}

export function getUserProfile(): Promise<ApiResult<AuthProfileResult>> {
  return apiGet<AuthProfileResult>("/auth/profile");
}

export function updateUserProfile(input: {
  displayName: string;
}): Promise<ApiResult<AuthProfileResult>> {
  return apiPost<AuthProfileResult, typeof input>("/auth/profile", input);
}

export function listSessions(): Promise<ApiResult<AuthSessionsResult>> {
  return apiGet<AuthSessionsResult>("/auth/sessions");
}

export function revokeSession(sessionId: string): Promise<ApiResult<AuthMutationResult>> {
  return apiPost<AuthMutationResult, Record<string, never>>(
    `/auth/sessions/${encodeURIComponent(sessionId)}/revoke`,
    {}
  );
}
