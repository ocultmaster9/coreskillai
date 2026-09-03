/* Adversarial check on the mental-rotation generator.
 *
 * The failure that would matter most here is silent and fatal: a figure with an
 * axis of mirror symmetry is ACHIRAL, meaning its mirror image is also one of
 * its own rotations. Use one and the "wrong" options are also correct, the item
 * has no defensible key, and nothing about the page would look broken.
 *
 * So this asserts, over thousands of generated items:
 *   - every stimulus figure is chiral
 *   - no distractor is a rotation of the target (i.e. secretly correct)
 *   - exactly one option is keyed correct, and it really is the target's shape
 *   - six distinct options per item
 *   - the answer key is uniform across the six slots
 *   - difficulty increases through the test
 *
 * Usage: node _build/verify_rotationgen.js [nTests]
 */
const fs = require('fs');
const path = require('path');

const root = {};
new Function('window', fs.readFileSync(path.join(__dirname, '..', 'js', 'tests', 'rotationgen.js'), 'utf8'))(root);
const G = root.RotationGen;
if (!G) { console.log('FAIL: rotationgen.js did not export RotationGen'); process.exit(1); }

const N_TESTS = parseInt(process.argv[2] || '600', 10);
const ITEMS = 20;
const slots = new Array(6).fill(0);
let items = 0, fails = 0, nulls = 0;
const problems = [];
const report = m => { if (problems.length < 10) problems.push(m); fails++; };

for (let s = 1; s <= N_TESTS; s++) {
  const test = G.generateTest(s, ITEMS);
  if (!test) { nulls++; continue; }
  if (test.length !== ITEMS) { report(`seed ${s}: ${test.length} items`); continue; }

  let prev = -Infinity;
  test.forEach((it, idx) => {
    items++;
    const tgt = G.canonical(it.target.cells);
    const mir = G.canonical(G.mirror(it.target.cells));

    if (tgt === mir) report(`seed ${s} item ${idx}: figure is ACHIRAL - mirror equals a rotation`);
    if (!G.isChiral(it.target.cells)) report(`seed ${s} item ${idx}: isChiral() disagrees`);

    if (!(it.ans >= 0 && it.ans < 6)) { report(`seed ${s} item ${idx}: ans ${it.ans}`); return; }
    if (it.options.length !== 6) { report(`seed ${s} item ${idx}: ${it.options.length} options`); return; }
    slots[it.ans]++;

    const flagged = it.options.filter(o => o.correct).length;
    if (flagged !== 1) report(`seed ${s} item ${idx}: ${flagged} options flagged correct`);

    // The keyed option must be the target's own shape...
    if (G.canonical(it.options[it.ans].cells) !== tgt) {
      report(`seed ${s} item ${idx}: keyed option is not the target shape`);
    }
    // ...and no other option may be a rotation of the target.
    it.options.forEach((o, i) => {
      if (i === it.ans) return;
      if (G.canonical(o.cells) === tgt) {
        report(`seed ${s} item ${idx}: distractor ${i} is secretly correct`);
      }
    });

    if (it.difficulty < prev) report(`seed ${s} item ${idx}: difficulty ${it.difficulty} after ${prev}`);
    prev = it.difficulty;
  });
}

console.log(`generated ${items} items across ${N_TESTS} tests` + (nulls ? ` (${nulls} null seeds)` : ''));
if (nulls > N_TESTS * 0.02) { console.log(`FAIL: ${nulls} seeds could not produce a test`); fails++; }

const total = slots.reduce((a, b) => a + b, 0);
const exp = total / 6;
console.log('answer slot distribution: ' + slots.map(c => (100 * c / total).toFixed(2) + '%').join('  '));
const chi2 = slots.reduce((s, c) => s + Math.pow(c - exp, 2) / exp, 0);
console.log('chi-square = ' + chi2.toFixed(2) + ' (5 df, fail above 20.515)');
if (chi2 > 20.515) { console.log('FAIL: answer key is not uniform'); fails++; }

if (problems.length) { console.log('\nfirst problems:'); problems.forEach(p => console.log('  ' + p)); }
console.log(fails ? `\n${fails} FAILURES` : '\nALL CLEAN');
process.exit(fails ? 1 : 0);
