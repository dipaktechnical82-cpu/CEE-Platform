import { Container } from '@/components/ui/container';

export default function SyllabusLoading() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div
          aria-live="polite"
          className="mx-auto max-w-4xl rounded-2xl border border-[#D5F3E8] bg-white p-5 text-sm text-[#557177] sm:p-6"
        >
          Loading published curriculum…
        </div>
      </Container>
    </div>
  );
}
