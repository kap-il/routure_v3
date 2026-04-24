'use client';

import { type CSSProperties, useRef } from 'react';
import { useViewportProgress } from '../hooks/useViewportProgress';

/**
 * Letter-by-letter text reveal that animates as the element scrolls through
 * the viewport. Characters fade in, unblur, and slide up sequentially between
 * 20% and 60% of viewport progress.
 *
 * Progressive enhancement: the full string is rendered in the initial HTML
 * so crawlers and no-JS visitors see the text immediately.
 * Reduced-motion users get the final state with no animation.
 */
type AssemblyTag = 'span' | 'h1' | 'h2' | 'h3' | 'p' | 'div';

export default function AssemblyText({
  text,
  className = '',
  style,
  as = 'span',
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
  as?: AssemblyTag;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const progress = useViewportProgress(ref);
  const activated = Math.max(0, Math.min(1, (progress - 0.2) / 0.4));
  const chars = Array.from(text);

  const Tag = as as AssemblyTag;

  const children = (
    <>
      {chars.map((c, i) => {
        const localStart = (i / chars.length) * 0.7;
        const localEnd = localStart + 0.3;
        const t = Math.max(0, Math.min(1, (activated - localStart) / (localEnd - localStart)));
        const blur = (1 - t) * 12;
        const translate = (1 - t) * 40;
        return (
          <span
            key={i}
            aria-hidden="true"
            style={{
              display: 'inline-block',
              opacity: t,
              transform: `translateY(${translate}px)`,
              filter: `blur(${blur}px)`,
              whiteSpace: c === ' ' ? 'pre' : 'normal',
            }}
          >
            {c}
          </span>
        );
      })}
    </>
  );

  const common = {
    ref: ref as React.Ref<HTMLElement>,
    className,
    style,
    'aria-label': text,
  };

  if (Tag === 'h1') return <h1 {...(common as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h1>;
  if (Tag === 'h2') return <h2 {...(common as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h2>;
  if (Tag === 'h3') return <h3 {...(common as React.HTMLAttributes<HTMLHeadingElement>)}>{children}</h3>;
  if (Tag === 'p')  return <p  {...(common as React.HTMLAttributes<HTMLParagraphElement>)}>{children}</p>;
  if (Tag === 'div') return <div {...(common as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>;
  return <span {...(common as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>;
}
