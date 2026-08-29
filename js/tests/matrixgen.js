/* Procedural 3x3 matrix-reasoning item generator.
 *
 * WHY THIS EXISTS
 * The previous IQ test was 40 hand-typed items. Two things were wrong with it
 * and both were fatal to the score's meaning:
 *
 *   1. The answer key was never shuffled and was badly skewed - 9 of the 10
 *      matrix items had the correct answer in slot 1, and 17 of 40 items overall
 *      sat in slot 3. Clicking "option 3 on text, option 1 on matrices" without
 *      reading anything scored 26/40 and was awarded IQ 114.
 *   2. 30 of the 40 items were number series and number analogies that required
 *      knowing factorials, cubes and perfect squares. That is crystallised
 *      arithmetic taught in school, not fluid reasoning, and it penalises exactly
 *      the non-English, differently-schooled visitors we serve in 43 markets.
 *
 * Generating items from rules fixes both by construction: the key is uniform
 * because option order is drawn from the same seeded RNG, and the content is
 * non-verbal so it does not test vocabulary, arithmetic or schooling.
 *
 * THE RULES ARE NOT INVENTED
 * The rule families below follow the analysis of Raven's Advanced Progressive
 * Matrices in Carpenter, Just & Shell (1990), "What one intelligence test
 * measures", Psychological Review 97(3). They identified the small set of rules
 * that account for essentially all APM items:
 *
 *   constant in a row   - an attribute holds its value along a row
 *   distribution of three - each of three values appears exactly once in every
 *                         row AND every column (a Latin square)
 *   quantitative pairwise progression - an attribute increments by a fixed step
 *                         across the row
 *
 * Progression is applied ONLY to quantitative attributes (count, rotation),
 * which is the same distinction Carpenter et al. draw. Applying it to a nominal
 * attribute like shape would be meaningless - "one more triangle-ness" is not a
 * thing - and would just collapse into a Latin square anyway.
 *
 * DESIGN CHOICES WORTH KNOWING
 * - Monochrome on purpose. We also publish a colour-vision test; if the IQ items
 *   used colour we would be handing a lower score to the ~8% of men with a
 *   colour deficiency and calling it intelligence.
 * - Six options, not four. Chance drops from 25% to 16.7%, which materially
 *   tightens the measurement at the low end.
 * - Distractors are principled, not random. Random distractors are easy to
 *   eliminate and inflate scores.
 */
