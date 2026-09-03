/* Procedural mental-rotation item generator.
 *
 * WHY THIS TEST EXISTS
 * Spatial ability is a major, well-replicated cognitive factor and we did not
 * measure it at all. Our battery covered fluid reasoning, short-term storage,
 * processing speed, inhibition, colour discrimination, personality and emotion -
 * but nothing spatial. Mental rotation is the canonical spatial task
 * (Shepard & Metzler 1971; Vandenberg & Kuse 1978).
 *
 * It is also the ideal task for a site serving 43 markets: there is nothing to
 * read. No vocabulary, no arithmetic, no cultural content.
 *
 * THE DESIGN
 * A target figure is shown. Six candidates follow. Exactly one is the SAME
 * figure rotated; the rest are MIRROR IMAGES rotated by various angles. Mirror
 * foils are what make this a rotation task rather than a shape-matching task -
 * with random different shapes as foils you can solve it by counting cells.
 *
 * THE CORRECTNESS CONSTRAINT THAT MATTERS
 * A figure with an axis of mirror symmetry is achiral: its mirror image IS one
 * of its own rotations. Use one as a stimulus and the item has several correct
 * answers and no defensible key. Every generated figure is therefore checked for
 * chirality and rejected if it fails - see isChiral(). This is the same class of
 * check as "the answer must not already be visible" in matrixgen.js.
 *
 * Angular disparity drives difficulty, which is the standard finding: response
 * time and error rate rise roughly linearly with the angle you must rotate
 * through.
 */
(function (root) {
  'use strict';

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const pick = (rng, a) => a[Math.floor(rng() * a.length)];
  function shuffle(rng, arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ── Figures are polyominoes: connected unit cells on a grid ────────────────
  function growPolyomino(rng, n) {
    const cells = [[0, 0]];
    const has = (x, y) => cells.some(c => c[0] === x && c[1] === y);
    let guard = 0;
    while (cells.length < n && guard++ < 400) {
      const [cx, cy] = pick(rng, cells);
      const [dx, dy] = pick(rng, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
      const nx = cx + dx, ny = cy + dy;
      if (!has(nx, ny)) cells.push([nx, ny]);
    }
    return cells;
  }

  // Canonical key: translate to the origin and take the lexicographically
  // smallest of the four 90-degree rotations. Two cell sets have the same key
  // exactly when one is a rotation of the other.
  function normalise(cells) {
    const minX = Math.min(...cells.map(c => c[0]));
    const minY = Math.min(...cells.map(c => c[1]));
    return cells.map(([x, y]) => [x - minX, y - minY])
                .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  }
  const rot90 = cells => cells.map(([x, y]) => [y, -x]);
  const mirror = cells => cells.map(([x, y]) => [-x, y]);
  const keyOf = cells => JSON.stringify(normalise(cells));

  function canonical(cells) {
    let best = null, cur = cells;
    for (let i = 0; i < 4; i++) {
      const k = keyOf(cur);
      if (best === null || k < best) best = k;
      cur = rot90(cur);
    }
    return best;
  }

  // A figure is usable only if it is CHIRAL - its mirror is not reachable by
  // rotation. Otherwise the mirror foils are also correct answers.
  function isChiral(cells) { return canonical(cells) !== canonical(mirror(cells)); }

  // ── SVG rendering ─────────────────────────────────────────────────────────
  // The polyomino defines the shape; the display angle is continuous, applied
  // as an SVG rotation. That gives true angular disparity while the underlying
  // identity stays discrete and checkable.
  function figureSvg(cells, angleDeg, size) {
    size = size || 96;
    const norm = normalise(cells);
    const w = Math.max(...norm.map(c => c[0])) + 1;
    const h = Math.max(...norm.map(c => c[1])) + 1;
    const span = Math.max(w, h);
    const unit = 100 / (span + 1.2);
    const offX = (100 - w * unit) / 2, offY = (100 - h * unit) / 2;
    // Each tag is built as ONE template literal. Splitting a tag across
    // concatenated literals leaves an unclosed `<rect x="...` fragment, which
    // reads to any source scanner as loose prose - that is exactly how the
    // hardcoded-English guard flagged the word "rect" here.
    const attrs = 'fill="currentColor" fill-opacity="0.20" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"';
    const rects = norm.map(([x, y]) => {
      const px = (offX + x * unit).toFixed(2), py = (offY + y * unit).toFixed(2);
      const u = unit.toFixed(2);
      return `<rect x="${px}" y="${py}" width="${u}" height="${u}" ${attrs}/>`;
    }).join('');
    const g = `<g transform="rotate(${angleDeg} 50 50)">${rects}</g>`;
    return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" aria-hidden="true">${g}</svg>`;
  }

  // ── Item construction ─────────────────────────────────────────────────────
  const ANGLES = [45, 90, 135, 180, 225, 270, 315];

  function generateItem(rng, cellCount) {
    let base = null;
    for (let a = 0; a < 60 && !base; a++) {
      const c = growPolyomino(rng, cellCount);
      if (c.length === cellCount && isChiral(c)) base = c;
    }
    if (!base) return null;

    const targetAngle = pick(rng, [0, 15, 30]);        // slight tilt so it is not axis-aligned
    const answerAngle = pick(rng, ANGLES);
    const mir = mirror(base);

    const options = [{ cells: base, angle: (targetAngle + answerAngle) % 360, correct: true }];
    const usedAngles = new Set([answerAngle]);
    let guard = 0;
    while (options.length < 6 && guard++ < 200) {
      let ang = pick(rng, ANGLES);
      if (usedAngles.has(ang)) { ang = (ang + 45) % 360; }
      usedAngles.add(ang);
      options.push({ cells: mir, angle: (targetAngle + ang) % 360, correct: false });
    }
    if (options.length !== 6) return null;

    const shuffled = shuffle(rng, options);
    // Angular disparity is the difficulty driver: rotating through 180 degrees
    // is reliably harder than through 45.
    const disparity = Math.min(answerAngle, 360 - answerAngle);
    return {
      target: { cells: base, angle: targetAngle },
      options: shuffled,
      ans: shuffled.findIndex(o => o.correct),
      difficulty: Math.round(disparity / 45) + (cellCount - 5),
      disparity,
      cells: cellCount,
    };
  }

  function generateTest(seed, n) {
    n = n || 20;
    const rng = mulberry32(seed >>> 0);
    const pool = [];
    let guard = 0;
    while (pool.length < n * 3 && guard++ < n * 200) {
      const size = 5 + Math.floor(rng() * 3);           // 5-7 cells
      const it = generateItem(rng, size);
      if (it) pool.push(it);
    }
    if (pool.length < n) return null;
    pool.sort((a, b) => a.difficulty - b.difficulty);
    const lo = pool[0].difficulty, hi = pool[pool.length - 1].difficulty;
    const used = new Set(), chosen = [];
    for (let i = 0; i < n; i++) {
      const target = lo + (hi - lo) * (i / Math.max(1, n - 1));
      let best = -1, gap = Infinity;
      for (let j = 0; j < pool.length; j++) {
        if (used.has(j)) continue;
        const d = Math.abs(pool[j].difficulty - target);
        if (d < gap) { gap = d; best = j; }
      }
      if (best < 0) break;
      used.add(best); chosen.push(pool[best]);
    }
    if (chosen.length < n) return null;
    chosen.sort((a, b) => a.difficulty - b.difficulty);
    return chosen;
  }

  root.RotationGen = { generateTest, generateItem, figureSvg, isChiral, canonical, mirror, mulberry32 };
})(typeof window !== 'undefined' ? window : globalThis);
