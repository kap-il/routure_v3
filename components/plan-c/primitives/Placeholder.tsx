import type { CSSProperties } from 'react';

/**
 * Named-palette placeholder tile (stripe + gradient). The continuous-scroll
 * preview uses these everywhere because real shoot imagery isn't wired in
 * yet — this is the "wtf does it look like" pass.
 */
export default function Placeholder({
  palette = 'p-clay',
  label,
  corner = 'bl',
  className = '',
  style,
}: {
  palette?: string;
  label?: string;
  corner?: 'bl' | 'br' | 'tl' | 'tr';
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`ph ${palette} ${className}`} style={style}>
      {label && <span className={`ph-label ${corner === 'tr' ? 'tr' : ''}`}>{label}</span>}
    </div>
  );
}
