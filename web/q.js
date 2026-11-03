/* Q, Qualitide's pixel director, living at the bottom of the page. Drawn live on a 96x128 canvas. */
(() => {
'use strict';
if (window.__qmate) return; window.__qmate = 1;
/* Q — pixel-art human director. A puppet drawn on a 96x128 pixel canvas, crisp (alpha thresholded), outlined.
   drawQ(ctx, pose) where pose = { lsh, lel, rsh, rel, lhip, lknee, rhip, rknee, bob, lean, look, face, propR, propL, squash } */
const QP = {
  skin: '#C98B5E', skinD: '#A2683F', skinL: '#E0A87A', hair: '#1A1212', hairL: '#3B2A26', eye: '#140D0D',
  red: '#D3202F', redD: '#931523', redL: '#F0503F', tee: '#F1E8D6', teeD: '#CDBFA6', jean: '#2B3550', jeanD: '#1C2338',
  shoe: '#F4F1EA', shoeD: '#BDB6AA', sole: '#2A2A2E', gold: '#F2C14E', phone: '#26262C', ear: '#3A3A42', line: '#140C0C', mouth: '#5A1E1E', tongue: '#D9606A'
};
function qCanvas() { const c = document.createElement('canvas'); c.width = 96; c.height = 128; return c; }
function rad(d) { return d * Math.PI / 180; }
/* a limb as a thick segment with rounded ends, plus a darker rim on one side */
function limb(x, ax, ay, bx, by, w, col, colD) {
  x.lineCap = 'round'; x.strokeStyle = QP.line; x.lineWidth = w + 2; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
  x.strokeStyle = col; x.lineWidth = w; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
  if (colD) { const nx = -(by - ay), ny = bx - ax, L = Math.hypot(nx, ny) || 1; const o = w * 0.3; x.strokeStyle = colD; x.lineWidth = Math.max(1, w * 0.35);
    x.beginPath(); x.moveTo(ax + nx / L * o, ay + ny / L * o); x.lineTo(bx + nx / L * o, by + ny / L * o); x.stroke(); }
}
function rect(x, a, b, w, h, c) { x.fillStyle = c; x.fillRect(Math.round(a), Math.round(b), w, h); }
/* arm: shoulder at (sx,sy); sh = angle from straight down (deg, + = outward), el = elbow bend (deg, + = forearm swings up/in) */
function armPts(sx, sy, sh, el, side) { const a1 = rad(sh) * side, L1 = 13, L2 = 12;
  const ex = sx + Math.sin(a1) * L1, ey = sy + Math.cos(a1) * L1; const a2 = a1 + rad(el) * side; const hx = ex + Math.sin(a2) * L2, hy = ey + Math.cos(a2) * L2; return { ex, ey, hx, hy, a2 }; }
function legPts(hx, hy, hip, knee, side) { const a1 = rad(hip) * side, L1 = 13, L2 = 12; const kx = hx + Math.sin(a1) * L1, ky = hy + Math.cos(a1) * L1; const a2 = a1 - rad(knee) * side; return { kx, ky, fx: kx + Math.sin(a2) * L2, fy: ky + Math.cos(a2) * L2 }; }

/* props drawn at a hand position */
function prop(x, kind, hx, hy, side, t) {
  if (!kind) return;
  if (kind === 'megaphone') { x.save(); x.translate(hx, hy); x.scale(side, 1); x.fillStyle = QP.line; x.beginPath(); x.moveTo(-1, -4); x.lineTo(14, -9); x.lineTo(14, 7); x.lineTo(-1, 3); x.fill();
    x.fillStyle = '#F4F1EA'; x.beginPath(); x.moveTo(0, -3); x.lineTo(13, -7); x.lineTo(13, 5); x.lineTo(0, 2); x.fill(); x.fillStyle = QP.red; x.fillRect(5, -5, 2, 9); x.fillStyle = '#9A958C'; x.fillRect(11, -7, 2, 12); x.restore(); }
  if (kind === 'clapper' || kind === 'clapperOpen') { x.save(); x.translate(hx, hy); x.scale(side, 1); rect(x, -1, -9, 18, 13, QP.line); rect(x, 0, -8, 16, 11, '#1E1E22'); rect(x, 2, -5, 12, 1, '#F4F1EA'); rect(x, 2, -2, 8, 1, '#8A8A92');
    x.save(); x.translate(0, -9); x.rotate(kind === 'clapperOpen' ? -0.5 : 0); rect(x, -1, -5, 18, 6, QP.line); for (let i = 0; i < 4; i++) rect(x, i * 4, -4, 4, 4, i % 2 ? '#F4F1EA' : '#1E1E22'); x.restore(); x.restore(); }
  if (kind === 'magnifier') { x.save(); x.translate(hx, hy); x.scale(side, 1); limb(x, 0, 0, 6, -6, 3, '#6B4A2E'); x.fillStyle = QP.line; x.beginPath(); x.arc(10, -10, 7, 0, 7); x.fill(); x.fillStyle = '#BFE6F0'; x.beginPath(); x.arc(10, -10, 5, 0, 7); x.fill(); rect(x, 7, -14, 2, 2, '#FFFFFF'); x.restore(); }
  if (kind === 'brush') { x.save(); x.translate(hx, hy); x.scale(side, 1); limb(x, 0, 2, 10, -12, 3, '#8A5A34'); rect(x, 8, -18, 6, 5, QP.line); rect(x, 9, -17, 4, 3, '#C0C0C8'); rect(x, 8, -22, 6, 5, QP.line); rect(x, 9, -21, 4, 4, QP.red); x.restore(); }
  if (kind === 'phone') { x.save(); x.translate(hx, hy); rect(x, -4, -12, 9, 15, QP.line); rect(x, -3, -11, 7, 13, QP.phone); rect(x, -2, -10, 5, 9, '#7FD3E8'); x.restore(); }
  if (kind === 'trophy') { x.save(); x.translate(hx, hy); rect(x, -6, -16, 13, 11, QP.line); rect(x, -5, -15, 11, 9, QP.gold); rect(x, -1, -6, 3, 4, QP.line); rect(x, -4, -3, 9, 3, QP.line); rect(x, -3, -14, 2, 5, '#FFF2B8'); x.restore(); }
}

const FACES = {
  smile: (x, ex, ey) => { rect(x, ex - 6, ey + 7, 6, 1, QP.mouth); rect(x, ex - 7, ey + 6, 1, 1, QP.mouth); rect(x, ex, ey + 6, 1, 1, QP.mouth); },
  grin: (x, ex, ey) => { rect(x, ex - 7, ey + 5, 8, 4, QP.line); rect(x, ex - 6, ey + 5, 6, 2, '#FFFFFF'); rect(x, ex - 5, ey + 7, 4, 1, QP.tongue); },
  o: (x, ex, ey) => { rect(x, ex - 5, ey + 5, 4, 4, QP.line); rect(x, ex - 4, ey + 6, 2, 2, QP.mouth); },
  flat: (x, ex, ey) => { rect(x, ex - 6, ey + 7, 6, 1, QP.mouth); },
  smirk: (x, ex, ey) => { rect(x, ex - 5, ey + 7, 5, 1, QP.mouth); rect(x, ex, ey + 6, 1, 1, QP.mouth); },
  yawn: (x, ex, ey) => { rect(x, ex - 6, ey + 4, 6, 6, QP.line); rect(x, ex - 5, ey + 5, 4, 4, QP.mouth); rect(x, ex - 4, ey + 7, 2, 2, QP.tongue); },
};
function drawQ(x, p) {
  p = Object.assign({ lsh: 8, lel: 6, rsh: 8, rel: 6, lhip: 4, lknee: 0, rhip: 4, rknee: 0, bob: 0, lean: 0, look: 0, face: 'smile', eyes: 'open', squash: 1, propR: null, propL: null, brow: 0, t: 0 }, p);
  x.clearRect(0, 0, 96, 128); x.imageSmoothingEnabled = false;
  x.save(); x.translate(48, 124); x.scale(1, p.squash); x.translate(-48, -124 - p.bob);
  const cx = 48 + p.lean, hipY = 92;
  /* legs */
  const L = legPts(cx - 5, hipY, p.lhip, p.lknee, -1), R = legPts(cx + 5, hipY, p.rhip, p.rknee, 1);
  [[L, cx - 5, -1], [R, cx + 5, 1]].forEach(([g, hx, s]) => { limb(x, hx, hipY, g.kx, g.ky, 8, QP.jean, QP.jeanD); limb(x, g.kx, g.ky, g.fx, g.fy, 7, QP.jean, QP.jeanD);
    rect(x, g.fx - 5 + s, g.fy - 1, 11, 6, QP.line); rect(x, g.fx - 4 + s, g.fy, 9, 4, QP.shoe); rect(x, g.fx - 4 + s, g.fy + 3, 9, 1, QP.sole); rect(x, g.fx - 4 + s, g.fy, 3, 2, QP.shoeD); });
  /* torso: red bomber, cream tee, gold zip, ribbed hem */
  const tx = cx - 14, ty = 58;
  rect(x, tx - 1, ty - 1, 30, 37, QP.line); rect(x, tx, ty, 28, 35, QP.red); rect(x, tx, ty, 6, 35, QP.redD); rect(x, tx + 22, ty + 2, 3, 30, QP.redL);
  rect(x, cx - 3, ty, 7, 30, QP.tee); rect(x, cx - 3, ty, 2, 30, QP.teeD); rect(x, cx + 3, ty + 4, 1, 26, QP.gold); rect(x, cx + 3, ty + 12, 2, 2, QP.gold);
  rect(x, tx, ty + 30, 28, 5, QP.redD); for (let i = 0; i < 28; i += 2) rect(x, tx + i, ty + 31, 1, 3, '#7A0F1C');
  rect(x, tx + 3, ty + 20, 6, 2, QP.redD); rect(x, tx + 19, ty + 20, 6, 2, QP.redD);
  /* headphones round the neck */
  rect(x, cx - 9, ty - 3, 18, 3, QP.line); rect(x, cx - 8, ty - 2, 16, 2, QP.ear); rect(x, cx - 11, ty - 4, 5, 6, QP.line); rect(x, cx - 10, ty - 3, 3, 4, QP.red); rect(x, cx + 6, ty - 4, 5, 6, QP.line); rect(x, cx + 7, ty - 3, 3, 4, QP.red);
  /* arms (behind-then-front order by side: left first) */
  const sL = armPts(cx - 13, ty + 3, p.lsh, p.lel, -1), sR = armPts(cx + 13, ty + 3, p.rsh, p.rel, 1);
  const drawArm = (a, sx, side, pr) => { limb(x, sx, ty + 3, a.ex, a.ey, 8, QP.red, QP.redD); limb(x, a.ex, a.ey, a.hx, a.hy, 7, QP.red, QP.redD);
    const cxh = a.ex + (a.hx - a.ex) * 0.8, cyh = a.ey + (a.hy - a.ey) * 0.8; limb(x, cxh, cyh, a.hx, a.hy, 7, QP.redD);
    x.fillStyle = QP.line; x.beginPath(); x.arc(a.hx, a.hy + 1, 4.2, 0, 7); x.fill(); x.fillStyle = QP.skin; x.beginPath(); x.arc(a.hx, a.hy + 1, 3.2, 0, 7); x.fill(); rect(x, a.hx - 2, a.hy + 2, 2, 2, QP.skinD);
    prop(x, pr, a.hx, a.hy, side, p.t); };
  drawArm(sL, cx - 13, -1, p.propL); drawArm(sR, cx + 13, 1, p.propR);
  /* neck + head */
  rect(x, cx - 3, ty - 6, 7, 6, QP.skinD);
  const hx = cx + Math.round(p.look * 0.5), hy = 26; const HW = 30, HH = 29;
  rect(x, hx - HW / 2 - 1, hy, HW + 2, HH + 1, QP.line); rect(x, hx - HW / 2 - 2, hy + 3, HW + 4, HH - 7, QP.line);
  rect(x, hx - HW / 2, hy + 1, HW, HH - 1, QP.skin); rect(x, hx - HW / 2 - 1, hy + 4, HW + 2, HH - 9, QP.skin);
  rect(x, hx - HW / 2, hy + HH - 6, HW, 5, QP.skinD); rect(x, hx + HW / 2 - 6, hy + 6, 5, 14, QP.skinL);
  x.clearRect(hx - HW / 2 - 2, hy + HH - 4, 5, 6); x.clearRect(hx + HW / 2 - 3, hy + HH - 4, 6, 6); x.clearRect(hx - HW / 2 - 2, hy + HH - 7, 2, 4); x.clearRect(hx + HW / 2, hy + HH - 7, 3, 4);
  rect(x, hx - HW / 2 + 3, hy + HH - 2, HW - 6, 2, QP.skinD);
  /* ears */ rect(x, hx - HW / 2 - 3, hy + 13, 3, 6, QP.line); rect(x, hx - HW / 2 - 2, hy + 14, 2, 4, QP.skinD); rect(x, hx + HW / 2, hy + 13, 3, 6, QP.line); rect(x, hx + HW / 2, hy + 14, 2, 4, QP.skin);
  /* hair: a swept quiff, clumps and a highlight (polygons, crisped later) */
  const poly = (pts, c) => { x.fillStyle = c; x.beginPath(); x.moveTo(hx + pts[0], hy + pts[1]); for (let i = 2; i < pts.length; i += 2) x.lineTo(hx + pts[i], hy + pts[i + 1]); x.closePath(); x.fill(); };
  const H1 = [-17, 12, -18, 0, -14, -7, -6, -12, 4, -14, 14, -12, 19, -6, 18, 4, 16, 12, 12, 8, 8, 6, 2, 8, -4, 6, -9, 9, -13, 8, -14, 14];
  x.save(); x.translate(0, 0); x.lineJoin = 'round'; x.strokeStyle = QP.line; x.lineWidth = 2; x.beginPath(); x.moveTo(hx + H1[0], hy + H1[1]); for (let i = 2; i < H1.length; i += 2) x.lineTo(hx + H1[i], hy + H1[i + 1]); x.closePath(); x.stroke(); x.restore();
  poly(H1, QP.hair);
  poly([-6, -12, 4, -15, 14, -14, 20, -9, 12, -9, 4, -10, -2, -8], QP.hair); /* the quiff lifts to the right */
  poly([-2, -11, 6, -13, 13, -12, 8, -10, 2, -9], QP.hairL); poly([10, -6, 16, -5, 17, 0, 13, -2], QP.hairL); poly([-14, -3, -10, -6, -8, -4, -12, -1], QP.hairL);
  x.fillStyle = QP.line; x.fillRect(hx - 9, hy + 6, 1, 2); x.fillRect(hx + 2, hy + 7, 1, 2); x.fillRect(hx + 9, hy + 5, 1, 2);
  /* eyes + brows */
  const ex = hx + 1 + p.look, ey = hy + 15;
  const bL = ey - 4 - p.brow, bR = ey - 4 - p.brow; rect(x, ex - 10, bL, 5, 1, QP.hair); rect(x, ex + 3, bR, 5, 1, QP.hair);
  if (p.eyes === 'closed') { rect(x, ex - 10, ey + 1, 4, 1, QP.eye); rect(x, ex + 3, ey + 1, 4, 1, QP.eye); }
  else if (p.eyes === 'happy') { rect(x, ex - 10, ey + 1, 1, 1, QP.eye); rect(x, ex - 9, ey, 2, 1, QP.eye); rect(x, ex - 7, ey + 1, 1, 1, QP.eye); rect(x, ex + 3, ey + 1, 1, 1, QP.eye); rect(x, ex + 4, ey, 2, 1, QP.eye); rect(x, ex + 6, ey + 1, 1, 1, QP.eye); }
  else if (p.eyes === 'wide') { rect(x, ex - 10, ey - 2, 4, 5, QP.eye); rect(x, ex + 3, ey - 2, 4, 5, QP.eye); rect(x, ex - 9, ey - 1, 1, 1, '#FFFFFF'); rect(x, ex + 4, ey - 1, 1, 1, '#FFFFFF'); }
  else if (p.eyes === 'wink') { rect(x, ex - 10, ey - 1, 3, 4, QP.eye); rect(x, ex - 9, ey - 1, 1, 1, '#FFFFFF'); rect(x, ex + 3, ey + 1, 4, 1, QP.eye); }
  else { rect(x, ex - 10, ey - 1, 3, 4, QP.eye); rect(x, ex + 3, ey - 1, 3, 4, QP.eye); rect(x, ex - 9, ey - 1, 1, 1, '#FFFFFF'); rect(x, ex + 4, ey - 1, 1, 1, '#FFFFFF'); }
  rect(x, ex - 2, ey + 3, 2, 2, QP.skinD); rect(x, ex - 12, ey + 4, 3, 2, '#D9786A'); rect(x, ex + 6, ey + 4, 3, 2, '#D9786A'); /* cheeks */
  (FACES[p.face] || FACES.smile)(x, ex + 2, ey);
  x.restore();
  /* crisp: threshold alpha, then a 1 px outline around the silhouette */
  const im = x.getImageData(0, 0, 96, 128), d = im.data; for (let i = 3; i < d.length; i += 4) d[i] = d[i] > 110 ? 255 : 0;
  const o = new Uint8ClampedArray(d); for (let y = 0; y < 128; y++) for (let xx = 0; xx < 96; xx++) { const i = (y * 96 + xx) * 4; if (d[i + 3]) continue;
    const n = (a, b) => (a >= 0 && b >= 0 && a < 96 && b < 128 && d[(b * 96 + a) * 4 + 3]); if (n(xx + 1, y) || n(xx - 1, y) || n(xx, y + 1) || n(xx, y - 1)) { o[i] = 20; o[i + 1] = 12; o[i + 2] = 12; o[i + 3] = 255; } }
  im.data.set(o); x.putImageData(im, 0, 0);
}

/* poses library */
const POSES = {
  idle: { face: 'smile' },
  present: { lsh: 120, lel: -30, rsh: 120, rel: -30, face: 'grin', eyes: 'happy', brow: 1 },
  shrug: { lsh: 70, lel: -100, rsh: 70, rel: -100, face: 'flat', brow: 2, look: 0 },
  point: { rsh: 95, rel: 0, lsh: 10, lel: 10, face: 'smirk', look: 2 },
  yawn: { lsh: 150, lel: 30, rsh: 10, rel: 5, face: 'yawn', eyes: 'closed' },
  shock: { lsh: 40, lel: -140, rsh: 40, rel: -140, face: 'o', eyes: 'wide', brow: 3 },
  direct: { rsh: 100, rel: -20, propR: 'megaphone', lsh: 30, lel: -60, propL: 'clapperOpen', face: 'grin', eyes: 'open', brow: 1 },
  detective: { rsh: 60, rel: -70, propR: 'magnifier', face: 'o', look: 2, brow: 2 },
  paint: { rsh: 150, rel: -10, propR: 'brush', face: 'grin', eyes: 'happy' },
  cheer: { lsh: 165, lel: 0, rsh: 165, rel: 0, face: 'grin', eyes: 'happy', bob: 6, lknee: 30, rknee: 30, lhip: -20, rhip: -20 },
  trophy: { rsh: 170, rel: 0, propR: 'trophy', lsh: 20, lel: 0, face: 'grin', eyes: 'happy' },
  lean: { lsh: 10, lel: 120, rsh: 10, rel: 120, face: 'smirk', look: 3, lean: 2, brow: 1 },
};

/* ---------- Q on the site: walks, vibes, waves, reacts, can be picked up ---------- */
const store = { get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} } };
if (store.get('q-away') === '1') return;
const RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const CW = 128, CH = 160, OX = 16, OY = 32;           /* stage canvas, Q drawn at (OX,OY) */
const FOOT = 122;                                       /* Q's soles in his own canvas */
const css = `
#qm{position:fixed;left:0;bottom:0;z-index:80;width:var(--qw);height:var(--qh);pointer-events:none;will-change:transform;--qs:1}
#qm canvas{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;image-rendering:crisp-edges;pointer-events:none}
#qm .qhit{position:absolute;left:33%;right:33%;top:26%;bottom:2%;pointer-events:auto;cursor:grab;touch-action:none}
#qm.held .qhit{cursor:grabbing}
#qm .qb{position:absolute;bottom:73%;left:50%;transform:translate(var(--bx,-50%),6px) scale(.9);opacity:0;visibility:hidden;transition:opacity .18s,transform .25s cubic-bezier(.22,1,.36,1),visibility 0s .2s;
  pointer-events:auto;width:max-content;max-width:min(240px,70vw);background:#F7EEE3;color:#140C0C;border:2px solid #140C0C;box-shadow:4px 4px 0 #E0162B;padding:.55rem 1.9rem .6rem .75rem;
  font:600 .8125rem/1.35 "IBM Plex Mono",ui-monospace,Menlo,monospace;letter-spacing:0;text-transform:none}
#qm .qb.on{opacity:1;visibility:visible;transform:translate(var(--bx,-50%),0) scale(1);transition:opacity .18s,transform .25s cubic-bezier(.22,1,.36,1),visibility 0s}
#qm .qb::after{content:"";position:absolute;top:100%;left:var(--tx,50%);margin-left:-7px;border:7px solid transparent;border-top-color:#140C0C}
#qm .qb a{color:#E0162B;font-weight:700;text-decoration:underline;text-underline-offset:2px}
#qm .qx{position:absolute;top:2px;right:2px;width:24px;height:24px;border:0;background:transparent;color:#140C0C;font:700 15px/1 "IBM Plex Mono",monospace;cursor:pointer;opacity:.55}
#qm .qx:hover{opacity:1;color:#E0162B}
@media print{#qm{display:none}}`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
const root = document.createElement('div'); root.id = 'qm'; root.setAttribute('aria-hidden', 'false');
root.innerHTML = '<canvas width="' + CW + '" height="' + CH + '"></canvas><div class="qhit" role="button" tabindex="0" aria-label="Q, the Qualitide mascot. Click for a hello, drag to move him."></div><div class="qb" role="status"><span class="qt"></span><button class="qx" type="button" aria-label="Send Q away">×</button></div>';
document.body.appendChild(root);
const cv = root.querySelector('canvas'), cx = cv.getContext('2d'), hit = root.querySelector('.qhit'), bub = root.querySelector('.qb'), btx = root.querySelector('.qt');
const qc = qCanvas(), qx = qc.getContext('2d');
cx.imageSmoothingEnabled = false;

