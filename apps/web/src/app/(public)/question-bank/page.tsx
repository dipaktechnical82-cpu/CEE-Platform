import type { Metadata } from 'next';
import { QuestionBankExperience } from '@/components/question-bank/question-bank-experience';
import { constructMetadata } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'CEE Question Bank — Practice Smarter, Think Like a Future Doctor',
  description:
    'Explore high-yield medical entrance practice questions, understand core concepts with full distractor analysis, and prepare with confidence for the Nepal CEE examination.',
  path: '/question-bank',
  image: '/images/og-default.png',
  imageAlt:
    'Nepal CEE Question Bank — Interactive medical entrance question discovery with distractor analysis and mistake DNA.',
});

export default function QuestionBankPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: 'Nepal CEE Medical Entrance Question Bank & Practice Demo',
    description:
      'Interactive public discovery and practice experience for Nepal Medical Education Commission Common Entrance Examination (CEE), featuring Physics, Chemistry, Botany, and Zoology concept drills.',
    educationalLevel: 'Medical Entrance Preparation',
    learningResourceType: 'Practice Assessment & Question Bank',
    inLanguage: 'en',
    teaches: [
      'Cell Biology & Organelles',
      'Cardiac Electrophysiology & Pacemaker Automaticity',
      'Thermodynamic Ionic Equilibrium',
      'Photoelectric Effect & Quantum Physics',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <QuestionBankExperience />
    </>
  );
}
