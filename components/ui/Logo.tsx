interface LogoProps {
  className?: string;
  variant?: 'full' | 'monogram';
  color?: 'black' | 'white';
}

export function Logo({ className = '', variant = 'full', color = 'black' }: LogoProps) {
  const fillColor = color === 'black' ? '#000000' : '#ffffff';

  if (variant === 'monogram') {
    return (
      <svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Routure"
      >
        <path
          d="M25 10 Q10 10 10 30 Q10 50 25 55 Q10 60 10 80 Q10 100 30 110 L40 95 Q25 90 25 75 Q25 60 45 55 L75 55 Q90 55 90 35 Q90 10 60 10 L25 10 Z M40 25 L60 25 Q70 25 70 35 Q70 45 60 45 L40 45 Z"
          fill={fillColor}
        />
        <path
          d="M55 60 L55 110 L75 110 L75 75 L85 75 Q95 90 100 110 L120 110 Q110 85 100 70 Q110 65 110 55"
          fill={fillColor}
          transform="translate(-30, 0) scale(0.8)"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 400 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Routure"
    >
      {/* Stylized R Monogram */}
      <g transform="translate(0, 5)">
        <path
          d="M5 5 Q0 15 5 25 Q10 35 20 40 L10 50 Q0 45 0 30 Q0 10 15 5 Z"
          fill={fillColor}
        />
        <path
          d="M15 0 Q35 0 40 15 Q45 30 30 40 L45 55 L35 55 L20 38 Q35 32 32 18 Q30 8 18 8 L10 8 L10 0 Z"
          fill={fillColor}
        />
      </g>

      {/* ROUTURE Text */}
      <text
        x="60"
        y="45"
        fontFamily="Georgia, serif"
        fontSize="42"
        fontWeight="400"
        letterSpacing="8"
        fill={fillColor}
      >
        ROUTURE
      </text>
    </svg>
  );
}

export function LogoMark({ className = '', color = 'black' }: Omit<LogoProps, 'variant'>) {
  const fillColor = color === 'black' ? '#000000' : '#ffffff';

  return (
    <svg
      viewBox="0 0 50 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Routure"
    >
      <path
        d="M5 5 Q0 15 5 25 Q10 35 20 40 L10 50 Q0 45 0 30 Q0 10 15 5 Z"
        fill={fillColor}
      />
      <path
        d="M15 0 Q35 0 40 15 Q45 30 30 40 L45 55 L35 55 L20 38 Q35 32 32 18 Q30 8 18 8 L10 8 L10 0 Z"
        fill={fillColor}
      />
    </svg>
  );
}
