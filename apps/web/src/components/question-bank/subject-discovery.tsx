import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Atom,
  ChevronRight,
  Dna,
  FlaskConical,
  Leaf,
  Microscope,
} from 'lucide-react';
import { Container } from '@/components/ui/container';

export interface SubjectDiscoveryProps {
  onSelectSubject?: (subject: 'Physics' | 'Chemistry' | 'Botany' | 'Zoology') => void;
}

const subjectsData = [
  {
    id: 'botany',
    subjectKey: 'Botany' as const,
    name: 'Botany',
    subTitle: 'Plant Biology & Cellular Systems',
    description:
      'Explore cell structure, plant anatomy, photosynthetic bioenergetics, genetics, ecology, and plant physiological transport.',
    badge: 'Illustrative Preview',
    topics: ['Cytology & Cell Division', 'Photosynthesis (Z-Scheme)', 'Mendelian Genetics', 'Plant Water Relations'],
    accentBorder: 'hover:border-emerald-300 dark:hover:border-emerald-500/50',
    iconBg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
    tagBg: 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200',
    icon: Leaf,
    weightNote: 'Proposed Category: ~40 CEE Marks',
  },
  {
    id: 'zoology',
    subjectKey: 'Zoology' as const,
    name: 'Zoology',
    subTitle: 'Animal Diversity & Human Physiology',
    description:
      'Master clinical human physiology, cardiovascular electrophysiology, neurobiology, histology, and evolutionary animal adaptations.',
    badge: 'Illustrative Preview',
    topics: ['Cardiac Conduction & ECG', 'Renal Countercurrent Mechanism', 'Endocrine Feedback', 'Gametogenesis & Embryology'],
    accentBorder: 'hover:border-[#7367F0]/40 dark:hover:border-[#7367F0]/50',
    iconBg: 'bg-indigo-50 text-indigo-700 dark:bg-[#131D45] dark:text-[#A9E6DD]',
    tagBg: 'bg-indigo-100/70 text-indigo-900 dark:bg-[#131D45] dark:text-[#B8DFF4]',
    icon: Dna,
    weightNote: 'Proposed Category: ~40 CEE Marks',
  },
  {
    id: 'chemistry',
    subjectKey: 'Chemistry' as const,
    name: 'Chemistry',
    subTitle: 'Physical, Organic & Inorganic Sciences',
    description:
      'Drill thermodynamic equilibrium, organic reaction mechanisms, ionic buffers, coordination compounds, and periodic trends.',
    badge: 'Illustrative Preview',
    topics: ['Ionic Equilibrium & Buffers', 'Reaction Kinetics & Catalysis', 'Aldehydes, Ketones & Amines', 'Coordination Complexes'],
    accentBorder: 'hover:border-[#167A80] dark:hover:border-[#A9E6DD]/40',
    iconBg: 'bg-teal-50 text-[#167A80] dark:bg-teal-950/50 dark:text-[#A9E6DD]',
    tagBg: 'bg-teal-100/70 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200',
    icon: FlaskConical,
    weightNote: 'Proposed Category: ~50 CEE Marks',
  },
  {
    id: 'physics',
    subjectKey: 'Physics' as const,
    name: 'Physics',
    subTitle: 'Mechanics, Electromagnetism & Modern Physics',
    description:
      'Sharpen problem-solving in kinematics, fluid dynamics, wave optics, circuit analysis, and quantum photoelectric phenomena.',
    badge: 'Illustrative Preview',
    topics: ['Photoelectric Effect & Photons', 'Ray & Wave Optics', 'DC Circuits & Kirchhoff Laws', 'Thermodynamics & Heat Cycles'],
    accentBorder: 'hover:border-sky-300 dark:hover:border-sky-500/50',
    iconBg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300',
    tagBg: 'bg-sky-100/70 text-sky-900 dark:bg-sky-950/60 dark:text-sky-200',
    icon: Atom,
    weightNote: 'Proposed Category: ~50 CEE Marks',
  },
];

