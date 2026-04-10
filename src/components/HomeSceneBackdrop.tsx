import { motion } from 'framer-motion';
import type { HomeScene } from '@/lib/types';

type HomeBackdropTheme = 'morning' | 'evening' | 'free';

interface HomeSceneBackdropProps {
  scene: HomeScene;
  theme: HomeBackdropTheme;
}

const sceneStyles: Record<HomeScene, { sky: string; ground: string; paper: string }> = {
  bike: {
    sky: 'from-sky-100 via-sky-50 to-emerald-50',
    ground: 'from-emerald-200/80 via-emerald-300/70 to-emerald-400/50',
    paper: 'bg-white/20',
  },
  school: {
    sky: 'from-slate-50 via-blue-50 to-indigo-50',
    ground: 'from-violet-100/80 via-pink-100/70 to-amber-100/60',
    paper: 'bg-white/20',
  },
  kite: {
    sky: 'from-sky-100 via-cyan-50 to-blue-100',
    ground: 'from-emerald-100/80 via-lime-100/70 to-yellow-100/60',
    paper: 'bg-white/20',
  },
  sandcastle: {
    sky: 'from-sky-100 via-sky-50 to-amber-50',
    ground: 'from-amber-100/90 via-amber-200/80 to-sky-200/45',
    paper: 'bg-white/20',
  },
};

const themeOverlay: Record<HomeBackdropTheme, string> = {
  morning: 'from-yellow-200/45 via-transparent to-emerald-100/15',
  evening: 'from-slate-900/15 via-transparent to-indigo-950/25',
  free: 'from-white/20 via-transparent to-white/10',
};

