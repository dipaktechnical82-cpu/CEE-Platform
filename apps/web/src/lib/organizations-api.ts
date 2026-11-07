import type {
  BatchCreateRequest,
  BatchUpdateRequest,
  InvitationCreateRequest,
  MembershipCreateRequest,
  MembershipUpdateRequest,
  OrganizationBatchRecord,
  OrganizationCreateRequest,
  OrganizationInvitationRecord,
  OrganizationMembershipRecord,
  OrganizationRecord,
  OrganizationUpdateRequest,
} from '@cee/contracts';
import { apiClient } from './api-client';

export const organizationsApi = {
  list: () => apiClient<OrganizationRecord[]>('/organizations/?page_size=100'),

  create: (request: OrganizationCreateRequest) =>
    apiClient<OrganizationRecord>('/organizations/', {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  update: (organizationId: string, request: OrganizationUpdateRequest) =>
    apiClient<OrganizationRecord>(`/organizations/${organizationId}/`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),

  listMemberships: (organizationId: string) =>
    apiClient<OrganizationMembershipRecord[]>(
      `/organizations/${organizationId}/memberships/?page_size=100`,
    ),

  createMembership: (organizationId: string, request: MembershipCreateRequest) =>
    apiClient<OrganizationMembershipRecord>(`/organizations/${organizationId}/memberships/`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  updateMembership: (membershipId: string, request: MembershipUpdateRequest) =>
    apiClient<OrganizationMembershipRecord>(`/organizations/memberships/${membershipId}/`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),

  removeMembership: async (membershipId: string) => {
    await apiClient<void>(`/organizations/memberships/${membershipId}/`, {
      method: 'DELETE',
    });
  },

  listBatches: (organizationId: string) =>
    apiClient<OrganizationBatchRecord[]>(`/organizations/${organizationId}/batches/?page_size=100`),

  createBatch: (organizationId: string, request: BatchCreateRequest) =>
    apiClient<OrganizationBatchRecord>(`/organizations/${organizationId}/batches/`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  updateBatch: (batchId: string, request: BatchUpdateRequest) =>
    apiClient<OrganizationBatchRecord>(`/organizations/batches/${batchId}/`, {
      method: 'PATCH',
      body: JSON.stringify(request),
    }),

  listInvitations: (organizationId: string) =>
    apiClient<OrganizationInvitationRecord[]>(
      `/organizations/${organizationId}/invitations/?page_size=100`,
    ),

  createInvitation: (organizationId: string, request: InvitationCreateRequest) =>
    apiClient<OrganizationInvitationRecord>(`/organizations/${organizationId}/invitations/`, {
      method: 'POST',
      body: JSON.stringify(request),
    }),

  revokeInvitation: (invitationId: string) =>
    apiClient<{ revoked: true }>(`/organizations/invitations/${invitationId}/revoke/`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  acceptInvitation: (token: string) =>
    apiClient<OrganizationMembershipRecord>('/organizations/invitations/accept/', {
      method: 'POST',
      body: JSON.stringify({ token }),
    }),
};
