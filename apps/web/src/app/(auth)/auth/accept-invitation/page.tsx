'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ApiClientError } from '@/lib/api-client';
import { authApi } from '@/lib/auth-api';
import { organizationsApi } from '@/lib/organizations-api';

export default function AcceptInvitationPage() {
  const [token, setToken] = useState('');
  const [status, setStatus] = useState<'loading' | 'ready' | 'accepted' | 'error'>('loading');
  const [message, setMessage] = useState('Checking your invitation…');

  useEffect(() => {
    const invitationToken = new URLSearchParams(window.location.hash.slice(1)).get('token');
    if (!invitationToken) {
      setMessage('This invitation link is invalid or incomplete.');
      setStatus('error');
      return;
    }
    setToken(invitationToken);
    void authApi
      .me()
      .then(() => {
        setMessage('Your invitation is ready to accept.');
        setStatus('ready');
      })
      .catch((error: unknown) => {
        if (error instanceof ApiClientError && error.status === 401) {
          setMessage(
            'Sign in or create an account with the invited, verified email, then reopen this invitation link.',
          );
        } else {
          setMessage('We could not verify your account. Please try again.');
        }
        setStatus('error');
      });
  }, []);

  async function acceptInvitation() {
    setStatus('loading');
    try {
      await organizationsApi.acceptInvitation(token);
      window.history.replaceState(null, '', window.location.pathname);
      setMessage('Invitation accepted. You can now access your organization workspace.');
      setStatus('accepted');
    } catch (error) {
      setMessage(
        error instanceof ApiClientError
          ? error.message
          : 'The invitation could not be accepted. Please try again.',
      );
      setStatus('error');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5FBFA] px-4 py-12 text-[#244A50]">
      <section className="w-full max-w-lg rounded-2xl border border-[#D5F3E8] bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#31828A]">
          Organization invitation
        </p>
        <h1 className="mt-3 text-2xl font-bold">Join your institution</h1>
        <p className="mt-3 text-[#557177]" role={status === 'error' ? 'alert' : 'status'}>
          {message}
        </p>
        {status === 'ready' ? (
          <button
            className="mt-6 rounded-lg bg-[#244A50] px-5 py-3 font-semibold text-white"
            onClick={() => void acceptInvitation()}
            type="button"
          >
            Accept invitation
          </button>
        ) : null}
        {status === 'accepted' ? (
          <Link
            className="mt-6 inline-block rounded-lg bg-[#244A50] px-5 py-3 font-semibold text-white"
            href="/dashboard/organizations"
          >
            Open organizations
          </Link>
        ) : null}
        {status === 'error' ? (
          <Link className="mt-6 inline-block font-semibold underline" href="/login">
            Sign in
          </Link>
        ) : null}
      </section>
    </main>
  );
}
