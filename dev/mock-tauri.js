// Browser-only stand-in for the Tauri shell, for testing the page in a normal browser. Never shipped.
(() => {
  const K = 'mockfs', fs = JSON.parse(localStorage.getItem(K) || '{}');
  const keep = () => localStorage.setItem(K, JSON.stringify(fs));
  const norm = p => p.replace(/\/+/g, '/').replace(/\/$/, '');
  fs['/fixtures/odd guide.md'] = 'Hello there\nProbe: why?\nTip: smile\n## Main (3 min)\nAsk: First?\n## Empty';
  window.__TAURI__ = {
    core: { invoke: async (cmd, a) => { const p = a && a.path && norm(a.path);
      if (cmd === 'read_text') { if (!(p in fs)) throw 'No such file: ' + p; return fs[p]; }
      if (cmd === 'write_text') { fs[p] = a.text; keep(); return; }
      if (cmd === 'exists') return p in fs;
      throw 'unknown command ' + cmd; } },
    dialog: { open: async () => window.MOCK_FILE || '/fixtures/odd guide.md', save: async o => '/mock/exports/' + o.defaultPath },
    path: { appDataDir: async () => '/mock/appdata' },
  };
})();
// #sample-<theme>: open the sample guide mid-interview (used by dev-shots.sh)
if (location.hash.startsWith('#sample')) {
  const [, theme, extra] = location.hash.split('-'); // #sample-<theme>-<all|summary>
  localStorage.setItem('reguide-prefs', JSON.stringify({ theme: theme || 'auto', mode: extra === 'all' ? 'all' : 'focus' }));
  addEventListener('load', () => setTimeout(async () => {
    await openSample(); start('P04'); goLive(1); const t = Date.now();
    Object.assign(X, { started: t - 435000, secTime: { 0: 175000 }, secEnter: t - 260000, enteredAt: 175000, recStart: t - 420000, consent: t - 425000,
      cues: { 0: 2, 1: 2 }, cueAt: { '0.0': 0, '0.1': 40000, '0.2': 95000, '1.0': 175000, '1.1': 232000, '1.2': 380000 },
      secNotes: { 0: 'Agreed to audio, not video.', 1: 'Most weekdays. Flat is small, gets restless by ten. Started after the first lockdown ended.' },
      marks: [{ at: 290000, wall: t - 145000, sec: 1, text: 'Silence makes them check their phone' }, { at: 410000, wall: t - 25000, sec: 1, text: 'Says the employer chose the café' }] });
    view = 1; render(); if (extra === 'summary') summaryModal();
  }, 300));
}
