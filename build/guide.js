/* ---------- guide reader: a plain-text interview guide -> sections and lines, by rules only ----------
   The Re;Guide format (docs/guide-format.md):
     # Title                     optional; the file name is used if missing
     ## Section (5 min)          starts a section; minutes optional, they turn on that section's clock
     Say: read this aloud        e.g. a welcome or consent line
     Ask: a question?            numbered through the guide; its time is logged when you mark it asked
     Probe: a follow-up          belongs to the Ask above it
     Note: only you see this
   A line with no word in front joins the line above, so wrapped text stays together. Nothing is dropped. */
const GX = (() => {
  const KIND = { say: 'say', ask: 'ask', q: 'ask', question: 'ask', probe: 'probe', 'follow-up': 'probe', followup: 'probe', note: 'note' };
  const MIN = /\s*[\[(]\s*(\d+(?:\.\d+)?)\s*(?:m|min|mins|minute|minutes)\.?\s*[\])]\s*$/i;

  function read(raw, fileName = '') {
    const text = String(raw).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
    const warn = [];
    let title = '', n = 0;
    const sections = [];
    let sec = null, last = null, lastAsk = null;
    const need = () => { if (!sec) { sec = { title: 'Start', minutes: null, items: [] }; sections.push(sec); } return sec; };

    text.split('\n').forEach((line0, li) => {
      const at = li + 1;
      let line = line0.trim();
      if (!line || /^(-{3,}|\*{3,}|_{3,})$/.test(line)) return;
      const h = line.match(/^(#{1,6})\s+(.+?)\s*#*$/);
      if (h) {
        if (h[1].length === 1 && !title && !sections.length) { title = h[2].replace(/\*+/g, '').trim(); return; }
        const m = h[2].match(MIN);
        sec = { title: h[2].replace(MIN, '').replace(/\*+/g, '').trim() || 'Untitled section', minutes: m ? +m[1] : null, items: [], line: at };
        sections.push(sec); last = null; lastAsk = null;
        return;
      }
      line = line.replace(/^(?:[-*•]|\d+[.)])\s+/, '');                    // list markers
      const k = line.match(/^\*{0,2}([A-Za-z-]{1,15})\s*:\*{0,2}\s*(.*)$/);  // Word: text
      const kind = k && KIND[k[1].toLowerCase()];
      if (kind) {
        const s = need(), item = { k: kind, text: k[2].trim(), line: at };
        if (kind === 'ask') { item.n = ++n; item.probes = []; s.items.push(item); lastAsk = item; }
        else if (kind === 'probe' && lastAsk) lastAsk.probes.push(item);
        else { if (kind === 'probe') warn.push(`Line ${at}: a Probe with no Ask above it in "${s.title}". It is shown on its own.`); s.items.push(item); }
        if (!item.text) warn.push(`Line ${at}: "${k[1]}:" has no words after it.`);
        last = item;
        return;
      }
      if (k && /^[A-Z][a-z]+$/.test(k[1]) && k[2]) {                   // "Tip: ..." : unknown word, kept private and flagged
        last = { k: 'note', text: line, line: at }; need().items.push(last);
        warn.push(`Line ${at}: "${k[1]}:" is not a word Re;Guide knows (Say, Ask, Probe, Note), so it was kept as a note.`);
        return;
      }
      if (last) { last.text += (last.text ? '\n' : '') + line; return; }
      last = { k: 'note', text: line, line: at }; need().items.push(last);
      warn.push(`Line ${at} has no word in front (Say, Ask, Probe, Note), so it was kept as a note.`);
    });

    sections.forEach(s => { if (!s.items.length) warn.push(`Section "${s.title}" is empty.`); });
    if (!sections.length) warn.push('Nothing was found in this file. Lines should start with Say:, Ask:, Probe: or Note:.');
    else if (!n) warn.push('No questions were found. Questions start with Ask:.');
    const planned = sections.reduce((a, s) => a + (s.minutes || 0), 0);
    return { title: title || fileName.replace(/\.[^.]+$/, '') || 'Interview guide', sections, asks: n, planned, warnings: warn };
  }
  // A section as cues: one Say or Ask each, read one at a time. A Note goes with the cue above it,
  // so it sits beside what it is about; Notes before the first cue go with the first one. A stray Probe goes with the cue above.
  function cues(section) {
    const out = [];
    let lead = [];
    for (const it of section.items) {
      const prev = out[out.length - 1];
      if ((it.k === 'note' || it.k === 'probe') && prev) { prev.after.push(it); continue; }
      if (it.k === 'note') { lead.push(it); continue; }
      out.push({ main: it, before: lead, after: [] }); lead = [];
    }
    if (lead.length) out.push({ main: null, before: lead, after: [] });
    return out;
  }
  return { read, cues };
})();
if (typeof module !== 'undefined') module.exports = GX;
