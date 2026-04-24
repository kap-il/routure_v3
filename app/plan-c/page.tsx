export const metadata = { title: 'Plan C — Preview' };

const variants: Array<{ name: string; href: string; note?: string }> = [
  { name: 'Index (Cosmic, tweaks-enabled)', href: '/plan-c/index.html', note: 'main entry from the bundle' },
  { name: 'Routure Home', href: '/plan-c/Routure%20Home.html' },
  { name: 'Routure — Continuous Scroll', href: '/plan-c/Routure%20-%20Continuous%20Scroll.html' },
  { name: 'Routure Issue View', href: '/plan-c/Routure%20Issue%20View.html' },
  { name: 'Routure Issue View v1', href: '/plan-c/Routure%20Issue%20View%20v1.html' },
  { name: 'Shoot', href: '/plan-c/shoot.html' },
];

export default function PlanCIndex() {
  return (
    <main style={{ padding: '64px 32px', fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '0 auto' }}>
      <p style={{ fontSize: 11, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#999', margin: 0 }}>
        Preview
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 48, margin: '12px 0 24px' }}>Plan C</h1>
      <p style={{ color: '#555', lineHeight: 1.55, marginBottom: 40 }}>
        Raw design bundle from <code>overhaul/Plan-C.zip</code>, served out of <code>public/plan-c/</code>. Not ported to the app —
        each file loads React + Babel from unpkg and renders in-browser.
      </p>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {variants.map((v) => (
          <li key={v.href} style={{ padding: '14px 0', borderTop: '1px solid #eaeaea' }}>
            <a href={v.href} style={{ color: '#111', textDecoration: 'none' }}>
              <span style={{ fontFamily: 'Georgia, serif', fontSize: 20 }}>{v.name}</span>
              {v.note && <span style={{ marginLeft: 10, fontSize: 12, color: '#999' }}>— {v.note}</span>}
              <span style={{ float: 'right', color: '#999' }}>→</span>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
