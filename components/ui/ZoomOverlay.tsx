'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ZoomOverlayProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ZoomOverlay({ src, alt, onClose }: ZoomOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
        isolation: 'isolate',
      }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          width: '2.5rem',
          height: '2.5rem',
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 10,
        }}
        aria-label="Close zoom"
      >
        <svg style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div
        style={{ padding: '5rem 2rem 3rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={src}
          alt={alt}
          width={1600}
          height={1200}
          style={{
            maxWidth: '88vw',
            maxHeight: '72vh',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
          sizes="88vw"
          quality={90}
          unoptimized={false}
        />
      </div>
    </div>,
    document.body
  );
}
