import type { Metadata } from 'next';
import { env } from './env';

export interface PageSeoProps {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  image?: string;
  imageAlt?: string;
}

export function constructMetadata({
  title,
  description,
  path = '',
  noIndex = false,
  image,
  imageAlt,
}: PageSeoProps): Metadata {
  const url = `${env.appUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const imageUrl = image ? (image.startsWith('http') ? image : `${env.appUrl}${image}`) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Nepal CEE Preparation Platform',
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: imageAlt ?? title,
              },
            ],
          }
        : {}),
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/**
 * Educational Course / Exam Schema Generator for Nepal CEE
 */
export function generateExamJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOccupationalCredential',
    name: 'Nepal Medical Common Entrance Examination (CEE)',
    description:
      'National entrance examination conducted by the Medical Education Commission (MEC) Nepal for MBBS, BDS, BSc Nursing, B.Pharm, and allied medical health programs.',
    credentialCategory: 'Medical Entrance Exam Prep',
    educationalLevel: 'Higher Secondary / Pre-Medical',
    recognizedBy: {
      '@type': 'EducationalOrganization',
      name: 'Medical Education Commission (MEC) Nepal',
    },
  };
}
