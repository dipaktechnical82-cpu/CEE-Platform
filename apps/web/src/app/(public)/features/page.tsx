import type { Metadata } from 'next';
import { FeaturesNav } from '@/components/features/features-nav';
import { FeaturesHero } from '@/components/features/features-hero';
import { EcosystemSection } from '@/components/features/ecosystem-diagram';
import { AiIntelligenceSection } from '@/components/features/ai-intelligence-section';
import { LearningSystemSection } from '@/components/features/learning-system-section';
import { ExamSimulatorSection } from '@/components/features/exam-simulator-section';
import { GamificationSection } from '@/components/features/gamification-section';
import { MissionControlSection } from '@/components/features/mission-control-section';
import { CommunitySection } from '@/components/features/community-section';
import { DoctorPathwaySection } from '@/components/features/doctor-pathway-section';
import { FeaturesCtaSection } from '@/components/features/features-cta-section';
import { constructMetadata } from '@/lib/seo';
import styles from '@/components/features/features.module.css';

export const metadata: Metadata = constructMetadata({
  title: 'Platform Features & AI Medical Ecosystem',
  description:
    'Explore Nepal’s premier AI-powered medical entrance preparation ecosystem. From Mistake DNA and AI Personal CEE Mentor to realistic CEE mock examinations, adaptive learning, and merit rank pathways.',
  path: '/features',
  image: '/images/og-default.png',
  imageAlt:
    'CEE Medical Prep for Nepal medical entrance preparation, with a luminous aqua anatomical heart.',
});

function generateFeaturesJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Nepal CEE Medical Prep AI Ecosystem',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any (Web Browser)',
    description:
      'Comprehensive AI-driven medical entrance examination preparation platform for Nepal Common Entrance Examination (CEE) conducted by Medical Education Commission (MEC).',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'NPR',
    },
    featureList: [
      'AI Personal CEE Mentor',
      'Mistake DNA Error Pathology',
      'Adaptive Learning Difficulty Calibration',
      'CEE 180-Minute Exam Simulator with Negative Marking',
      'Explain Like My Teacher 6-Mode Pedagogy',
      'AI Doubt Scanner with Step-by-Step Guidance',
      'Smart Revision Radar Retention Tracking',
      'National Merit Rank Leaderboard',
    ],
  };
}

export default function FeaturesPage() {
  const jsonLd = generateFeaturesJsonLd();

  return (
    <div className={styles.pageRoot}>
      {/* Structured Schema.org Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <FeaturesHero />

      {/* Floating Category Navigation Deck */}
      <FeaturesNav />

      {/* 1. Introduce the Ecosystem */}
      <EcosystemSection />

      {/* 2. AI Intelligence Ecosystem */}
      <AiIntelligenceSection />

      {/* 3. Intelligent Learning System */}
      <LearningSystemSection />

      {/* 4. Realistic CEE Exam Experience */}
      <ExamSimulatorSection />

      {/* 5. Gamified Preparation */}
      <GamificationSection />

      {/* 6. CEE Mission Control */}
      <MissionControlSection />

      {/* 7. Community & Collaborative Learning */}
      <CommunitySection />

      {/* 8. Future Doctor Pathway */}
      <DoctorPathwaySection />

      {/* 9. Premium Final CTA */}
      <FeaturesCtaSection />
    </div>
  );
}
