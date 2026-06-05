// Black full-screen while the issues route loads, so the GridFlipReveal intro
// runs over an unbroken black bg — no white flash or skeleton artifacts.
export default function IssuesLoading() {
  return <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#000' }} />;
}