(function (root) {
  'use strict';

  // ── Seeded RNG ────────────────────────────────────────────────────────────
  // Every session gets its own seed, so nobody can memorise an answer sequence
  // and post it. Deterministic given the seed, so the verifier can reproduce a
  // failing test exactly.
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  function shuffle(rng, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function sample(rng, arr, n) { return shuffle(rng, arr).slice(0, n); }

  // ── Attribute vocabularies ────────────────────────────────────────────────
  const SHAPES = ['circle', 'square', 'triangle', 'diamond', 'hexagon', 'star', 'cross'];
  const FILLS  = ['none', 'solid', 'hatch'];
  const ROTS   = [0, 45, 90, 135];
  const COUNTS = [1, 2, 3, 4, 5];

  // Difficulty weight per rule. A matrix where everything is constant is
  // trivial; one where three attributes each follow a different distribution
  // rule is genuinely hard. This is what orders the test.
  const RULE_COST = { fixed: 0, row: 1, col: 1, progression: 2, dist3: 3 };

  // ── Rule engines: each returns a 3x3 grid of concrete attribute values ─────
  function gridFixed(v) {
    return [[v, v, v], [v, v, v], [v, v, v]];
  }
  function gridRow(rng, vals) {            // constant along each row
    const p = shuffle(rng, vals);
    return [0, 1, 2].map(r => [p[r], p[r], p[r]]);
  }
  function gridCol(rng, vals) {            // constant down each column
    const p = shuffle(rng, vals);
    return [0, 1, 2].map(() => [p[0], p[1], p[2]]);
  }
  function gridDist3(rng, vals) {          // Latin square: once per row AND column
    const p = shuffle(rng, vals);
    const k = pick(rng, [1, 2]);           // both offsets give a valid Latin square
    return [0, 1, 2].map(r => [0, 1, 2].map(c => p[(r * k + c) % 3]));
  }
  // Quantitative progression: value climbs by a fixed step across each row.
  // Rows are offset from each other so the grid is not three identical rows.
  function gridProgression(rng, min, max) {
    const step = pick(rng, [1, 2, -1, -2]);
    const span = Math.abs(step) * 2;
    const lo = step > 0 ? min : min + span;
    const hi = step > 0 ? max - span : max;
    const starts = [];
    for (let v = lo; v <= hi; v++) starts.push(v);
    if (starts.length < 3) return null;                       // not enough headroom
    const chosen = sample(rng, starts, 3).sort((a, b) => a - b);
    return chosen.map(s => [0, 1, 2].map(c => s + c * step));
  }

  // ── Item construction ─────────────────────────────────────────────────────
  // An item varies 1-3 attributes; every other attribute is pinned to one value
  // for the whole matrix so the varying structure is the only thing to solve.
  const NOMINAL_RULES = ['row', 'col', 'dist3'];

  function buildAttrGrid(rng, attr, rule) {
    if (rule === 'fixed') {
      if (attr === 'shape') return gridFixed(pick(rng, SHAPES));
      if (attr === 'fill')  return gridFixed(pick(rng, FILLS));
      if (attr === 'count') return gridFixed(pick(rng, [1, 2, 3]));
      return gridFixed(pick(rng, ROTS));
    }
    if (rule === 'progression') {
      // Only ever reached for quantitative attributes.
      if (attr === 'count') {
        const g = gridProgression(rng, 1, 5);
        return g;
      }
      const g = gridProgression(rng, 0, 3);   // rotation as index into ROTS
      return g && g.map(row => row.map(i => ROTS[((i % 4) + 4) % 4]));
    }
    const vals = attr === 'shape' ? sample(rng, SHAPES, 3)
               : attr === 'fill'  ? sample(rng, FILLS, 3)
               : attr === 'count' ? sample(rng, COUNTS, 3)
               :                    sample(rng, ROTS, 3);
    if (rule === 'row')   return gridRow(rng, vals);
    if (rule === 'col')   return gridCol(rng, vals);
    return gridDist3(rng, vals);
  }

  const ATTRS = ['shape', 'count', 'fill', 'rot'];
  const QUANTITATIVE = { count: true, rot: true };

  function generateItem(rng) {
    const nVary = pick(rng, [1, 1, 2, 2, 2, 3]);     // most items vary 2 attributes
    const varying = sample(rng, ATTRS, nVary);
    const plan = {};
    let difficulty = 0;

    for (const a of ATTRS) {
      if (varying.indexOf(a) === -1) { plan[a] = 'fixed'; continue; }
      const opts = QUANTITATIVE[a] ? NOMINAL_RULES.concat(['progression']) : NOMINAL_RULES;
      plan[a] = pick(rng, opts);
    }

    const grids = {};
    for (const a of ATTRS) {
      const g = buildAttrGrid(rng, a, plan[a]);
      if (!g) return null;                            // progression had no headroom
      grids[a] = g;
      difficulty += RULE_COST[plan[a]];
    }

    // Assemble the 9 cells.
    const cells = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        cells.push({
          shape: grids.shape[r][c], count: grids.count[r][c],
          fill:  grids.fill[r][c],  rot:   grids.rot[r][c],
        });
      }
    }
    const answer = cells[8];

    // A matrix where the bottom-right cell is identical to another cell is
    // solvable by pattern-matching rather than reasoning. Reject it.
    for (let i = 0; i < 8; i++) if (key(cells[i]) === key(answer)) return null;

    const options = buildOptions(rng, cells, answer, varying, grids);
    if (!options) return null;

    const shuffled = shuffle(rng, options);
    return {
      cells: cells.slice(0, 8),
      choices: shuffled,
      ans: shuffled.findIndex(o => key(o) === key(answer)),
      difficulty,
      rules: plan,
    };
  }

  function key(c) { return c.shape + '|' + c.count + '|' + c.fill + '|' + c.rot; }

  // Distractor types mirror the ones Raven's own items use. Each is wrong for a
  // specific, plausible reason - which is what makes the item discriminate.
  function buildOptions(rng, cells, answer, varying, grids) {
    const out = [answer];
    const seen = { [key(answer)]: true };
    const add = cand => {
      if (!cand) return;
      const k = key(cand);
      if (seen[k]) return;
      seen[k] = true; out.push(cand);
    };
    const clone = c => ({ shape: c.shape, count: c.count, fill: c.fill, rot: c.rot });

    // Repetition: the cell to the left, and the cell above. The single most
    // common wrong answer in real matrix tests.
    add(clone(cells[7]));
    add(clone(cells[5]));

    // Wrong principle: correct on everything except one varying attribute,
    // which takes a value from elsewhere in the matrix.
    for (const a of shuffle(rng, varying)) {
      const pool = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const v = grids[a][r][c];
        if (v !== answer[a] && pool.indexOf(v) === -1) pool.push(v);
      }
      if (!pool.length) continue;
      const d = clone(answer); d[a] = pick(rng, pool);
      add(d);
      if (out.length >= 6) break;
    }

    // Incomplete correlate: the right idea taken one step too far or not far
    // enough, on a quantitative attribute.
    for (const a of varying) {
      if (!QUANTITATIVE[a]) continue;
      const d = clone(answer);
      if (a === 'count') d.count = Math.max(1, Math.min(5, answer.count + pick(rng, [-1, 1])));
      else d.rot = ROTS[(ROTS.indexOf(answer.rot) + pick(rng, [1, 3])) % 4];
      add(d);
      if (out.length >= 6) break;
    }

    // Backfill with plausible combinations drawn from values actually present
    // in the matrix, so no option is eliminable just by looking odd.
    let guard = 0;
    while (out.length < 6 && guard++ < 200) {
      const d = clone(answer);
      const a = pick(rng, ATTRS);
      const pool = [];
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        const v = grids[a][r][c];
        if (v !== answer[a] && pool.indexOf(v) === -1) pool.push(v);
      }
      if (pool.length) { d[a] = pick(rng, pool); add(d); }
      else {
        const alt = a === 'shape' ? SHAPES : a === 'fill' ? FILLS : a === 'count' ? COUNTS : ROTS;
        d[a] = pick(rng, alt); add(d);
      }
    }
    return out.length === 6 ? out : null;
  }

  // ── Test assembly ─────────────────────────────────────────────────────────
  // Items are generated, then ordered easiest-first. Ascending difficulty is
  // standard practice: it keeps low-ability takers engaged past the first screen
  // and stops high-ability takers burning the clock on trivial items.
  function generateTest(seed, n) {
    n = n || 36;
    const rng = mulberry32(seed >>> 0);
    const pool = [];
    const seenSig = {};
    let guard = 0;
    while (pool.length < n * 3 && guard++ < n * 200) {
      const it = generateItem(rng);
      if (!it) continue;
      // Avoid two items with an identical rule signature AND identical answer.
      const sig = JSON.stringify(it.rules) + '#' + key(it.choices[it.ans]);
      if (seenSig[sig]) continue;
      seenSig[sig] = true;
      pool.push(it);
    }
    if (pool.length < n) return null;

    // Spread across the difficulty range rather than taking the n easiest.
    pool.sort((a, b) => a.difficulty - b.difficulty);
    const chosen = [];
    for (let i = 0; i < n; i++) chosen.push(pool[Math.floor(i * pool.length / n)]);
    chosen.sort((a, b) => a.difficulty - b.difficulty);
    return chosen;
  }

  // ── SVG rendering ─────────────────────────────────────────────────────────
  const LAYOUTS = {
    1: [[50, 50]],
    2: [[30, 50], [70, 50]],
    3: [[50, 28], [30, 68], [70, 68]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
  };
  const RADIUS = { 1: 26, 2: 18, 3: 16, 4: 15, 5: 13 };

  function poly(cx, cy, r, sides, rot) {
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 * i) / sides - Math.PI / 2 + (rot * Math.PI) / 180;
      pts.push((cx + r * Math.cos(a)).toFixed(1) + ',' + (cy + r * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }
  function starPts(cx, cy, r, rot) {
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const rr = i % 2 ? r * 0.45 : r;
      const a = (Math.PI * i) / 5 - Math.PI / 2 + (rot * Math.PI) / 180;
      pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return pts.join(' ');
  }

  function shapeSvg(shape, cx, cy, r, rot, paint) {
    switch (shape) {
      case 'circle':   return `<circle cx="${cx}" cy="${cy}" r="${r}" ${paint}/>`;
      case 'square':   return `<polygon points="${poly(cx, cy, r, 4, rot + 45)}" ${paint}/>`;
      case 'triangle': return `<polygon points="${poly(cx, cy, r, 3, rot)}" ${paint}/>`;
      case 'diamond':  return `<polygon points="${poly(cx, cy, r, 4, rot)}" ${paint}/>`;
      case 'hexagon':  return `<polygon points="${poly(cx, cy, r, 6, rot)}" ${paint}/>`;
      case 'star':     return `<polygon points="${starPts(cx, cy, r, rot)}" ${paint}/>`;
      case 'cross': {
        const t = r * 0.36;
        const p = [[-t,-r],[t,-r],[t,-t],[r,-t],[r,t],[t,t],[t,r],[-t,r],[-t,t],[-r,t],[-r,-t],[-t,-t]]
          .map(([x, y]) => {
            const a = (rot * Math.PI) / 180;
            const rx = x * Math.cos(a) - y * Math.sin(a), ry = x * Math.sin(a) + y * Math.cos(a);
            return (cx + rx).toFixed(1) + ',' + (cy + ry).toFixed(1);
          }).join(' ');
        return `<polygon points="${p}" ${paint}/>`;
      }
      default: return '';
    }
  }

  let uid = 0;
  function cellSvg(cell, size) {
    size = size || 76;
    if (!cell) return `<svg viewBox="0 0 100 100" width="${size}" height="${size}"></svg>`;
    const id = 'h' + (++uid);
    const hatch = cell.fill === 'hatch'
      ? `<defs><pattern id="${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="2.2"/></pattern></defs>`
      : '';
    const paint = cell.fill === 'solid' ? 'fill="currentColor" stroke="none"'
                : cell.fill === 'hatch' ? `fill="url(#${id})" stroke="currentColor" stroke-width="2"`
                : 'fill="none" stroke="currentColor" stroke-width="2.6"';
    const pts = LAYOUTS[cell.count] || LAYOUTS[1];
    const r = RADIUS[cell.count] || 20;
    const body = pts.map(([x, y]) => shapeSvg(cell.shape, x, y, r, cell.rot, paint)).join('');
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${hatch}${body}</svg>`;
  }

  root.MatrixGen = { generateTest, generateItem, cellSvg, mulberry32, key };
})(typeof window !== 'undefined' ? window : globalThis);