let S = 1, W = 0, H = 0, VW = 0, VH = 0;
function size() {
  VW = document.documentElement.clientWidth; VH = window.innerHeight;
  S = VW >= 900 ? 2 : 1; W = CW * S; H = CH * S;
  root.style.setProperty('--qw', W + 'px'); root.style.setProperty('--qh', H + 'px'); root.style.setProperty('--qs', S);
  pos.x = Math.min(Math.max(pos.x, -W * .3), VW - W * .7);
}
const pos = { x: -CW * 2, y: 0 }; /* y = height above the floor, CSS px */
size(); addEventListener('resize', size);

/* ---------- lines ---------- */
const contactHref = document.getElementById('contact') ? '#contact' : 'index.html#contact';
const LINES = {
  hello: ["Hi, I'm Q. I direct things here.", 'Oh hey. Didn\'t see you there.', 'Welcome to the studio 👾'],
  click: ['Every frame on this site? Made here.', 'Cut! …kidding, keep scrolling.', 'The films are better than me. Probably.', 'I\'m on the clock. (I\'m not.)', 'This beat goes hard.', 'Shh, I\'m listening to the edit.', 'One signature idea per film. That\'s the rule.', 'I storyboard in my sleep. Literally.'],
  cta: ['Got a launch coming? <a href="' + contactHref + '">Free storyboard in 24h →</a>', 'Want me to sketch yours? <a href="' + contactHref + '">Free storyboard →</a>'],
  held: ['Put me down!!', 'Whoa whoa whoa', 'I have a film to finish!'],
  land: ['I\'m okay.', 'Nailed it.', 'Ten out of ten landing.'],
  wake: ['Huh? I was… reviewing.', 'Not asleep. Rendering.'],
  bye: ['Okay, back to the edit. Bye!'],
};
const pick = a => a[(Math.random() * a.length) | 0];
let clicks = 0, bubT = 0;
function say(html, secs) { btx.innerHTML = html; bub.classList.add('on'); bubT = secs || 3.2; placeBubble(); }
function hush() { bub.classList.remove('on'); bubT = 0; }
function placeBubble() {
  const bw = bub.offsetWidth || 200, centre = pos.x + W / 2; let left = centre - bw / 2;
  left = Math.max(10, Math.min(VW - bw - 14, left)); const off = left - pos.x; /* bubble left relative to root */
  bub.style.setProperty('--bx', (off - W / 2) + 'px'); bub.style.setProperty('--tx', Math.max(14, Math.min(bw - 14, centre - left)) + 'px');
}

