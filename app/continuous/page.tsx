export const metadata = {
  title: 'Routure — Continuous Scroll (Plan C)',
};

// The continuous-scroll experience is the un-ported mockup at
// overhaul/plan-c-extracted/Routure - Continuous Scroll.html — mirrored
// into public/plan-c/ by the prior commit. Render it in a full-viewport
// iframe so /continuous shows the exact file the design doc points at,
// with no porting or interpretation.
export default function ContinuousScroll() {
  const src = '/plan-c/Routure%20-%20Continuous%20Scroll.html';
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
