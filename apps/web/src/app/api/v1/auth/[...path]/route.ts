import { env } from '@/lib/env';
import { NextRequest, NextResponse } from 'next/server';

const allowedAuthPaths = new Set([
  'csrf',
  'register',
  'login',
  'refresh',
  'logout',
  'me',
  'verify-email',
  'resend-verification',
  'forgot-password',
  'reset-password',
]);

const authCookieNames = new Set([
  process.env.AUTH_ACCESS_COOKIE_NAME ?? 'cee_access',
  process.env.AUTH_REFRESH_COOKIE_NAME ?? 'cee_refresh',
  'cee_csrf',
]);
const maxAuthRequestBytes = 16_384;

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxyAuthRequest(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (path.length !== 1 || !allowedAuthPaths.has(path[0])) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Authentication endpoint not found.',
          details: null,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 404, headers: { 'Cache-Control': 'no-store' } },
    );
  }

  const apiBase = (process.env.API_INTERNAL_URL?.trim() || env.apiUrl).replace(/\/$/, '');
  const upstreamUrl = `${apiBase}/auth/${path[0]}/`;
  const headers = new Headers({ Accept: 'application/json' });
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  }
  const origin = request.headers.get('origin');
  if (origin) {
    headers.set('Origin', origin);
  }
  const referer = request.headers.get('referer');
  if (referer) {
    headers.set('Referer', referer);
  }
  headers.set('X-Forwarded-Proto', request.nextUrl.protocol.replace(':', ''));

  const forwardedCookies = request.cookies
    .getAll()
    .filter(({ name }) => authCookieNames.has(name))
    .map(({ name, value }) => `${name}=${value}`);
  if (forwardedCookies.length > 0) {
    headers.set('Cookie', forwardedCookies.join('; '));
  }
  const csrfToken = request.headers.get('x-csrftoken');
  if (csrfToken) {
    headers.set('X-CSRFToken', csrfToken);
  }

  const method = request.method.toUpperCase();
  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > maxAuthRequestBytes) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REQUEST_TOO_LARGE',
          message: 'Authentication request is too large.',
          details: null,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 413, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  const requestBody =
    method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();
  if (requestBody && requestBody.byteLength > maxAuthRequestBytes) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'REQUEST_TOO_LARGE',
          message: 'Authentication request is too large.',
          details: null,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 413, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  let response: Response;
  try {
    response = await fetch(upstreamUrl, {
      method,
      headers,
      body: requestBody,
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (
      !(error instanceof TypeError) &&
      !(error instanceof DOMException && ['AbortError', 'TimeoutError'].includes(error.name))
    ) {
      throw error;
    }
    console.error('Authentication API upstream request failed.');
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'AUTH_UPSTREAM_UNAVAILABLE',
          message: 'Authentication service is temporarily unavailable.',
          details: null,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    );
  }
  const responseHeaders = new Headers({
    'Cache-Control': 'no-store',
    'Content-Type': response.headers.get('content-type') ?? 'application/json',
  });
  for (const cookie of response.headers.getSetCookie()) {
    responseHeaders.append('Set-Cookie', cookie);
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyAuthRequest;
export const POST = proxyAuthRequest;
