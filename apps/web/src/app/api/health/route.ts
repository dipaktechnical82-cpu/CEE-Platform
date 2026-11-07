import { NextResponse } from 'next/server';
import type { HealthCheckResponse } from '@cee/contracts';

export async function GET() {
  const payload: HealthCheckResponse = {
    status: 'healthy',
    service: '@cee/web',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