/* ---------- state ---------- */
let state = 'enter', tIn = 0, target = 0, dir = 1, ph = 0, vx = 0, vy = 0, idleClock = 0, blinkT = 2.5, blink = 0, react = null, hover = false, away = false;
const mouse = { x: -1e4, y: -1e4, t: 0 };
const notes = [];
function go(s) { state = s; tIn = 0; }
function newTarget() { const m = 12; target = m + Math.random() * Math.max(10, VW - W - 2 * m); dir = target > pos.x ? 1 : -1; }
function nextIdle() { const r = Math.random(); if (r < .42) { newTarget(); go('walk'); } else if (r < .8) go('vibe'); else go('idle'); }

addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; poke(); }, { passive: true });
addEventListener('scroll', poke, { passive: true });
addEventListener('keydown', poke);
function poke() { idleClock = 0; if (state === 'sleep' && !RM) { go('wake'); say(pick(LINES.wake), 2.2); } }

/* ---------- pointer: click = react, drag = pick up ---------- */
let down = null;
hit.addEventListener('pointerdown', e => { if (away) return; down = { x: e.clientX, y: e.clientY, ox: e.clientX - pos.x, oy: (VH - e.clientY) - pos.y, moved: false }; hit.setPointerCapture(e.pointerId); e.preventDefault(); });
hit.addEventListener('pointermove', e => {
  if (!down) return;
  if (!down.moved && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 5) { down.moved = true; root.classList.add('held'); go('held'); say(pick(LINES.held), 99); }
  if (down.moved) { const nx = e.clientX - down.ox, ny = (VH - e.clientY) - down.oy; vx = vx * .6 + (nx - pos.x) * .4; pos.x = nx; pos.y = Math.max(0, ny); }
});
const up = e => {
  if (!down) return; const was = down; down = null; root.classList.remove('held');
  if (was.moved) { if (RM) { pos.y = 0; go('idle'); say(pick(LINES.land), 2); } else { vy = 0; go('fall'); hush(); } }
  else doClick();
};
hit.addEventListener('pointerup', up); hit.addEventListener('pointercancel', up);
hit.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); doClick(); } });
hit.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; hover = true; if (['walk', 'idle', 'vibe'].includes(state)) { go('wave'); if (!bub.classList.contains('on')) say(pick(LINES.hello), 2.6); } });
hit.addEventListener('pointerleave', () => { hover = false; });
function doClick() {
  idleClock = 0; clicks++;
  const r = ['cheer', 'direct', 'shrug', 'trophy', 'paint', 'detective', 'present', 'point'];
  react = pick(r.filter(k => k !== react)); go('react');
  say(clicks % 3 === 2 ? pick(LINES.cta) : pick(LINES.click), clicks % 3 === 2 ? 6 : 3);
}
bub.querySelector('.qx').addEventListener('click', e => {
  e.stopPropagation(); away = true; store.set('q-away', '1'); say(LINES.bye[0], 1.6);
  dir = pos.x + W / 2 < VW / 2 ? -1 : 1; target = dir < 0 ? -W - 20 : VW + 20; go('leave');
});

