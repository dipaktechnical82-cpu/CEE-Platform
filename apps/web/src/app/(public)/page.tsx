import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { ExamArena } from '@/components/landing/exam-arena';
import { FinalCtaSection } from '@/components/landing/final-cta';
import { FutureDashboard } from '@/components/landing/future-dashboard';
import { HeroBackground } from '@/components/landing/hero-background';
import { IntelligenceHub } from '@/components/landing/intelligence-hub';
import { JourneyBegins } from '@/components/landing/journey-begins';
import { ProgressObservatory } from '@/components/landing/progress-observatory';
import { constructMetadata, generateExamJsonLd } from '@/lib/seo';

export const metadata: Metadata = constructMetadata({
  title: 'Nepal CEE Medical Prep',
  description:
    'Your Journey to Medical School Starts Here. Prepare for Nepal medical entrance with focused guidance and smart practice.',
  path: '/',
  image: '/images/og-default.png',
  imageAlt:
    'CEE Medical Prep for Nepal medical entrance preparation, with a luminous aqua anatomical heart.',
});

export default function HomePage() {
  const jsonLd = generateExamJsonLd();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-[#071b21]">
        <HeroBackground />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,20,27,0.50)_0%,rgba(4,20,27,0.52)_48%,rgba(4,20,27,0.72)_100%)] md:bg-[linear-gradient(90deg,rgba(4,20,27,0.82)_0%,rgba(4,20,27,0.66)_42%,rgba(4,20,27,0.12)_100%)]"
        />

        <Container className="relative z-10 py-32 sm:py-36 lg:py-40">
          <div className="max-w-2xl">
            <div className="relative top-3 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.02em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md sm:text-sm">
              Nepal&apos;s Premier Medical Entrance Platform
            </div>

            <h1
              id="hero-heading"
              className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-[-0.055em] text-white sm:text-5xl lg:text-[4.25rem] lg:leading-[1.04]"
            >
              Your Journey to Medical School Starts Here.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8">
              Prepare for Nepal&apos;s medical entrance examination with structured learning,
              focused practice, and intelligent learning assistance.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#1ec5b2] to-[#0a92a8] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(14,134,149,0.32)] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26b7b1]"
              >
                Start Preparing
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center rounded-full border border-white/50 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.12)] backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ad5c7]"
              >
                Explore Platform
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <JourneyBegins />
      <IntelligenceHub />
      <FutureDashboard />
      <ExamArena />
      <ProgressObservatory />
      <FinalCtaSection />
    </>
  );
}
