import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo';
import { AboutHero } from '@/components/about/about-hero';
import { OurStory } from '@/components/about/our-story';
import { OurMission } from '@/components/about/our-mission';
import { OurVision } from '@/components/about/our-vision';
import { CoreDifferentiators } from '@/components/about/core-differentiators';
import { LearningPhilosophy } from '@/components/about/learning-philosophy';
import { TechnologyPurpose } from '@/components/about/technology-purpose';
import { OurCommitments } from '@/components/about/our-commitments';
import { AboutCta } from '@/components/about/about-cta';
import { AboutThemeToggle } from '@/components/about/about-theme-toggle';
import styles from '@/components/about/about.module.css';

export const metadata: Metadata = constructMetadata({
  title: 'About Us — Mission, Vision & Learning Philosophy',
  description:
    'Learn about our mission to make high-quality, intelligent, and personalized medical entrance preparation more accessible to every aspiring future doctor in Nepal.',
  path: '/about',
  image: '/images/og-default.png',
  imageAlt:
    'CEE Medical Prep About Us - Empowering Nepal future medical professionals with intelligent learning and purposeful practice.',
});

function generateAboutJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'AboutPage',
        '@id': 'https://cee.nepal.prep/about#webpage',
        url: 'https://cee.nepal.prep/about',
        name: 'About Nepal CEE Medical Entrance Preparation Platform',
        description:
          'Our mission, vision, learning philosophy, and technology architecture for medical entrance preparation in Nepal.',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://cee.nepal.prep/#website',
          name: 'Nepal CEE Preparation Platform',
          url: 'https://cee.nepal.prep',
        },
      },
      {
        '@type': 'EducationalOrganization',
        '@id': 'https://cee.nepal.prep/#organization',
        name: 'CEE Medical Prep Nepal',
        url: 'https://cee.nepal.prep',
        description:
          'Dedicated to making intelligent, high-yield medical entrance preparation accessible to aspiring doctors across Nepal.',
        areaServed: 'Nepal',
        knowsAbout: [
          'Nepal Medical Education Commission (MEC) CEE',
          'MBBS Entrance Examination Preparation',
          'BDS Entrance Examination Preparation',
          'Pre-Medical Science Curriculum (Zoology, Botany, Chemistry, Physics, MAT)',
        ],
      },
    ],
  };
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ theme?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const isDark = params?.theme === 'dark';
  const jsonLd = generateAboutJsonLd();

  return (
    <article
      id="about-page-root"
      className={`${styles.pageRoot} ${isDark ? 'dark' : ''}`}
      data-theme={isDark ? 'dark' : 'light'}
    >
      {/* Structured Schema Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Floating Interactive Theme Switcher */}
      <AboutThemeToggle />

      {/* Section 1: Cinematic Hero */}
      <AboutHero />

      {/* Section 2: Our Story */}
      <OurStory />

      {/* Section 3: Our Mission */}
      <OurMission />

      {/* Section 4: Our Vision */}
      <OurVision />

      {/* Section 5: What Makes Us Different? */}
      <CoreDifferentiators />

      {/* Section 6: Our Learning Philosophy */}
      <LearningPhilosophy />

      {/* Section 7: Technology With Purpose */}
      <TechnologyPurpose />

      {/* Section 8: Our Commitment */}
      <OurCommitments />

      {/* Section 9: Closing CTA */}
      <AboutCta />
    </article>
  );
}