/* ---------- poses ---------- */
function pose(t, dt) {
  const look = Math.max(-3, Math.min(3, Math.round((mouse.x - (pos.x + W / 2)) / (90 * S))));
  let p = { t: t };
  switch (state) {
    case 'enter': case 'walk': case 'leave': {
      const sw = Math.sin(ph), cs = Math.cos(ph);
      p = { lhip: -sw * 22, rhip: sw * 22, lknee: Math.max(0, -cs) * 22, rknee: Math.max(0, cs) * 22, lsh: sw * 22, rsh: -sw * 22, lel: 12 + Math.max(0, sw) * 14, rel: 12 + Math.max(0, -sw) * 14,
        bob: Math.round(Math.abs(cs) * 1.5), look: dir * 2, lean: dir, face: state === 'leave' ? 'grin' : 'smile', eyes: state === 'leave' ? 'happy' : 'open' };
      break; }
    case 'vibe': {
      const beat = t * (96 / 60) * Math.PI, b = Math.abs(Math.sin(beat)), s2 = Math.sin(beat);
      const style = Math.floor(tIn / 4) % 2; /* two grooves: fist pump, then shoulder bounce */
      p = style === 0
        ? { lsh: 40 + b * 10, lel: -120 + s2 * 18, rsh: 40 + b * 10, rel: -120 - s2 * 18, eyes: 'closed', face: 'smile', bob: -Math.round(b * 2.5), lean: s2 > 0 ? 1 : -1, lknee: 6 + b * 12, rknee: 6 + b * 12, lhip: -4, rhip: -4 }
        : { lsh: 14 + b * 18, lel: 40 + b * 40, rsh: 14 + (1 - b) * 18, rel: 40 + (1 - b) * 40, eyes: tIn % 4 < 2 ? 'closed' : 'happy', face: tIn % 4 < 2 ? 'smirk' : 'grin', bob: -Math.round(b * 2), lean: Math.round(s2 * 2), lknee: b * 10, rknee: (1 - b) * 10 };
      break; }
    case 'wave': p = { rsh: 160, rel: -25 + Math.sin(tIn * 14) * 22, face: 'grin', eyes: 'happy', look: look, brow: 1 }; break;
    case 'react': p = Object.assign({}, POSES[react] || POSES.cheer, { look: (POSES[react] || {}).look || look }); break;
    case 'held': { const sw = Math.max(-1, Math.min(1, vx / 30)), wob = Math.sin(t * 9) * 6;
      p = Object.assign({}, POSES.shock, { lhip: 14 + wob - sw * 16, rhip: 14 - wob + sw * 16, lknee: 26 + wob, rknee: 18 - wob, lean: Math.round(-sw * 2) }); break; }
    case 'fall': p = { lsh: 150, lel: -20, rsh: 150, rel: -20, face: 'o', eyes: 'wide', brow: 3, lhip: 10, rhip: 10, lknee: 20, rknee: 20 }; break;
    case 'land': { const k = Math.min(1, tIn / .22); p = { squash: 0.84 + 0.16 * k, lknee: 30 * (1 - k), rknee: 30 * (1 - k), lhip: -12 * (1 - k), rhip: -12 * (1 - k), face: 'flat', eyes: 'happy', lsh: 40, rsh: 40 }; break; }
    case 'yawn': p = POSES.yawn; break;
    case 'sleep': p = { eyes: 'closed', face: 'flat', bob: -2 - Math.round((Math.sin(t * 1.6) + 1)), lean: 2, look: -2, lsh: 10, lel: 110, rsh: 10, rel: 110 }; break;
    case 'wake': p = Object.assign({}, POSES.shock, { look: look }); break;
    default: p = { look: look, face: 'smile' };
  }
  if (blink > 0 && (!p.eyes || p.eyes === 'open')) p.eyes = 'closed';
  p.t = t; return p;
}

