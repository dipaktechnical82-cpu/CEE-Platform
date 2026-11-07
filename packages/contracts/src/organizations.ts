export type OrganizationMembershipRole = 'ADMIN' | 'TEACHER' | 'STUDENT' | 'STAFF';

export interface OrganizationRecord {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  activeMembershipCount: number;
  activeBatchCount: number;
  currentMembershipRole: OrganizationMembershipRole | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMembershipRecord {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  organizationId: string;
  role: OrganizationMembershipRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationBatchRecord {
  id: string;
  organizationId: string;
  organizationName: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationInvitationRecord {
  id: string;
  organizationId: string;
  email: string;
  role: OrganizationMembershipRole;
  invitedByEmail: string | null;
  expiresAt: string;
  acceptedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface OrganizationCreateRequest {
  name: string;
  slug?: string;
}

export interface OrganizationUpdateRequest {
  name?: string;
  slug?: string;
  isActive?: boolean;
}

export interface MembershipCreateRequest {
  userEmail: string;
  role: OrganizationMembershipRole;
}

export interface MembershipUpdateRequest {
  role?: OrganizationMembershipRole;
  isActive?: boolean;
}

export interface BatchCreateRequest {
  name: string;
}

export interface BatchUpdateRequest {
  name?: string;
  isActive?: boolean;
}

export interface InvitationCreateRequest {
  email: string;
  role: OrganizationMembershipRole;
}
