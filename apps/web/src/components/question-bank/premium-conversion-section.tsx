import React from 'react';
import Link from 'next/link';
import { ArrowRight, HeartPulse, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/container';

export function PremiumConversionSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-b from-[#244A50] via-[#1a383d] to-[#162f33] py-20 text-white dark:from-[#060A18] dark:via-[#0A1128] dark:to-[#07171D] sm:py-28">
      {/* Background radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-[#1ec5b2]/20 via-[#B8DFF4]/20 to-transparent blur-3xl dark:from-[#7367F0]/20 dark:via-[#167A80]/20"
      />

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#A9E6DD] backdrop-blur-md dark:border-white/10 dark:text-[#B8DFF4]">
            <HeartPulse size={14} className="text-[#A9E6DD]" />
            YOUR NEXT STEP STARTS HERE
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Every Question Is an Opportunity to Improve.
          </h2>

          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">
            Build your understanding one question at a time and move closer to your medical school
            dream. Join aspirants preparing with intelligent analytics and faculty-crafted CEE
            pedagogy.
          </p>

          {/* Action Buttons */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#1ec5b2] to-[#0a92a8] px-7 py-4 text-sm font-bold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:from-[#22d3ee] hover:to-[#0ea5e9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee]"
            >
              Start Your Preparation
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8DFF4]"
            >
              <Sparkles size={16} className="text-[#A9E6DD]" />
              Explore Features
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 grid grid-cols-2 gap-4 border-t border-white/15 pt-8 text-left sm:grid-cols-4">
            <div>
              <p className="text-xl font-bold text-[#A9E6DD]">200 Marks</p>
              <p className="text-xs text-white/70">CEE Exam Weight Specification</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#B8DFF4]">180 Mins</p>
              <p className="text-xs text-white/70">Authentic Time Pressure Simulation</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#A9E6DD]">+1.0 / -0.25</p>
              <p className="text-xs text-white/70">True CEE Marking Protocol</p>
            </div>
            <div>
              <p className="text-xl font-bold text-[#B8DFF4]">4 Disciplines</p>
              <p className="text-xs text-white/70">Physics, Chemistry, Botany, Zoology</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
