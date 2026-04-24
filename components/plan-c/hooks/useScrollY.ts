'use client';

import { useEffect, useState } from 'react';

export function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf: number | null = null;
    const update = () => {
      setY(window.scrollY);
      raf = null;
    };
    const onScroll = () => {
      if (raf == null) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, []);
  return y;
}