const SceneArt = ({ scene }: { scene: HomeScene }) => {
  if (scene === 'bike') {
    return (
      <>
        <div className="absolute left-5 top-10 h-14 w-14 rounded-full bg-yellow-300/70 blur-[2px] sm:left-8 sm:top-14 sm:h-20 sm:w-20" />
        <div className="absolute left-6 top-7 h-12 w-12 rounded-full border-4 border-white/85 bg-white/35 sm:left-10 sm:top-10 sm:h-[4.5rem] sm:w-[4.5rem] sm:border-[6px]" />
        <div className="absolute left-12 bottom-20 h-14 w-14 rounded-full border-4 border-sky-600 bg-white/60 sm:left-28 sm:bottom-24 sm:h-20 sm:w-20 sm:border-[6px]" />
        <div className="absolute left-[6.2rem] bottom-20 h-14 w-14 rounded-full border-4 border-sky-600 bg-white/60 sm:left-[13rem] sm:bottom-24 sm:h-20 sm:w-20 sm:border-[6px]" />
        <div className="absolute left-[4.6rem] bottom-[5.7rem] h-2.5 w-20 rotate-[17deg] rounded-full bg-sky-700 sm:left-[8.9rem] sm:bottom-[7.1rem] sm:h-3 sm:w-28" />
        <div className="absolute left-[5.3rem] bottom-[6.6rem] h-2.5 w-12 rotate-[63deg] rounded-full bg-sky-700 sm:left-[9.7rem] sm:bottom-[8.3rem] sm:h-3 sm:w-16" />
        <div className="absolute left-[6.9rem] bottom-[6.5rem] h-2.5 w-12 -rotate-[48deg] rounded-full bg-sky-700 sm:left-[11.8rem] sm:bottom-[8.2rem] sm:h-3 sm:w-16" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,transparent,rgba(16,185,129,0.18))]" />
        <div className="absolute bottom-8 right-6 text-5xl opacity-30 sm:right-14 sm:bottom-10 sm:text-6xl sm:opacity-40">🌳</div>
        <div className="absolute left-20 top-20 text-2xl opacity-60 sm:left-28 sm:top-24 sm:text-3xl sm:opacity-70">🐦</div>
        <div className="absolute right-14 top-12 text-xl opacity-55 sm:right-32 sm:top-[4.5rem] sm:text-2xl sm:opacity-60">☁️</div>
      </>
    );
  }

  if (scene === 'school') {
    return (
      <>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_95%,rgba(125,211,252,0.16)_95%)] bg-[length:100%_2.25rem] opacity-80" />
        <div className="absolute left-10 top-12 h-24 w-[4.5rem] rotate-[-8deg] rounded-[10px] border-4 border-emerald-500 bg-emerald-200/80 shadow-[0_10px_0_rgba(16,185,129,0.12)]" />
        <div className="absolute left-[4.25rem] top-[4.5rem] h-24 w-[4.5rem] rotate-[8deg] rounded-[10px] border-4 border-orange-500 bg-orange-200/80 shadow-[0_10px_0_rgba(249,115,22,0.12)]" />
        <div className="absolute left-[6.5rem] top-8 h-24 w-[4.5rem] rotate-[5deg] rounded-[10px] border-4 border-sky-500 bg-sky-200/80 shadow-[0_10px_0_rgba(59,130,246,0.12)]" />
        <div className="absolute right-12 top-10 text-4xl text-yellow-400/80 sm:right-24 sm:top-14 sm:text-6xl">★</div>
        <div className="absolute bottom-16 right-16 text-4xl text-pink-400/75 sm:right-32 sm:text-5xl">✿</div>
        <div className="absolute left-1/2 bottom-12 h-3 w-40 -translate-x-1/2 rounded-full bg-violet-300/70" />
        <div className="absolute bottom-20 left-10 text-2xl opacity-60 sm:left-14 sm:text-3xl">✎</div>
      </>
    );
  }

  if (scene === 'kite') {
    return (
      <>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(191,219,254,0.6),transparent_55%),linear-gradient(180deg,rgba(255,255,255,0.5),transparent_45%)]" />
        <div className="absolute left-10 bottom-10 h-20 w-20 rounded-full bg-emerald-300/50 blur-2xl" />
        <div className="absolute right-8 top-10 h-20 w-20 rotate-[8deg] border-4 border-violet-500 bg-violet-200/70 [clip-path:polygon(50%_0%,100%_50%,50%_100%,0%_50%)] sm:right-24 sm:top-12 sm:h-28 sm:w-28" />
        <div className="absolute right-[3.9rem] top-10 h-20 w-[3px] rotate-[38deg] bg-sky-500 sm:right-[7.1rem] sm:top-12 sm:h-28" />
        <div className="absolute right-16 top-28 text-5xl text-sky-500/70 sm:right-36 sm:top-40 sm:text-6xl">~</div>
        <div className="absolute right-10 top-36 text-5xl text-sky-500/70 sm:right-28 sm:top-48 sm:text-6xl">~</div>
        <div className="absolute left-20 bottom-16 h-4 w-44 rounded-full bg-emerald-300/60" />
      </>
    );
  }

  return (
    <>
      <div className="absolute inset-x-0 bottom-0 h-24 bg-sky-300/40" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-amber-200/90" />
      <div className="absolute left-20 bottom-12 h-20 w-20 rounded-t-[1.8rem] border-4 border-amber-600 bg-amber-300" />
      <div className="absolute left-36 bottom-12 h-24 w-16 rounded-t-[1.6rem] border-4 border-amber-600 bg-amber-300" />
      <div className="absolute left-[6.8rem] bottom-32 h-4 w-10 rounded-full bg-amber-600" />
      <div className="absolute left-[9.8rem] bottom-36 h-4 w-8 rounded-full bg-amber-600" />
      <div className="absolute right-12 top-10 h-16 w-16 rounded-full bg-red-300/80 [clip-path:polygon(0_100%,50%_0,100%_100%)] sm:right-24 sm:top-12 sm:h-20 sm:w-20" />
      <div className="absolute right-4 top-10 h-16 w-16 rounded-full bg-yellow-200/85 [clip-path:polygon(0_100%,50%_0,100%_100%)] sm:right-14 sm:top-12 sm:h-20 sm:w-20" />
      <div className="absolute right-12 top-24 h-16 w-1 rotate-[8deg] bg-amber-700 sm:right-24 sm:top-28 sm:h-20" />
      <div className="absolute bottom-12 right-5 text-3xl opacity-70 sm:right-10 sm:text-4xl">🌊</div>
    </>
  );
};

export const HomeSceneBackdrop = ({ scene, theme }: HomeSceneBackdropProps) => {
  const styles = sceneStyles[scene];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px] sm:rounded-[36px] md:rounded-[44px]">
      <div className={`absolute inset-0 bg-gradient-to-b ${styles.sky}`} />
      <div className={`absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t ${styles.ground}`} />
      <div className={`absolute inset-0 bg-gradient-to-b ${themeOverlay[theme]}`} />
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`absolute inset-0 opacity-95 ${styles.paper}`}
      />
      <div className="absolute inset-0">
        <SceneArt scene={scene} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_45%)] opacity-75" />
    </div>
  );
};
