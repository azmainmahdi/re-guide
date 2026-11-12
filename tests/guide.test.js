// Run: node tests/guide.test.js
const assert = require('assert');
const GX = require('../build/guide.js');

let g = GX.read(`# Cafés
## Welcome (2 min)
Say: Thanks for joining.
Say: I will record audio. Is that OK?
## Getting started (5 minutes)
Ask: How often do you work from cafés?
- ask: What made you start?
  Probe: What was work like before?
which part did you miss most?
Note: Skip the probe if they said it.
## Wrap-up [3m]
1. Q: Anything I should have asked?`);
assert.equal(g.title, 'Cafés');
assert.deepEqual(g.sections.map(s => [s.title, s.minutes]), [['Welcome', 2], ['Getting started', 5], ['Wrap-up', 3]]);
assert.equal(g.asks, 3);
assert.equal(g.planned, 10);
const gs = g.sections[1].items;
assert.deepEqual(gs.map(i => i.k), ['ask', 'ask', 'note']);
assert.equal(gs[1].probes[0].text, 'What was work like before?\nwhich part did you miss most?');
assert.equal(g.sections[2].items[0].n, 3);
assert.equal(g.warnings.length, 0, g.warnings.join(' | '));

// no title, no sections, stray text, unknown word, lonely probe, empty section, empty keyword
g = GX.read(`Hello there
Probe: why?
Tip: smile
Ask:
## Empty`, 'My guide.md');
assert.equal(g.title, 'My guide');
assert.equal(g.sections[0].title, 'Start');
assert.deepEqual(g.sections[0].items.map(i => i.k), ['note', 'probe', 'note', 'ask']);
const w = g.warnings.join(' | ');
for (const bit of ['no word in front', 'Probe with no Ask', '"Tip:"', 'no words after', '"Empty" is empty']) assert.ok(w.includes(bit), bit);

assert.ok(GX.read('').warnings[0].includes('Nothing was found'));
assert.ok(GX.read('## A\nSay: hi').warnings.some(x => x.includes('No questions')));
console.log('guide tests passed');

// cues: one per Say/Ask; a note goes with the cue above, notes before the first cue with the first, a stray probe with the cue above
{
  const c = GX.cues(GX.read(`## A
Note: before
Say: hi
Note: after hi
Ask: one?
Probe: why?
Note: about the probe`).sections[0]);
  assert.deepEqual(c.map(x => x.main.k), ['say', 'ask']);
  assert.equal(c[0].before[0].text, 'before');
  assert.equal(c[0].after[0].text, 'after hi');
  assert.deepEqual(c[1].main.probes.map(p => p.text), ['why?']);
  assert.equal(c[1].after[0].text, 'about the probe');
  const only = GX.cues(GX.read(`## B\nNote: just a note`).sections[0]);
  assert.equal(only.length, 1); assert.equal(only[0].main, null);
}
console.log('cue tests passed');
