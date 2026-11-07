'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function HeroBackground() {
  const [shouldPlayVideo, setShouldPlayVideo] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateVideoPreference = () =>
      setShouldPlayVideo(!motionPreference.matches && window.innerWidth >= 768);

    updateVideoPreference();
    motionPreference.addEventListener('change', updateVideoPreference);
    window.addEventListener('resize', updateVideoPreference);
    return () => {
      motionPreference.removeEventListener('change', updateVideoPreference);
      window.removeEventListener('resize', updateVideoPreference);
    };
  }, []);

  return (
    <>
      <Image
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        fill
        loading="eager"
        sizes="100vw"
        src="/Media/home-poster.svg"
      />
      {shouldPlayVideo && (
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] motion-reduce:hidden sm:object-[60%_center] lg:object-center"
          loop
          muted
          playsInline
          poster="/Media/home-poster.svg"
          preload="metadata"
        >
          <source src="/Media/home.mp4" type="video/mp4" />
        </video>
      )}
    </>
  );
}
