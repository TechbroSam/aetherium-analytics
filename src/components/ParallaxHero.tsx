// src/components/ParallaxHero.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function ParallaxHero() {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative h-screen w-full overflow-hidden grid place-items-center bg-white dark:bg-black"
    >
      {/* Background with a subtle radial gradient mask */}
      <div className="absolute inset-0 z-0 bg-gray-100 dark:bg-gray-900 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* The animated text content */}
      <motion.div
        style={{ y, opacity }}
        className="z-10 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
          Go Beyond the Charts
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          AI-Powered Insights for the Top 50 Crypto Projects.
        </p>
      </motion.div>
    </section>
  );
}