/* ---------- little pixel sprites: notes and z's ---------- */
const NOTE = ['..##', '..#.', '..#.', '..#.', '###.', '###.'], NOTE2 = ['.####', '.#..#', '.#..#', '##.##', '##.##'], ZED = ['####', '..#.', '.#..', '####'];
function sprite(m, x, y, c, a) { cx.globalAlpha = a; for (let r = 0; r < m.length; r++) for (let k = 0; k < m[r].length; k++) if (m[r][k] === '#') { cx.fillStyle = '#140C0C'; cx.fillRect(Math.round(x + k) - 0, Math.round(y + r) + 1, 1, 1); } for (let r = 0; r < m.length; r++) for (let k = 0; k < m[r].length; k++) if (m[r][k] === '#') { cx.fillStyle = c; cx.fillRect(Math.round(x + k), Math.round(y + r), 1, 1); } cx.globalAlpha = 1; }
let noteT = 0, zT = 0;

/* ---------- loop ---------- */
let last = performance.now(), acc = 0, lastKey = '', T = 0;
const STEP = 1 / 24;
function frame(now) {
  requestAnimationFrame(frame);
  let dt = Math.min(.1, (now - last) / 1000); last = now; T += dt; acc += dt;
  update(dt);
  root.style.transform = 'translate3d(' + Math.round(pos.x) + 'px,' + (-Math.round(pos.y)) + 'px,0)';
  if (bub.classList.contains('on')) placeBubble();
  if (acc < STEP) return; acc = 0;
  render(T);
}
function update(dt) {
  tIn += dt; idleClock += dt;
  if (bubT > 0 && bubT < 90) { bubT -= dt; if (bubT <= 0) hush(); }
  blinkT -= dt; if (blinkT <= 0) { blink = .13; blinkT = 2.5 + Math.random() * 3; } if (blink > 0) blink -= dt;
  if (RM) { if (state === 'enter') { pos.x = VW - W - 24; go('idle'); } if (state === 'react' && tIn > 2.2) go('idle'); if (state === 'wave' && tIn > 1.6) go('idle'); if (state === 'leave') { root.style.display = 'none'; } return; }
  const spd = 34 * S;
  switch (state) {
    case 'enter': if (T < 3.2) { pos.x = -W; break; } if (!target) { target = VW * (.12 + Math.random() * .2); dir = 1; }
      ph += dt * 9; pos.x += spd * dt; if (pos.x >= target) { go('wave'); say(pick(LINES.hello), 3); } break;
    case 'walk': ph += dt * 9; pos.x += dir * spd * dt; if ((dir > 0 && pos.x >= target) || (dir < 0 && pos.x <= target)) { pos.x = target; go(Math.random() < .55 ? 'vibe' : 'idle'); } break;
    case 'leave': ph += dt * 11; pos.x += dir * spd * 1.5 * dt; if (pos.x < -W - 10 || pos.x > VW + 10) { root.remove(); } break;
    case 'vibe': if (tIn > 7 + Math.random() * 0) nextAfter(); break;
    case 'idle': if (tIn > 2.5) nextAfter(); break;
    case 'wave': if (tIn > 1.4 && !hover) go('idle'); break;
    case 'react': { const hop = react === 'cheer' ? Math.max(0, Math.sin(Math.min(1, tIn / .5) * Math.PI)) * 26 * S : 0; pos.y = hop; if (tIn > 2.1) { pos.y = 0; go('idle'); } break; }
    case 'held': vx *= .9; break;
    case 'fall': vy -= 2600 * dt; pos.y += vy * dt; if (pos.y <= 0) { pos.y = 0; go('land'); } break;
    case 'land': if (tIn > .5) { go('idle'); say(pick(LINES.land), 2); } break;
    case 'yawn': if (tIn > 1.6) go('sleep'); break;
    case 'wake': if (tIn > .9) go('idle'); break;
  }
  if (['idle', 'vibe', 'walk'].includes(state) && idleClock > 28) { go('yawn'); hush(); }
  pos.x = Math.min(Math.max(pos.x, state === 'enter' || state === 'leave' ? -W - 40 : -W * .3), state === 'leave' ? VW + 40 : VW - W * .7);
  /* particles */
  if (state === 'vibe') { noteT -= dt; if (noteT <= 0) { noteT = 60 / 96 * 2; notes.push({ x: 44 + Math.random() * 40, y: 46, vx: (Math.random() - .5) * 10, a: 1, k: Math.random() < .5 ? 0 : 1, c: pick(['#F2C14E', '#F7EEE3', '#E0162B']) }); } }
  if (state === 'sleep') { zT -= dt; if (zT <= 0) { zT = 1.1; notes.push({ x: 70, y: 46, vx: 6, a: 1, k: 2, c: '#F7EEE3' }); } }
  for (let i = notes.length - 1; i >= 0; i--) { const n = notes[i]; n.y -= dt * 16; n.x += n.vx * dt + Math.sin(T * 3 + i) * dt * 4; n.a -= dt * .45; if (n.a <= 0) notes.splice(i, 1); }
}
function nextAfter() { if (hover) return go('wave'); nextIdle(); }
function render(t) {
  const p = pose(t);
  const key = JSON.stringify(p, (k, v) => (typeof v === 'number' && k !== 't' ? Math.round(v) : k === 't' ? undefined : v));
  if (key !== lastKey) { drawQ(qx, p); lastKey = key; }
  cx.clearRect(0, 0, CW, CH);
  /* shadow: shrinks when he's in the air */
  const air = Math.min(1, pos.y / (120 * S)), sw = Math.round(26 * (1 - air * .6));
  cx.globalAlpha = pos.y > 2 ? 0 : .45; cx.fillStyle = '#000'; cx.beginPath(); cx.ellipse(64, OY + FOOT + 2 + Math.round(pos.y / S) * 0, sw, 3, 0, 0, 7); cx.fill(); cx.globalAlpha = 1;
  cx.drawImage(qc, OX, OY);
  notes.forEach(n => sprite(n.k === 2 ? ZED : n.k ? NOTE2 : NOTE, n.x, n.y, n.c, Math.max(0, n.a)));
}
requestAnimationFrame(frame);

})();
