export const metadata = {
  title: 'Routure — Continuous Scroll (Plan C)',
};

// The continuous-scroll experience is the un-ported mockup at
// overhaul/plan-c-extracted/Routure - Continuous Scroll.html — mirrored
// into public/plan-c/ by the prior commit. Render it in a full-viewport
// iframe so /continuous shows the exact file the design doc points at,
// with no porting or interpretation.
export default function ContinuousScroll() {
  // Stitched file renders all 17 panels vertically for a real continuous
  // scroll (vs the design-canvas arrangement in "Routure - Continuous
  // Scroll.html"). Source lives in public/plan-c/continuous-stitched.html.
  const src = '/plan-c/continuous-stitched.html';
  return (
    <iframe
      title="Routure — Continuous Scroll"
      src={src}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 0,
        background: '#111',
        zIndex: 40,
      }}
    />
  );
}
