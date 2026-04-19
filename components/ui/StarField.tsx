'use client';

import { useEffect, useRef } from 'react';

// ═══════════════════════════════════════════════════════════════
// CORESKILLAI STARFIELD — ELITE 2026 REDESIGN
// Clean dark background, subtle stars, mouse-repel, comets
// ═══════════════════════════════════════════════════════════════

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;;
    if (!ctx) return;

    let W = canvas.width;
    let H = canvas.height;
    const nodes: any[] = [];
    const comets: any[] = [];
    const mouse = { x: -99999, y: -99999 };
    let time = 0;
    let lastComet = 0;

    // ── Config ──
    const NODE_COUNT = 90;
    const CONNECTION_DIST = 140;
    const REPEL_RADIUS = 150;
    const REPEL_STRENGTH = 0.04;
    const FRICTION = 0.96;
    const MIN_SPEED = 0.01;
    const MAX_SPEED = 0.3;
    const MAX_COMETS = 5;
    const COMET_TRAIL = 5;

    const COLORS = [
      [255, 255, 255],   // white (dominant)
      [167, 139, 250],   // soft purple
      [103, 232, 249],   // soft cyan
      [196, 181, 253],   // lavender
      [147, 197, 253],   // soft blue
    ];
    const WEIGHTS = [0.55, 0.22, 0.13, 0.07, 0.03];
    const COMET_COLORS = [[167, 139, 250], [103, 232, 249], [255, 255, 255]];

    function pickColorIdx(): number {
      const r = Math.random();
      let cum = 0;
      for (let i = 0; i < WEIGHTS.length; i++) {
        cum += WEIGHTS[i];
        if (r < cum) return i;
      }
      return 0;
    }

    function resize() {
      if (!canvas) return;
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function makeNode(): any {
      const colIdx = pickColorIdx();
      const col = COLORS[colIdx];
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * MIN_SPEED,
        vy: (Math.random() - 0.5) * MIN_SPEED,
        r: Math.random() * 1.1 + 0.4,
        col,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: Math.random() * 0.018 + 0.005,
        connections: 0,
        glowIntensity: 0,
      };
    }

    function updateNode(n: any) {
      n.vx += (Math.random() - 0.5) * 0.004;
      n.vy += (Math.random() - 0.5) * 0.004;
      const dx = n.x - mouse.x;
      const dy = n.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < REPEL_RADIUS && dist > 0) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
        n.glowIntensity = Math.min(n.glowIntensity + 0.08, 1);
      }
      n.vx *= FRICTION;
      n.vy *= FRICTION;
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (spd > MAX_SPEED) {
        n.vx = (n.vx / spd) * MAX_SPEED;
        n.vy = (n.vy / spd) * MAX_SPEED;
      }
      if (spd < MIN_SPEED) { n.vx *= 1.08; n.vy *= 1.08; }
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < -20) n.x = W + 20;
      if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20;
      if (n.y > H + 20) n.y = -20;
      n.pulse += n.pulseSpeed;
      n.glowIntensity *= 0.94;
    }

    function drawNode(n: any) {
      const p = Math.sin(n.pulse) * 0.25 + 0.75;
      const alpha = Math.min(p + n.glowIntensity * 0.4, 1);
      const glowR = n.r * (1.5 + n.connections * 0.2 + n.glowIntensity * 1.5);
      const [cr, cg, cb] = n.col;

      const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, glowR);
      grd.addColorStop(0, `rgba(${cr},${cg},${cb},${alpha * 0.65})`);
      grd.addColorStop(0.4, `rgba(${cr},${cg},${cb},${alpha * 0.2})`);
      grd.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(n.x, n.y, glowR, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.min(alpha + 0.15, 1)})`;
      ctx.fill();
    }

    function spawnComet() {
      const edge = Math.floor(Math.random() * 4);
      let sx = 0, sy = 0;
      if (edge === 0) { sx = Math.random() * W; sy = -20; }
      else if (edge === 1) { sx = W + 20; sy = Math.random() * H; }
      else if (edge === 2) { sx = Math.random() * W; sy = H + 20; }
      else { sx = -20; sy = Math.random() * H; }
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 4;
      comets.push({
        x: sx, y: sy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.006 + Math.random() * 0.006,
        size: Math.random() * 2 + 0.5,
        hue: Math.floor(Math.random() * 3),
      });
      if (comets.length > MAX_COMETS) comets.shift();
    }

    function updateComet(c: any) {
      c.x += c.vx;
      c.y += c.vy;
      c.life -= c.decay;
      c.vx *= 0.99;
      c.vy *= 0.99;
      return c.life > 0 && c.x > -60 && c.x < W + 60 && c.y > -60 && c.y < H + 60;
    }

    function drawComet(c: any) {
      const [cr, cg, cb] = COMET_COLORS[c.hue];
      const tx = c.x - c.vx * COMET_TRAIL;
      const ty = c.y - c.vy * COMET_TRAIL;
      const grd = ctx.createLinearGradient(tx, ty, c.x, c.y);
      grd.addColorStop(0, `rgba(${cr},${cg},${cb},0)`);
      grd.addColorStop(0.65, `rgba(${cr},${cg},${cb},${c.life * 0.25})`);
      grd.addColorStop(1, `rgba(255,255,255,${c.life})`);
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(c.x, c.y);
      ctx.strokeStyle = grd;
      ctx.lineWidth = c.size;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${c.life * 0.85})`;
      ctx.fill();
    }

    function drawBackground() {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, W, H);
      // barely-there corner hints
      const g1 = ctx.createRadialGradient(W * 0.08, H * 0.12, 0, W * 0.08, H * 0.12, W * 0.35);
      g1.addColorStop(0, 'rgba(99,102,241,0.035)');
      g1.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);
      const g2 = ctx.createRadialGradient(W * 0.88, H * 0.85, 0, W * 0.88, H * 0.85, W * 0.25);
      g2.addColorStop(0, 'rgba(139,92,246,0.03)');
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
    }

    function drawConnections() {
      for (const n of nodes) n.connections = 0;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < CONNECTION_DIST) {
            const alpha = (1 - d / CONNECTION_DIST) * 0.15;
            const conn = Math.max(nodes[i].connections, nodes[j].connections);
            const lw = 0.3 + conn * 0.06;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const grd = ctx.createLinearGradient(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            grd.addColorStop(0, `rgba(167,139,250,${alpha})`);
            grd.addColorStop(0.5, `rgba(103,232,249,${alpha * 0.55})`);
            grd.addColorStop(1, `rgba(167,139,250,${alpha})`);
            ctx.strokeStyle = grd;
            ctx.lineWidth = lw;
            ctx.stroke();
            nodes[i].connections++;
            nodes[j].connections++;
          }
        }
      }
    }

    function draw() {
      time++;
      drawBackground();
      drawConnections();
      for (const n of nodes) updateNode(n);
      for (const n of nodes) drawNode(n);

      if (time - lastComet > 350 && Math.random() > 0.98) {
        spawnComet();
        lastComet = time;
      }
      for (let i = comets.length - 1; i >= 0; i--) {
        if (!updateComet(comets[i])) comets.splice(i, 1);
        else drawComet(comets[i]);
      }

      requestAnimationFrame(draw);
    }

    resize();
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(makeNode());
    draw();

    window.addEventListener('resize', resize);
    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onMouseLeave = () => { mouse.x = -99999; mouse.y = -99999; };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; };
    const onTouchEnd = () => { mouse.x = -99999; mouse.y = -99999; };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}