export function SubjectDiscovery({ onSelectSubject }: SubjectDiscoveryProps) {
  return (
    <section
      id="explore-subjects"
      className="border-b border-[#D5F3E8] bg-[#F5FBFA] py-16 dark:border-white/10 dark:bg-[#07171D] sm:py-24"
    >
      <Container>
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#A9E6DD] bg-white px-3 py-1 text-xs font-semibold text-[#167A80] dark:border-white/10 dark:bg-[#101A3C] dark:text-[#A9E6DD]">
              <Microscope size={14} />
              EXPLORATORY CURRICULUM PREVIEW
            </div>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#244A50] dark:text-[#F5FBFA] sm:text-4xl">
              Explore High-Yield Subject Streams
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#3D6870] dark:text-[#A9B8D0] sm:text-base">
              Navigate medical entrance disciplines structured for concept mastery. These proposed
              categories represent illustrative study streams while official MEC syllabus publication
              is pending faculty verification.
            </p>
          </div>

          <Link
            href="#topic-filters"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#167A80] hover:underline dark:text-[#A9E6DD]"
          >
            Jump to Interactive Filter Experience
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Subjects Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {subjectsData.map((subj) => {
            const Icon = subj.icon;
            return (
              <div
                key={subj.id}
                className={`group flex flex-col justify-between rounded-2xl border border-[#D5F3E8] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#101A3C] ${subj.accentBorder}`}
              >
                <div>
                  {/* Top Bar with Icon & Status Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${subj.iconBg}`}
                    >
                      <Icon size={24} />
                    </div>
                    <span className="rounded-full bg-[#D5F3E8] px-2 py-0.5 text-[10px] font-bold text-[#244A50] dark:bg-[#131D45] dark:text-[#A9E6DD]">
                      {subj.badge}
                    </span>
                  </div>

                  {/* Subject Name and Subtitle */}
                  <h3 className="mt-4 text-xl font-bold text-[#244A50] dark:text-[#F5FBFA]">
                    {subj.name}
                  </h3>
                  <p className="text-xs font-semibold text-[#167A80] dark:text-[#A9E6DD]">
                    {subj.subTitle}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-[#3D6870] dark:text-[#A9B8D0]">
                    {subj.description}
                  </p>

                  {/* Key Sample Concepts */}
                  <div className="mt-4 border-t border-[#E5F1EF] pt-3 dark:border-white/10">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#5E848C] dark:text-[#7E8DAA]">
                      Sample High-Yield Topics:
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {subj.topics.map((t) => (
                        <li
                          key={t}
                          className="flex items-center gap-1.5 text-xs text-[#244A50] dark:text-[#D5F3E8]"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-[#167A80] dark:bg-[#A9E6DD]" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer Action and Weight Note */}
                <div className="mt-6 border-t border-[#E5F1EF] pt-4 dark:border-white/10">
                  <p className="text-[10px] text-[#71898D] dark:text-[#7E8DAA]">{subj.weightNote}</p>
                  <a
                    href="#topic-filters"
                    onClick={() => onSelectSubject?.(subj.subjectKey)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#A9E6DD] bg-[#F5FBFA] py-2.5 text-xs font-bold text-[#244A50] transition-colors hover:border-[#167A80] hover:bg-[#D5F3E8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#167A80] dark:border-white/10 dark:bg-[#131D45] dark:text-[#F5FBFA] dark:hover:bg-[#15224D]"
                  >
                    <span>Explore {subj.name} Topics</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Context Disclaimer */}
        <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
          <p>
            <strong className="font-semibold">Curriculum Verification Status:</strong> The four
            subjects above represent the traditional medical entrance core areas used for UI
            discovery and sample demonstration. Official MEC syllabus alignment is governed by the
            curriculum audit pipeline, and verified version records are tracked on our{' '}
            <Link
              href="/syllabus"
              className="font-semibold underline underline-offset-2 hover:text-amber-800 dark:hover:text-amber-100"
            >
              Curriculum &amp; Syllabus page
            </Link>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}
