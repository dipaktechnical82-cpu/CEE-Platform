'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type {
  AuthenticatedUser,
  OrganizationBatchRecord,
  OrganizationInvitationRecord,
  OrganizationMembershipRecord,
  OrganizationRecord,
  OrganizationMembershipRole,
} from '@cee/contracts';
import { ApiClientError } from '@/lib/api-client';
import { authApi } from '@/lib/auth-api';
import { organizationsApi } from '@/lib/organizations-api';

const memberRoles: OrganizationMembershipRole[] = ['STUDENT', 'TEACHER', 'STAFF'];
const allRoles: OrganizationMembershipRole[] = ['ADMIN', ...memberRoles];

function messageFor(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.status === 401) return 'Your session has expired. Sign in again to continue.';
    if (error.status === 403 || error.status === 404) {
      return 'You are not authorized to manage this organization.';
    }
    return error.message;
  }
  return 'The organization service is unavailable. Please try again.';
}

function displayRole(role: OrganizationMembershipRole): string {
  return role
    .replace('_', ' ')
    .toLowerCase()
    .replace(/^\w/, (letter) => letter.toUpperCase());
}

export default function OrganizationsPage() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [members, setMembers] = useState<OrganizationMembershipRecord[]>([]);
  const [batches, setBatches] = useState<OrganizationBatchRecord[]>([]);
  const [invitations, setInvitations] = useState<OrganizationInvitationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [newOrganizationName, setNewOrganizationName] = useState('');
  const [batchName, setBatchName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState<OrganizationMembershipRole>('STUDENT');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrganizationMembershipRole>('STUDENT');

  const selected = organizations.find((organization) => organization.id === selectedId) ?? null;
  const isPlatformAdmin = user?.role === 'SUPER_ADMIN';
  const canManage = Boolean(
    selected &&
    (isPlatformAdmin ||
      (user?.role === 'INSTITUTION_ADMIN' && selected.currentMembershipRole === 'ADMIN')),
  );
  const roleOptions = useMemo(() => (isPlatformAdmin ? allRoles : memberRoles), [isPlatformAdmin]);

  const loadOrganizations = useCallback(async () => {
    const [{ user: currentUser }, results] = await Promise.all([
      authApi.me(),
      organizationsApi.list(),
    ]);
    setUser(currentUser);
    setOrganizations(results);
    setSelectedId((current) =>
      results.some((organization) => organization.id === current)
        ? current
        : (results[0]?.id ?? ''),
    );
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    void Promise.all([authApi.me(), organizationsApi.list()])
      .then(([{ user: currentUser }, results]) => {
        if (!active) return;
        setUser(currentUser);
        setOrganizations(results);
        setSelectedId((current) =>
          results.some((organization) => organization.id === current)
            ? current
            : (results[0]?.id ?? ''),
        );
      })
      .catch((cause: unknown) => {
        if (active) setError(messageFor(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) {
      setMembers([]);
      setBatches([]);
      setInvitations([]);
      return;
    }
    let active = true;
    setDetailLoading(true);
    void Promise.all([
      organizationsApi.listBatches(selected.id),
      canManage
        ? organizationsApi.listMemberships(selected.id)
        : Promise.resolve<OrganizationMembershipRecord[]>([]),
      canManage
        ? organizationsApi.listInvitations(selected.id)
        : Promise.resolve<OrganizationInvitationRecord[]>([]),
    ] as const)
      .then(([batchResults, memberResults, invitationResults]) => {
        if (!active) return;
        setBatches(batchResults);
        setMembers(memberResults);
        setInvitations(invitationResults);
        setError('');
      })
      .catch((cause: unknown) => {
        if (active) setError(messageFor(cause));
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedId, selected, canManage]);

  async function runAction(action: () => Promise<unknown>, successMessage: string) {
    setError('');
    setNotice('');
    setSaving(true);
    try {
      await action();
      await loadOrganizations();
      setNotice(successMessage);
    } catch (cause) {
      setError(messageFor(cause));
    } finally {
      setSaving(false);
    }
  }

  async function createOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newOrganizationName.trim();
    if (!name) return;
    await runAction(async () => {
      const created = await organizationsApi.create({ name });
      setSelectedId(created.id);
      setNewOrganizationName('');
    }, 'Organization created.');
  }

  async function updateOrganization(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected) return;
    const formData = new FormData(event.currentTarget);
    const changes: { name: string; isActive?: boolean } = {
      name: organizationName.trim(),
    };
    if (isPlatformAdmin) changes.isActive = formData.get('isActive') === 'on';
    await runAction(async () => {
      await organizationsApi.update(selected.id, changes);
    }, 'Organization updated.');
  }

  async function createBatch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !batchName.trim()) return;
    await runAction(async () => {
      await organizationsApi.createBatch(selected.id, { name: batchName.trim() });
      setBatchName('');
    }, 'Batch created.');
  }

  async function createMember(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !memberEmail.trim()) return;
    await runAction(async () => {
      await organizationsApi.createMembership(selected.id, {
        userEmail: memberEmail.trim(),
        role: memberRole,
      });
      setMemberEmail('');
    }, 'Member added.');
  }

  async function createInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selected || !inviteEmail.trim()) return;
    await runAction(async () => {
      await organizationsApi.createInvitation(selected.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteEmail('');
    }, 'Invitation sent. The invitee must sign in with a verified matching email to accept.');
  }

  async function refreshDetails() {
    if (!selected) return;
    const [batchResults, memberResults, invitationResults] = await Promise.all([
      organizationsApi.listBatches(selected.id),
      canManage
        ? organizationsApi.listMemberships(selected.id)
        : Promise.resolve<OrganizationMembershipRecord[]>([]),
      canManage
        ? organizationsApi.listInvitations(selected.id)
        : Promise.resolve<OrganizationInvitationRecord[]>([]),
    ] as const);
    setBatches(batchResults);
    setMembers(memberResults);
    setInvitations(invitationResults);
  }

  async function updateMember(
    member: OrganizationMembershipRecord,
    data: { role?: OrganizationMembershipRole; isActive?: boolean },
  ) {
    await runAction(async () => {
      await organizationsApi.updateMembership(member.id, data);
      await refreshDetails();
    }, 'Membership updated.');
  }

  async function removeMember(member: OrganizationMembershipRecord) {
    if (!window.confirm(`Deactivate ${member.email}'s membership?`)) return;
    await runAction(async () => {
      await organizationsApi.removeMembership(member.id);
      await refreshDetails();
    }, 'Membership removed.');
  }

  async function updateBatch(
    batch: OrganizationBatchRecord,
    data: { name?: string; isActive?: boolean },
  ) {
    await runAction(async () => {
      await organizationsApi.updateBatch(batch.id, data);
      await refreshDetails();
    }, 'Batch updated.');
  }

  async function revokeInvitation(invitation: OrganizationInvitationRecord) {
    await runAction(async () => {
      await organizationsApi.revokeInvitation(invitation.id);
      await refreshDetails();
    }, 'Invitation revoked.');
  }

  if (loading) {
    return (
      <p className="p-8 text-center" aria-live="polite">
        Loading organizations…
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5FBFA] px-4 py-8 text-[#244A50] sm:px-8">
      <header className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#31828A]">
          Institution workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold">Organizations</h1>
        <p className="mt-2 max-w-2xl text-[#557177]">
          Manage your institution, memberships, invitations, and batches. Your access is limited to
          organizations where you hold an active membership.
        </p>
      </header>

      <main className="mx-auto mt-8 grid max-w-6xl gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-[#D5F3E8] bg-white p-4 shadow-sm">
          <h2 className="font-semibold">Your organizations</h2>
          {organizations.length === 0 ? (
            <p className="mt-4 text-sm text-[#557177]">
              No organization memberships are available.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {organizations.map((organization) => (
                <li key={organization.id}>
                  <button
                    className={`w-full rounded-xl px-3 py-3 text-left ${
                      selectedId === organization.id
                        ? 'bg-[#D5F3E8] font-semibold'
                        : 'hover:bg-[#F5FBFA]'
                    }`}
                    onClick={() => {
                      setSelectedId(organization.id);
                      setOrganizationName(organization.name);
                    }}
                    type="button"
                  >
                    <span className="block">{organization.name}</span>
                    <span className="mt-1 block text-xs text-[#557177]">
                      {organization.currentMembershipRole
                        ? displayRole(organization.currentMembershipRole)
                        : 'Platform administrator'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {isPlatformAdmin ? (
            <form className="mt-5 border-t border-[#D5F3E8] pt-4" onSubmit={createOrganization}>
              <label className="block text-sm font-medium" htmlFor="new-organization">
                Create organization
              </label>
              <input
                className="mt-2 w-full rounded-lg border border-[#B8DFF4] px-3 py-2"
                id="new-organization"
                onChange={(event) => setNewOrganizationName(event.target.value)}
                value={newOrganizationName}
                required
              />
              <button
                className="mt-2 rounded-lg bg-[#244A50] px-4 py-2 text-sm font-semibold text-white"
                disabled={saving}
              >
                Create
              </button>
            </form>
          ) : null}
        </aside>

        <section className="space-y-6">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800" role="alert">
              {error}
            </p>
          ) : null}
          {notice ? (
            <p className="rounded-xl border border-[#A9E6DD] bg-[#D5F3E8] p-4" role="status">
              {notice}
            </p>
          ) : null}
          {!selected ? (
            <div className="rounded-2xl border border-[#D5F3E8] bg-white p-8">
              <h2 className="text-xl font-semibold">No organization selected</h2>
              <p className="mt-2 text-[#557177]">
                {isPlatformAdmin
                  ? 'Create an organization to begin managing it.'
                  : 'Ask an institution administrator to invite you to an organization.'}
              </p>
            </div>
          ) : (
            <>
              <section className="rounded-2xl border border-[#D5F3E8] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">{selected.name}</h2>
                    <p className="mt-1 text-sm text-[#557177]">/{selected.slug}</p>
                  </div>
                  <div className="flex gap-3 text-center">
                    <div className="rounded-xl bg-[#EAF7FC] px-4 py-3">
                      <strong className="block text-xl">{selected.activeMembershipCount}</strong>
                      <span className="text-xs">Active members</span>
                    </div>
                    <div className="rounded-xl bg-[#E7F8F3] px-4 py-3">
                      <strong className="block text-xl">{selected.activeBatchCount}</strong>
                      <span className="text-xs">Active batches</span>
                    </div>
                  </div>
                </div>
                {canManage ? (
                  <form
                    className="mt-5 flex flex-wrap items-end gap-3"
                    key={selected.id}
                    onSubmit={updateOrganization}
                  >
                    <div className="min-w-56 flex-1">
                      <label className="block text-sm font-medium" htmlFor="organization-name">
                        Organization name
                      </label>
                      <input
                        className="mt-1 w-full rounded-lg border border-[#B8DFF4] px-3 py-2"
                        id="organization-name"
                        onChange={(event) => setOrganizationName(event.target.value)}
                        value={organizationName || selected.name}
                        required
                      />
                    </div>
                    {isPlatformAdmin ? (
                      <label className="flex items-center gap-2 pb-2 text-sm">
                        <input defaultChecked={selected.isActive} name="isActive" type="checkbox" />
                        Active
                      </label>
                    ) : null}
                    <button
                      className="rounded-lg bg-[#244A50] px-4 py-2 font-semibold text-white"
                      disabled={saving}
                    >
                      Save
                    </button>
                  </form>
                ) : null}
              </section>

              {detailLoading ? (
                <p aria-live="polite">Loading organization details…</p>
              ) : (
                <>
                  {canManage ? (
                    <section className="grid gap-6 xl:grid-cols-2">
                      <form
                        className="rounded-2xl border border-[#D5F3E8] bg-white p-5"
                        onSubmit={createMember}
                      >
                        <h2 className="font-semibold">Add an existing member</h2>
                        <p className="mt-1 text-sm text-[#557177]">
                          The account must be active and have a verified email.
                        </p>
                        <label className="mt-4 block text-sm font-medium" htmlFor="member-email">
                          Account email
                        </label>
                        <input
                          className="mt-1 w-full rounded-lg border border-[#B8DFF4] px-3 py-2"
                          id="member-email"
                          onChange={(event) => setMemberEmail(event.target.value)}
                          type="email"
                          value={memberEmail}
                          required
                        />
                        <label className="mt-3 block text-sm font-medium" htmlFor="member-role">
                          Membership role
                        </label>
                        <select
                          className="mt-1 w-full rounded-lg border border-[#B8DFF4] px-3 py-2"
                          id="member-role"
                          onChange={(event) =>
                            setMemberRole(event.target.value as OrganizationMembershipRole)
                          }
                          value={memberRole}
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {displayRole(role)}
                            </option>
                          ))}
                        </select>
                        <button
                          className="mt-4 rounded-lg bg-[#244A50] px-4 py-2 font-semibold text-white"
                          disabled={saving}
                        >
                          Add member
                        </button>
                      </form>

                      <form
                        className="rounded-2xl border border-[#D5F3E8] bg-white p-5"
                        onSubmit={createInvitation}
                      >
                        <h2 className="font-semibold">Invite by email</h2>
                        <p className="mt-1 text-sm text-[#557177]">
                          Invitation expires in seven days and requires a verified matching account.
                        </p>
                        <label className="mt-4 block text-sm font-medium" htmlFor="invite-email">
                          Email address
                        </label>
                        <input
                          className="mt-1 w-full rounded-lg border border-[#B8DFF4] px-3 py-2"
                          id="invite-email"
                          onChange={(event) => setInviteEmail(event.target.value)}
                          type="email"
                          value={inviteEmail}
                          required
                        />
                        <label className="mt-3 block text-sm font-medium" htmlFor="invite-role">
                          Membership role
                        </label>
                        <select
                          className="mt-1 w-full rounded-lg border border-[#B8DFF4] px-3 py-2"
                          id="invite-role"
                          onChange={(event) =>
                            setInviteRole(event.target.value as OrganizationMembershipRole)
                          }
                          value={inviteRole}
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>
                              {displayRole(role)}
                            </option>
                          ))}
                        </select>
                        <button
                          className="mt-4 rounded-lg bg-[#244A50] px-4 py-2 font-semibold text-white"
                          disabled={saving}
                        >
                          Send invitation
                        </button>
                      </form>
                    </section>
                  ) : null}

                  {canManage ? (
                    <section className="rounded-2xl border border-[#D5F3E8] bg-white p-5">
                      <h2 className="font-semibold">Memberships</h2>
                      {members.length === 0 ? (
                        <p className="mt-3 text-sm text-[#557177]">No memberships yet.</p>
                      ) : (
                        <ul className="mt-3 divide-y divide-[#E6F2F0]">
                          {members.map((member) => (
                            <li className="flex flex-wrap items-center gap-3 py-3" key={member.id}>
                              <div className="min-w-48 flex-1">
                                <p className="font-medium">{member.fullName || member.email}</p>
                                <p className="text-sm text-[#557177]">{member.email}</p>
                              </div>
                              <select
                                aria-label={`Role for ${member.email}`}
                                className="rounded-lg border border-[#B8DFF4] px-2 py-2"
                                disabled={
                                  !isPlatformAdmin &&
                                  (member.userId === user?.id || member.role === 'ADMIN')
                                }
                                onChange={(event) =>
                                  void updateMember(member, {
                                    role: event.target.value as OrganizationMembershipRole,
                                  })
                                }
                                value={member.role}
                              >
                                {(isPlatformAdmin ? allRoles : memberRoles).map((role) => (
                                  <option key={role} value={role}>
                                    {displayRole(role)}
                                  </option>
                                ))}
                              </select>
                              <button
                                className="rounded-lg border border-[#B8DFF4] px-3 py-2 text-sm"
                                disabled={
                                  saving ||
                                  (!isPlatformAdmin &&
                                    (member.userId === user?.id || member.role === 'ADMIN'))
                                }
                                onClick={() =>
                                  void updateMember(member, { isActive: !member.isActive })
                                }
                                type="button"
                              >
                                {member.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                className="rounded-lg px-3 py-2 text-sm text-red-700 hover:bg-red-50"
                                disabled={
                                  saving ||
                                  (!isPlatformAdmin &&
                                    (member.userId === user?.id || member.role === 'ADMIN'))
                                }
                                onClick={() => void removeMember(member)}
                                type="button"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ) : null}

                  <section className="rounded-2xl border border-[#D5F3E8] bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-semibold">Batches</h2>
                      {canManage ? (
                        <form className="flex gap-2" onSubmit={createBatch}>
                          <label className="sr-only" htmlFor="batch-name">
                            New batch name
                          </label>
                          <input
                            className="rounded-lg border border-[#B8DFF4] px-3 py-2"
                            id="batch-name"
                            onChange={(event) => setBatchName(event.target.value)}
                            placeholder="New batch name"
                            value={batchName}
                            required
                          />
                          <button
                            className="rounded-lg bg-[#244A50] px-4 py-2 text-sm font-semibold text-white"
                            disabled={saving}
                          >
                            Add
                          </button>
                        </form>
                      ) : null}
                    </div>
                    {batches.length === 0 ? (
                      <p className="mt-3 text-sm text-[#557177]">No batches available.</p>
                    ) : (
                      <ul className="mt-3 divide-y divide-[#E6F2F0]">
                        {batches.map((batch) => (
                          <li
                            className="flex items-center justify-between gap-3 py-3"
                            key={batch.id}
                          >
                            <span>{batch.name}</span>
                            {canManage ? (
                              <button
                                className="rounded-lg border border-[#B8DFF4] px-3 py-2 text-sm"
                                onClick={() =>
                                  void updateBatch(batch, { isActive: !batch.isActive })
                                }
                                disabled={saving}
                                type="button"
                              >
                                {batch.isActive ? 'Deactivate' : 'Activate'}
                              </button>
                            ) : (
                              <span className="text-sm text-[#557177]">
                                {batch.isActive ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  {canManage ? (
                    <section className="rounded-2xl border border-[#D5F3E8] bg-white p-5">
                      <h2 className="font-semibold">Invitations</h2>
                      {invitations.length === 0 ? (
                        <p className="mt-3 text-sm text-[#557177]">No invitations yet.</p>
                      ) : (
                        <ul className="mt-3 divide-y divide-[#E6F2F0]">
                          {invitations.map((invitation) => (
                            <li
                              className="flex flex-wrap items-center gap-3 py-3"
                              key={invitation.id}
                            >
                              <span className="min-w-48 flex-1">
                                {invitation.email} · {displayRole(invitation.role)}
                              </span>
                              <span className="text-sm text-[#557177]">
                                {invitation.acceptedAt
                                  ? 'Accepted'
                                  : invitation.revokedAt
                                    ? 'Revoked'
                                    : `Expires ${new Date(invitation.expiresAt).toLocaleDateString()}`}
                              </span>
                              {!invitation.acceptedAt && !invitation.revokedAt ? (
                                <button
                                  className="rounded-lg border border-[#B8DFF4] px-3 py-2 text-sm"
                                  onClick={() => void revokeInvitation(invitation)}
                                  disabled={saving}
                                  type="button"
                                >
                                  Revoke
                                </button>
                              ) : null}
                            </li>
                          ))}
                        </ul>
                      )}
                    </section>
                  ) : null}
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}
