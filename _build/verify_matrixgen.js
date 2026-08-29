/* Adversarial check on the matrix item generator.
 *
 * The old IQ test shipped an answer key where slot 1 was correct on 9 of 10
 * matrix items, and nothing in the build caught it. A generator is only an
 * improvement if something actually proves the key is uniform, so this runs
 * thousands of tests and fails the build on any of:
 *
 *   - an item where the keyed answer is not among the options
 *   - duplicate options within an item (makes two slots equally "right")
 *   - an option identical to a cell already visible in the matrix, other than
 *     the deliberate repetition distractors
 *   - a non-uniform answer-key distribution across the 6 slots
 *   - items not ordered by ascending difficulty
 *
 * Usage: node _build/verify_matrixgen.js [nTests]
 */
const fs = require('fs');
const path = require('path');

const root = {};
new Function('window', fs.readFileSync(path.join(__dirname, '..', 'js', 'tests', 'matrixgen.js'), 'utf8'))(root);
const G = root.MatrixGen;
if (!G) { console.log('FAIL: matrixgen.js did not export MatrixGen'); process.exit(1); }

const N_TESTS = parseInt(process.argv[2] || '2000', 10);
const ITEMS = 36;
const slotCounts = new Array(6).fill(0);
let items = 0, fails = 0, nulls = 0;
const problems = [];
const report = m => { if (problems.length < 12) problems.push(m); fails++; };

for (let s = 1; s <= N_TESTS; s++) {
  const test = G.generateTest(s, ITEMS);
  if (!test) { nulls++; continue; }
  if (test.length !== ITEMS) { report(`seed ${s}: got ${test.length} items, want ${ITEMS}`); continue; }

  let prevDiff = -1;
  test.forEach((it, idx) => {
    items++;

    if (!(it.ans >= 0 && it.ans < 6)) { report(`seed ${s} item ${idx}: ans index ${it.ans}`); return; }
    if (it.choices.length !== 6) { report(`seed ${s} item ${idx}: ${it.choices.length} options`); return; }
    slotCounts[it.ans]++;

    // Exactly one option may equal the keyed answer.
    const ansKey = G.key(it.choices[it.ans]);
    const matches = it.choices.filter(c => G.key(c) === ansKey).length;
    if (matches !== 1) report(`seed ${s} item ${idx}: ${matches} options equal the answer`);

    // No duplicate options at all.
    const keys = it.choices.map(G.key);
    if (new Set(keys).size !== 6) report(`seed ${s} item ${idx}: duplicate options`);

    // The answer must not already be sitting in the visible matrix - that makes
    // the item solvable by matching rather than reasoning.
    if (it.cells.some(c => G.key(c) === ansKey)) {
      report(`seed ${s} item ${idx}: answer is a copy of a visible cell`);
    }
    if (it.cells.length !== 8) report(`seed ${s} item ${idx}: ${it.cells.length} visible cells`);

    if (it.difficulty < prevDiff) report(`seed ${s} item ${idx}: difficulty ${it.difficulty} after ${prevDiff}`);
    prevDiff = it.difficulty;
  });
}

console.log(`generated ${items} items across ${N_TESTS} tests` + (nulls ? ` (${nulls} seeds returned null)` : ''));
if (nulls > N_TESTS * 0.01) { console.log(`FAIL: ${nulls} seeds could not produce a full test`); fails++; }

// Answer-key uniformity. This is the check the old test would have failed
// catastrophically: its matrix key was 90% slot 1.
const total = slotCounts.reduce((a, b) => a + b, 0);
const expected = total / 6;
const pcts = slotCounts.map(c => (100 * c / total).toFixed(2) + '%');
console.log('answer slot distribution: ' + pcts.join('  ') + '   (want ~16.67% each)');

// Chi-square goodness of fit, 5 df. Critical value at p=0.001 is 20.515.
const chi2 = slotCounts.reduce((s, c) => s + Math.pow(c - expected, 2) / expected, 0);
console.log('chi-square = ' + chi2.toFixed(2) + ' (5 df, fail above 20.515)');
if (chi2 > 20.515) { console.log('FAIL: answer key is not uniform'); fails++; }

const worst = Math.max(...slotCounts.map(c => Math.abs(c / total - 1 / 6)));
if (worst > 0.02) { console.log('FAIL: a slot deviates more than 2 points from chance'); fails++; }

// The blind-clicking exploit that broke the old test: what does always picking
// slot k score? Should sit at chance, 6 of 36.
const best = Math.max(...slotCounts) / N_TESTS;
console.log('best fixed-slot strategy scores ' + best.toFixed(2) + '/' + ITEMS + ' (chance = ' + (ITEMS / 6).toFixed(2) + ')');
if (best > ITEMS / 6 + 1.5) { console.log('FAIL: a fixed-slot strategy beats chance'); fails++; }

if (problems.length) { console.log('\nfirst problems:'); problems.forEach(p => console.log('  ' + p)); }
console.log(fails ? `\n${fails} FAILURES` : '\nALL CLEAN');
process.exit(fails ? 1 : 0);
