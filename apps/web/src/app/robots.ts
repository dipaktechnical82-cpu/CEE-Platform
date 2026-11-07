import type { MetadataRoute } from 'next';
import { env } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = env.appUrl;

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/syllabus', '/features'],
        disallow: [
          '/dashboard/',
          '/student/',
          '/teacher/',
          '/creator/',
          '/admin/',
          '/api/',
          '/login',
          '/register',
          '/auth/',
          '/reset-password',
          '/verify-email',
          '/exam/',
          '/*?*preview=*',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: ['/dashboard/', '/api/', '/exam/', '/auth/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
