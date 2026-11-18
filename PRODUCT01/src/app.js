/* KNOBLE product page */
import {createKnoble} from './knoble3d.js';
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t;
const ease = t => 1 - Math.pow(1 - t, 3);
const fine = matchMedia('(hover:hover)').matches;

/* ================= text split + reveal ================= */
$$('.split').forEach(el => {
  const chars = el.dataset.split === 'chars'; let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) { const parts = chars ? [...n.textContent] : n.textContent.split(/(\s+)/); const frag = document.createDocumentFragment();
      parts.forEach(p => { if (!p) return; if (/^\s+$/.test(p)) { frag.append(p); return; } const w = document.createElement('span'); w.className = 'w'; const s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++); w.append(s); frag.append(w); });
      n.replaceWith(frag); } else if (n.nodeType === 1) walk(n); });
  walk(el);
});
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold: .12});
$$('.reveal,.split,.persona,.sum-map,.dimfig').forEach(el => io.observe(el));
$$('.cards,.sum-rows,.howto,.specs,.faq,.cmf').forEach(g => [...g.children].forEach((c, i) => c.style.setProperty('--rd', i * .08 + 's')));
setTimeout(() => $('.hero h1').classList.add('in'), 150);

/* ================= nav, progress, cursor, magnet, tilt ================= */
const secIO = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) $$('.nav .tabs a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
}), {rootMargin: '-45% 0px -50% 0px'});
$$('section[id]').forEach(s => secIO.observe(s));
const cur = $('#cursor'); let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, {passive: true});
(function loop() { cx += (mx - cx) * .12; cy += (my - cy) * .12; cur.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(loop); })();
if (fine) {
  $$('.mag').forEach(b => { b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
    b.addEventListener('pointerleave', () => b.style.transform = ''); });
  $$('.tilt').forEach(c => { c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-4px)`; c.style.boxShadow = '0 30px 70px rgba(60,50,110,.14)'; });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; c.style.boxShadow = ''; }); });
}
// count-up
const cio = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; cio.unobserve(e.target); const el = e.target, to = +el.dataset.count, suf = el.dataset.suffix || '';
  const t0 = performance.now(); const tick = now => { const t = clamp((now - t0) / 1400, 0, 1); el.textContent = Math.round(to * ease(t)) + suf; if (t < 1) requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
$$('[data-count]').forEach(el => cio.observe(el));
// statement scrub
{ const el = $('#scrub'); const words = el.textContent.split(/\s+/); el.innerHTML = words.map(w => `<span class="${/손끝|듣습니다/.test(w) ? 'hlw' : ''}">${w}</span>`).join(' ');
  el._spans = [...el.querySelectorAll('span')]; }

/* ================= scroll driver ================= */
const layers = $('#layers'), lys = $$('.ly');
function onScroll() {
  const h = document.documentElement, p = h.scrollTop / (h.scrollHeight - innerHeight); $('#progress').style.transform = `scaleX(${p})`;
  // orbs parallax
  $$('.orb').forEach((o, i) => o.style.transform = `translateY(${h.scrollTop * (i - 1) * -.06}px)`);
  // statement
  const sc = $('#scrub'), r = sc.getBoundingClientRect(), t = clamp((innerHeight * .85 - r.top) / (r.height + innerHeight * .35), 0, 1), n = Math.floor(t * sc._spans.length * 1.05);
  sc._spans.forEach((s, i) => { s.classList.toggle('lit', i < n); s.classList.toggle('hl', i < n && s.classList.contains('hlw')); });
  // layers explode
  const lr = layers.getBoundingClientRect(), lp = clamp((innerHeight * .9 - lr.top) / (innerHeight * .7), 0, 1);
  lys.forEach((l, i) => { l.style.top = `${110 + i * lerp(14, 74, ease(lp)) - lp * 90}px`; l.style.setProperty('--lo', clamp(lp * 1.6 - .5, 0, 1)); });
  cineScroll();
}
addEventListener('scroll', onScroll, {passive: true});

/* ================= pad helpers & SVG ================= */
const GR = 33.2, PI_ = 4.8, HS = 2.2;
const valid = (x, y) => Math.abs(x) <= 3 && Math.abs(y) <= 3 && !(Math.abs(x) === 3 && Math.abs(y) === 3);
const CELLS = []; for (let y = 3; y >= -3; y--) for (let x = -3; x <= 3; x++) if (valid(x, y)) CELLS.push([x, y]);
const key = (x, y) => x + ',' + y, parse = k => k.split(',').map(Number), cheb = (a, b) => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));
const cellUV = (x, y) => [(HS + PI_ * (x + 3)) / GR, (HS + PI_ * (3 - y)) / GR];
const CORN = {tl: [183, 156, 245], tr: [245, 150, 200], bl: [126, 192, 242], br: [248, 186, 143]};
const mix = (a, b, t) => a.map((c, i) => c + (b[i] - c) * t);
const baseRGB = (u, v) => mix(mix(CORN.tl, CORN.tr, u), mix(CORN.bl, CORN.br, u), v);
function toHSL([r, g, b]) { r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; } return [h, s, l]; }
function fromHSL([h, s, l]) { const f = (p, q, t) => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < .5 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
  if (!s) return [l * 255, l * 255, l * 255]; const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; return [f(p, q, h + 1 / 3) * 255, f(p, q, h) * 255, f(p, q, h - 1 / 3) * 255]; }
const vivid = rgb => { const [h, s] = toHSL(rgb); return fromHSL([h, Math.min(1, s * 1.4 + .25), .6]); };
const rgba = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
function describe(x, y) {
  const a = Math.max(Math.abs(x), Math.abs(y)), lv = ['', '약하게', '보통', '강하게'][a];
  const name = !x && !y ? '중립' : x < 0 && y > 0 ? '과제에 집중' : x < 0 && y < 0 ? '쉬면서 남은 일 확인' : x > 0 && y > 0 ? '축제를 적극적으로' : x > 0 && y < 0 ? '여유롭게 둘러보기' : x < 0 ? '업무 쪽' : x > 0 ? '오락 쪽' : y > 0 ? '활동 쪽' : '휴식 쪽';
  return (lv ? lv + ' · ' : '') + name;
}
function gridSVG({lit = {}, ring = [], paths = [], dim = false, labels = [], cls = ''} = {}) {
  const S = 100 / GR; let s = `<svg viewBox="-9 -9 118 118" xmlns="http://www.w3.org/2000/svg" class="${cls}"><defs><filter id="gl${cls}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4"/></filter></defs>`;
  s += `<rect x="-6" y="-6" width="112" height="112" rx="22" fill="#fff" stroke="#ece9f4"/>`;
  const w = (HS * 2 * S).toFixed(2);
  for (const [x, y] of CELLS) {
    const [u, v] = cellUV(x, y), L = lit[key(x, y)], base = baseRGB(u, v);
    let c = dim ? mix(base, [236, 234, 242], .62) : mix(base, [255, 255, 255], .22);
    const X = (u * 100 - HS * S).toFixed(2), Y = (v * 100 - HS * S).toFixed(2);
    if (L) { const vc = L.c || vivid(base); c = mix(c, vc, Math.min(1, L.a)); if (L.a > .6) s += `<rect x="${X - 2}" y="${Y - 2}" width="${+w + 4}" height="${+w + 4}" rx="4" fill="${rgba(vc, .85)}" filter="url(#gl${cls})"/>`; }
    s += `<rect class="cell" data-k="${key(x, y)}" x="${X}" y="${Y}" width="${w}" height="${w}" rx="2.6" fill="${rgba(c)}"/>`;
  }
  for (const r of ring) { const [u, v] = cellUV(...r.at);
    s += `<rect x="${(u * 100 - HS * S - 2).toFixed(2)}" y="${(v * 100 - HS * S - 2).toFixed(2)}" width="${+w + 4}" height="${+w + 4}" rx="4" fill="${r.fill || 'none'}" stroke="${r.c}" stroke-width="1.6"><animate attributeName="opacity" values="1;.25;1" dur="1.1s" repeatCount="indefinite"/></rect>`; }
  for (const p of paths) s += `<polyline points="${p.cells.map(c => cellUV(...c).map(t => (t * 100).toFixed(2)).join(',')).join(' ')}" fill="none" stroke="${p.c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity=".85" ${p.dash ? `stroke-dasharray="${p.dash}"` : ''}/>`;
  for (const l of labels) { const [u, v] = cellUV(...l.at); s += `<text x="${(u * 100 + (l.dx || 0)).toFixed(1)}" y="${(v * 100 + (l.dy || -7)).toFixed(1)}" font-size="5" font-weight="700" text-anchor="middle" fill="${l.c}" font-family="Inter,sans-serif">${l.t}</text>`; }
  const ax = (t, x, y) => `<text x="${x}" y="${y}" font-size="4.6" fill="#a1a1a8" text-anchor="middle" font-family="sans-serif">${t}</text>`;
  return s + ax('활동', 50, -1.5) + ax('휴식', 50, 106) + ax('업무', -3.5, 51.5) + ax('오락', 103.5, 51.5) + '</svg>';
}

/* ---- feature 01: state map (hover) ---- */
{ const box = $('#vizMap'), out = $('#mapOut'); let sel = '0,0';
  const draw = () => { box.innerHTML = gridSVG({lit: {[sel]: {a: 1.2}}, dim: true, cls: 'm'}); };
  draw();
  const pick = e => { const k = e.target.dataset && e.target.dataset.k; if (!k || k === sel) return; sel = k; draw(); const [x, y] = parse(k);
    out.innerHTML = `<b>${describe(x, y)}</b>&nbsp;· ${x <= 0 ? '업무 ' + -x : '오락 ' + x} / ${y >= 0 ? '활동 ' + y : '휴식 ' + -y}`; };
  box.addEventListener('pointerover', pick); box.addEventListener('click', pick); }
/* ---- feature 02: path replay ---- */
{ const box = $('#vizPath'); const seq = [[0, 0, 300], [1, 0, 260], [1, 1, 900], [0, 1, 260], [1, 1, 300], [0, 1, 240], [-1, 2, 300], [-2, 2, 1200]]; let tm = [];
  const play = () => { tm.forEach(clearTimeout); tm = []; let t = 0, path = [], dw = 0, rev = 0, last = null, dir = null;
    const render = (fin) => { const lit = {}; path.forEach((c, i) => lit[key(...c)] = {a: .2 + .65 * ((i + 1) / path.length)}); if (fin) lit[key(...path[path.length - 1])] = {a: 1.3};
      box.innerHTML = gridSVG({lit, dim: true, cls: 'p', paths: path.length > 1 ? [{cells: path, c: '#9b7cf5', dash: '1.5 2'}] : []});
      $('#pLen').textContent = path.length; $('#pDw').textContent = (dw / 1000).toFixed(1); $('#pRev').textContent = rev; };
    seq.forEach(([x, y, ms], i) => { tm.push(setTimeout(() => { if (last) { const d = [x - last[0], y - last[1]]; if (dir && d[0] * dir[0] + d[1] * dir[1] < 0) rev++; dir = d; }
      path.push([x, y]); last = [x, y]; dw = Math.max(dw, ms); render(i === seq.length - 1); }, t)); t += ms; });
    tm.push(setTimeout(play, t + 2600)); };
  const pio = new IntersectionObserver(es => { if (es[0].isIntersecting) { play(); pio.disconnect(); } }); pio.observe(box);
  box.innerHTML = gridSVG({dim: true, cls: 'p'}); $('#pReplay').onclick = play; }
/* ---- feature 03: AI suggestion ---- */
{ const box = $('#vizSuggest'), dl = $('#dl'); let me = [2, 1];
  const draw = () => { const lit = {[key(...me)]: {a: 1.15}}; const sug = dl.checked && me[0] > 0 ? [-2, me[1] >= 0 ? 2 : -1] : null;
    box.innerHTML = gridSVG({lit, dim: true, cls: 's', ring: sug ? [{at: sug, c: '#8E7CFF', fill: 'rgba(142,124,255,.45)'}] : [], labels: [{at: me, t: '나', c: '#d14f97'}, ...(sug ? [{at: sug, t: 'AI', c: '#6A5AE0'}] : [])]}); };
  draw(); dl.onchange = draw; box.addEventListener('click', e => { const k = e.target.dataset && e.target.dataset.k; if (!k) return; me = parse(k); draw(); }); }
/* ---- summary map ---- */
{ const P1 = [[0, 0], [1, 0], [2, 1], [1, 1], [0, 1], [-1, 2], [-2, 2]], P2 = [[0, 0], [1, 1], [2, 2], [2, 3]], P3 = [[0, 0], [0, -1], [0, -2], [0, -3]];
  const l3 = {}; [[P1, [155, 124, 245]], [P2, [240, 127, 184]], [P3, [111, 181, 238]]].forEach(([p, c]) => p.forEach((q, i) => { l3[key(...q)] = {a: i === p.length - 1 ? 1.2 : .35, c}; }));
  $('#sumMap').innerHTML = gridSVG({lit: l3, dim: true, cls: 'sum', paths: [{cells: P1, c: '#9b7cf5'}, {cells: P2, c: '#f07fb8'}, {cells: P3, c: '#6fb5ee'}],
    labels: [{at: [-2, 2], t: 'EP1', c: '#7d5de8'}, {at: [2, 3], t: 'EP2', c: '#d9549b', dy: -6.5}, {at: [0, -3], t: 'EP3', c: '#3f93d6', dy: 9.5}]}); }
/* ---- dimension drawing ---- */
{ const S = 1.5, o = 11; // 52mm device in 100 units box
  let s = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="${o}" y="${o}" width="${52 * S}" height="${52 * S}" rx="${14 * S}" fill="#fbf9f6" stroke="#e5e0d8" stroke-width=".4"/>`;
  s += `<rect x="${o + 9.4 * S}" y="${o + 9.4 * S}" width="${33.2 * S}" height="${33.2 * S}" rx="${3 * S}" fill="none" stroke="#ece8f5" stroke-width=".4"/>`;
  for (const [x, y] of CELLS) { const [u, v] = cellUV(x, y), c = mix(baseRGB(u, v), [255, 255, 255], .2); s += `<rect x="${(o + 9.4 * S + u * 33.2 * S - 2.2 * S).toFixed(2)}" y="${(o + 9.4 * S + v * 33.2 * S - 2.2 * S).toFixed(2)}" width="${4.4 * S}" height="${4.4 * S}" rx=".9" fill="${rgba(c)}"/>`; }
  const L = (x1, y1, x2, y2) => `<line class="dline" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  s += L(o, 95, o + 78, 95) + L(o, 93, o, 97) + L(o + 78, 93, o + 78, 97) + `<text x="50" y="99" text-anchor="middle">52 mm</text>`;
  s += L(o + 14.1, 6, o + 63.9, 6) + L(o + 14.1, 4, o + 14.1, 8) + L(o + 63.9, 4, o + 63.9, 8) + `<text x="50" y="4" text-anchor="middle">패드 영역 33.2 mm</text>`;
  s += L(95, o, 95, o + 78) + L(93, o, 97, o) + L(93, o + 78, 97, o + 78) + `<text x="97" y="52" text-anchor="middle" transform="rotate(90 97 52)">52 mm</text>`;
  s += L(5, 50 - 3.3, 5, 50 + 3.3) + `<text x="3" y="58" text-anchor="middle">4.4</text><text x="50" y="${o + 52 * S / 2 + 31}" text-anchor="middle" style="fill:#a1a1a8">두께 15.5 mm · 패드 간격 4.8 mm</text></svg>`;
  $('#dimFig').innerHTML = s; }

/* ================= problem: mismatch ================= */
{ const D = [['축제를 좋아하고, 늘 축제 소식을 챙긴다', '→ AI: 라인업 공개! 푸드트럭 위치 안내!', '마감까지 집중하고 싶다', '→ 필요한 것: 조용한 한 시간'],
    ['작년 축제 운영진이었다', '→ AI: 운영 점검 18:00 · 재고 확인', '오늘은 방문객으로 즐기고 싶다', '→ 필요한 것: 안내는 최소한, 발견은 직접'],
    ['밤에도 일정을 꼼꼼히 확인한다', '→ AI: 내일 회의 자료 · 사진 52장 업로드', '아무것도 안 하고 쉬고 싶다', '→ 필요한 것: 낮은 조명, 조용한 방']];
  $$('.mm-tabs button').forEach(b => b.onclick = async () => { $$('.mm-tabs button').forEach(x => x.classList.toggle('on', x === b)); const d = D[+b.dataset.i];
    $$('.mm-card').forEach(c => c.classList.add('swap')); await sleep(300);
    $('#mmPast').textContent = d[0]; $('#mmPastAi').textContent = d[1]; $('#mmNow').textContent = d[2]; $('#mmNowAi').textContent = d[3];
    $$('.mm-card').forEach(c => c.classList.remove('swap')); }); }

/* ================= guide quadrants ================= */
{ const Q = {tl: ['업무 · 활동', '과제에 집중', '마감, 과제, 몰입이 필요한 순간이에요.', ['🔕 알림: 급한 것만 남기고 보류', '🧭 안내: 남은 할 일과 마감 시간', '💡 환경: 밝고 차분한 조명']],
    tr: ['오락 · 활동', '축제를 적극적으로', '사람들과 어울리고 새로운 걸 경험하고 싶을 때예요.', ['🎡 알림: 업무 알림은 내일로', '🎤 안내: 꼭 필요한 하나만 (예: 공연 시간)', '✨ 나머지: 직접 발견할 여지를 남김']],
    bl: ['업무 · 휴식', '쉬면서 남은 일 확인', '잠깐 숨을 돌리며 남은 일을 가볍게 훑고 싶을 때예요.', ['📋 알림: 요약해서 한 번에', '🧭 안내: 남은 일 목록만 조용히', '☕ 환경: 따뜻한 조명']],
    br: ['오락 · 휴식', '여유롭게 둘러보기', '서두르지 않고 천천히 즐기고 싶을 때예요.', ['🌿 알림: 거의 없음', '🗺️ 안내: 한적한 곳 위주', '🎧 환경: 잔잔한 음악']],
    c: ['중립', '지금은 정하지 않음', '특별한 의도 없이 평소처럼 지내는 상태예요.', ['🔔 알림: 평소대로', '🧭 안내: 평소대로', '— AI는 기본 설정을 따라요']]};
  let lv = 0; setInterval(() => { lv = (lv + 1) % 3; $$('.lv i').forEach((i, k) => i.classList.toggle('on', k === lv)); }, 1400);
  const set = async q => { $$('.q').forEach(b => b.classList.toggle('on', b.dataset.q === q)); const d = Q[q], el = $('#qinfo'); el.classList.add('swap'); await sleep(220);
    $('#qTag').textContent = d[0]; $('#qTitle').textContent = d[1]; $('#qDesc').textContent = d[2]; $('#qList').innerHTML = d[3].map(x => `<li>${x}</li>`).join(''); el.classList.remove('swap'); };
  $$('.q').forEach(b => { b.onclick = () => set(b.dataset.q); if (fine) b.onpointerenter = () => set(b.dataset.q); }); set('tl'); }

/* ================= 3D: hero ================= */
const hero = createKnoble($('#heroGL'), {controls: {enableZoom: false, minPolarAngle: .15, maxPolarAngle: 1.2, minAzimuthAngle: -.8, maxAzimuthAngle: .8}});
hero.onReady = () => $('#heroLoading').classList.add('off');
hero.onState = ([s, c], G) => { $('#hState').textContent = G.mode === 'draw' ? s + '…' : s; $('#hCoord').textContent = c; if (G.mode === 'settled') bump('#heroHud'); };
hero.onTouch = () => { hero.stopDemo(); $('#heroHint').classList.add('off'); };
const bump = sel => { const el = $(sel); el.classList.add('bump'); setTimeout(() => el.classList.remove('bump'), 260); };
const HERO_DEMO = [[0, 0, 260], [0, 1, 220], [-1, 1, 220], [-1, 2, 700], [0, 2, 260], [1, 2, 520], [0, 2, 240], [-1, 2, 220], [-2, 2, 260], [-2, 3, 900]];
setTimeout(() => { if (!hero.interacted) hero.playDemo(HERO_DEMO, true); }, 1200);

/* ================= 3D: hands-on viewer ================= */
const vw = createKnoble($('#viewGL'), {camera: [1.25, 1.55, 1.9], controls: {enableZoom: true, minDistance: 1.3, maxDistance: 4.5, autoRotate: true, autoRotateSpeed: .9}});
vw.onReady = () => { $('#viewLoading').classList.add('off'); };
vw.onTouch = () => { vw.controls.autoRotate = false; $('#vhint').classList.add('off'); };
vw.onState = ([s, c], G) => { $('#vState').textContent = G.mode === 'draw' ? s + '…' : s; $('#vCoord').textContent = c; if (G.mode === 'settled') bump('#vhud'); };
const HOT = {pads: ['패드 45개', '4.4mm 젖빛 반투명 키캡. 정전식으로 터치와 경로를 감지하고, 0.5mm 눌려 확정 입력을 받아요. 빛 모드에서 직접 그려 보세요.'],
  axis: ['축 아이콘', '상판에 흰 잉크로 인쇄된 네 방향 표시. 위 활동 · 아래 휴식 · 왼쪽 업무 · 오른쪽 오락.'],
  ring: ['테두리 빛점', '링을 따라 움직이는 라벤더 빛점이 현재 상태나 AI 제안의 방향을 알려 줘요.'],
  panel: ['발광면', '패드 아래 2.8mm 공기층 너머의 4색 파스텔 지도. 분해해서 보면 네 영역의 색이 보여요.'],
  usb: ['USB-C 포트', '측면의 충전 포트. 화면도 버튼도 없이, 포트 하나만 남겼어요.'],
  core: ['하부 코어', '배터리와 오프라인 MCU AI가 들어가는 자리. 데이터는 기기 밖으로 나가지 않아요.']};
const hotEls = $$('#hots button');
const showHot = async h => { hotEls.forEach(b => b.classList.toggle('on', b.dataset.h === h)); const p = $('#vpanel'); p.classList.add('swap'); await sleep(200);
  $('#vpN').textContent = [...hotEls].find(b => b.dataset.h === h).textContent; $('#vpT').textContent = HOT[h][0]; $('#vpD').textContent = HOT[h][1]; p.classList.remove('swap'); };
hotEls.forEach(b => b.onclick = e => { e.stopPropagation(); vw.onTouch(); showHot(b.dataset.h); if (b.dataset.h === 'panel' || b.dataset.h === 'core') { $('#explode').value = 70; $('#explode').oninput(); } });
showHot('pads');
vw.onFrame = () => { if (!vw.anchors) return; hotEls.forEach(b => { const a = vw.anchors[b.dataset.h]; if (!a) return; const p = vw.project(a, b.dataset.part); b.style.transform = `translate(${p.x}px,${p.y}px)`; b.style.opacity = p.behind ? 0 : ''; }); };
$$('.vtools [data-view]').forEach(b => b.onclick = () => { $$('.vtools [data-view]').forEach(x => x.classList.toggle('on', x === b)); vw.onTouch(); vw.view(b.dataset.view); });
$('#explode').oninput = () => { const v = $('#explode').value / 100; vw.setExplode(v); $('#exOut').textContent = Math.round(v * 100) + '%'; if (v > .05) vw.reset(); };
let aiT = 0;
$$('.vtools [data-mode]').forEach(b => b.onclick = () => { $$('.vtools [data-mode]').forEach(x => x.classList.toggle('on', x === b)); vw.onTouch(); clearTimeout(aiT); vw.stopDemo(); vw.suggest = null; vw.reset();
  const m = b.dataset.mode; vw.setMode(m === 'off' ? 'off' : 'base');
  if (m === 'draw' || m === 'ai') { $('#explode').value = 0; $('#explode').oninput(); vw.view('top'); $$('.vtools [data-view]').forEach(x => x.classList.toggle('on', x.dataset.view === 'top')); }
  if (m === 'draw') { vw.playDemo([[0, 0, 300], [1, 1, 260], [2, 2, 260], [2, 3, 900]], false); }
  if (m === 'ai') { vw.playDemo([[0, 0, 360], [1, 0, 320], [2, 1, 600]], false, () => { vw.suggest = vw.cell(-2, 2); $('#vState').textContent = 'AI 제안 · 업무·활동 쪽은 어때요?'; aiT = setTimeout(() => {
    vw.playDemo([[2, 1, 300], [1, 1, 260], [0, 1, 260], [-1, 2, 260], [-2, 2, 900]], false, () => { vw.suggest = null; }); }, 1800); }); }
});

/* ================= cinematic day ================= */
const EPS = [
  {k: 'day', time: '16:00', place: '학생회실', title: '축제 전, 과제 마무리', a: './assets/videos/ep1_a.mp4', poster: './assets/images/p_ep1_a.jpg', frame: './assets/images/f_ep1.jpg', tg: 'linear-gradient(160deg,#ffe2b8,#f7b6c8 55%,#c9b4f3)',
    quad: [[586, 280], [683, 280], [684, 360], [585, 360]], back: [234, 225, 222],
    narrA: [[0.4, '오후 4시. 축제 기획 보고서 마감까지 한 시간.'], [4.6, '창밖은 축제 준비로 들뜨고, 휴대폰은 쉬지 않고 울린다.'], [8.4, '도윤은 Knoble에 손을 올린다.']],
    notesA: [[2.2, '🎪', '축제 운영본부', '라인업 공개! 오늘 19:30 메인 공연'], [3.2, '💬', '학생회 단톡 · 12', '부스 체크리스트 확인 부탁해요'], [4.2, '🍜', '축제 안내', '푸드트럭 위치가 업데이트됐어요'], [5.2, '👋', '친구 · 민재', '언제 와?? 다들 모였어']],
    phases: [{to: [2, 1], ghost: [[0, 0], [1, 0], [2, 1]], step: 'STEP 1 / 2', text: '빛나는 중앙에서 오른쪽(오락)으로 쓸어 보세요', ai: '창밖 축제 소리에 마음이 기울어요'},
      {to: [-2, 2], ghost: [[2, 1], [1, 1], [0, 1], [-1, 2], [-2, 2]], suggest: [-2, 2], step: 'STEP 2 / 2', text: '손을 떼지 말고, AI가 제안한 빛까지 끌어가세요', ai: 'AI · 마감까지 1시간 남았어요. 업무·활동 쪽은 어때요?'}],
    result: '확정 · 강하게 과제에 집중', good: ['🔕', 'Knoble · 업무·활동', '알림 23개 보류 · 마감까지 집중'], color: '#9b7cf5',
    after: [{v: './assets/videos/ep1_b1.mp4', narr: [[0.3, '알림이 조용히 접힌다.']]}, {laptop: true}, {v: './assets/videos/ep1_b2.mp4', narr: [[0.3, '한 시간 뒤, 제출 완료.'], [2.4, '이제, 축제로.']]}]},
  {k: 'dusk', time: '18:30', place: '축제 정문', title: '축제 입장', a: './assets/videos/ep2_a.mp4', poster: './assets/images/p_ep2_a.jpg', frame: './assets/images/f_ep2.jpg', tg: 'linear-gradient(160deg,#f6a9c2,#a98bf0 60%,#4a3b86)',
    quad: [[562, 278], [712, 278], [714, 400], [560, 400]], back: [214, 208, 208],
    narrA: [[0.3, '오후 6시 반, 축제 정문.'], [2.2, '작년 운영진이었던 탓에, AI는 오늘도 일을 건넨다.'], [4.6, '오늘은 다르게.']],
    notesA: [[0.6, '📻', '학생회 운영팀', '운영 점검 18:00 · 본부 텐트로'], [1.6, '📦', '부스 B-3', '재고 확인 요청이 왔어요'], [2.6, '💬', '스태프 단톡 · 12', '오늘 인력 비는 사람?']],
    phases: [{to: [2, 3], ghost: [[0, 0], [1, 1], [2, 2], [2, 3]], step: 'STEP 1 / 1', text: '중앙에서 오른쪽 위(오락·활동)로 크게 쓸어 올리세요', ai: '오늘은 운영진이 아니라 방문객이에요'}],
    result: '확정 · 강하게 축제를 적극적으로', good: ['🎡', 'Knoble · 오락·활동', '운영 알림 보류 · 오늘은 방문객'], color: '#f07fb8',
    after: [{v: './assets/videos/ep2_b.mp4', narr: [[0.5, '운영 알림은 내일로.'], [4.6, 'AI가 남긴 안내는 하나. 나머지는 직접 발견한다.'], [10, '메인 공연, 19:30.']], notes: [[1.6, '🎤', 'Knoble · 안내 하나만', '메인 공연 19:30 · 나머지는 직접 둘러보세요'], [8, 'clear']]}]},
  {k: 'night', time: '23:00', place: '자취방', title: '집에서 휴식', a: './assets/videos/ep3_a.mp4', poster: './assets/images/p_ep3_a.jpg', frame: './assets/images/f_ep3.jpg', tg: 'linear-gradient(160deg,#5b6bb8,#2f2a63 60%,#141226)',
    quad: [[567, 275], [690, 275], [690, 380], [567, 380]], back: [204, 195, 198],
    narrA: [[0.3, '밤 11시, 집.'], [2.2, '몸은 피곤한데, 휴대폰은 내일 일을 꺼낸다.'], [4.6, '마지막으로, 휴식.']],
    notesA: [[0.8, '📅', '캘린더', '내일 9:00 회의 자료 준비'], [1.8, '🖼️', '사진', '축제 사진 52장, 지금 업로드할까요?'], [2.8, '💬', '단톡 · 34', '오늘 진짜 재밌었다 ㅋㅋ']],
    phases: [{to: [0, -1], ghost: [[0, 0], [0, -1]], step: 'STEP 1 / 2', text: '빛나는 중앙에서 아래(휴식)로 천천히 내려 보세요'},
      {to: [0, -3], ghost: [[0, -1], [0, -2], [0, -3]], suggest: [-1, -1], decline: true, step: 'STEP 2 / 2', text: '제안을 지나쳐, 휴식 끝까지 내려가세요', ai: 'AI · 내일 일정 3건, 지금 확인할까요?'}],
    result: '확정 · 강하게 휴식', decline: 'AI · 알겠어요. 내일 아침에 알려 드릴게요.', good: ['🌙', 'Knoble · 휴식', '휴식 중 · 알림은 내일 아침에'], color: '#6fb5ee',
    after: [{v: './assets/videos/ep3_b.mp4', narr: [[0.4, '천장 불이 꺼지고, 스탠드가 낮아진다.'], [4.4, '잔잔한 음악. 미룬 일은 아침에.'], [7.6, '좋은 밤.']]}]}
];
EPS.forEach(e => { const im = new Image(); im.src = e.frame; e.img = im; });

const frame = $('#frame'), film = $('#film'), vid = $('#vid'), ix = $('#ix'), ctx = ix.getContext('2d'), notesEl = $('#notes'), narrEl = $('#narr');
const KX = ix.width / 1280;
let EP = 0, run = 0, muted = true, started = false, autoAdvance = true, inView = false, holdPause = false;
function fitFilm() { const W = frame.clientWidth, H = frame.clientHeight; let w, h; if (W / H >= 1.15) { w = Math.max(W, H * 16 / 9); h = w * 9 / 16; } else { w = W; h = W * 9 / 16; } film.style.width = w + 'px'; film.style.height = h + 'px'; }
addEventListener('resize', fitFilm); fitFilm();
function cineScroll() {
  const r = $('#cineScroll').getBoundingClientRect(), p = clamp(-r.top / (innerHeight * .75), 0, 1), e = ease(p), mob = innerWidth < 640;
  frame.style.setProperty('--it', lerp(mob ? 30 : 27, 0, e) + 'vh'); frame.style.setProperty('--ib', lerp(mob ? 26 : 7, 0, e) + 'vh'); frame.style.setProperty('--il', lerp(mob ? 5 : 15, 0, e) + 'vw'); frame.style.setProperty('--ir', lerp(32, 0, e) + 'px');
  const hd = $('#cineHead'); hd.style.opacity = clamp(1 - p * 2.2, 0, 1); hd.style.transform = `translateY(${-p * 60}px) scale(${1 - p * .06})`;
  $('#amb').style.opacity = r.top < innerHeight && r.bottom > 0 ? (frame.clientWidth / frame.clientHeight < 1.15 ? .9 : .5) : 0;
  $('#nav').classList.toggle('hide', p > .9 && r.bottom > innerHeight * .6);
  inView = r.top < innerHeight * .4 && r.bottom > innerHeight * .6;
  if (p > .97 && inView && !started) { started = true; startEp(); }
  if (started && !inView && !vid.paused) { vid.pause(); holdPause = true; }
  if (started && inView && holdPause) { holdPause = false; vid.play().catch(() => {}); }
}
// ambient light from the current picture
const amb = $('#amb'), actx = amb.getContext('2d');
setInterval(() => { if (amb.style.opacity === '0') return; try { const src = ix.classList.contains('on') ? ix : $('#laptop').classList.contains('on') ? $('#laptop img') : vid; if (src === vid && vid.readyState < 2) return; actx.drawImage(src, 0, 0, 64, 36); } catch (e) {} }, 140);

const caption = (step, text, ai) => { $('#capStep').textContent = step || ''; $('#capText').textContent = text || ''; $('#capAI').textContent = ai || ''; $('#caption').classList.toggle('on', !!text); };
const toast = (t, ms = 1800) => { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove('on'), ms); };
function addNote(ic, who, txt, good, color) { const n = document.createElement('div'); n.className = 'note' + (good ? ' good' : ''); if (color) n.style.setProperty('--c', color);
  n.innerHTML = `<i>${ic}</i><div><b>${who}</b>${txt}</div>`; notesEl.appendChild(n); return n; }
const clearNotes = soft => $$('#notes .note').forEach(n => { if (soft) { n.classList.add('gone'); setTimeout(() => n.remove(), 600); } else n.remove(); });
function narrate(t) { const old = narrEl.querySelector('p:not(.out)'); if (old) { old.classList.add('out'); setTimeout(() => old.remove(), 600); } if (!t) return; const p = document.createElement('p'); p.textContent = t; narrEl.appendChild(p); }
let segIdx = 0, segN = 1;
function railUpdate(frac = 0) { $$('#rail button').forEach((b, i) => { b.classList.toggle('on', i === EP); b.querySelector('b').style.setProperty('--p', (i < EP ? 100 : i > EP ? 0 : clamp((segIdx + frac) / segN, 0, 1) * 100) + '%'); }); }
function playVideo(src, notes = [], narr = []) {
  return new Promise(res => {
    const my = run; vid.src = src; vid.muted = muted; const tl = [...notes.map(n => ['n', ...n]), ...narr.map(n => ['t', ...n])].sort((a, b) => a[1] - b[1]); let ti = 0;
    vid.onended = () => { if (my === run) res(); };
    vid.ontimeupdate = () => { if (my !== run) return; railUpdate(vid.duration ? vid.currentTime / vid.duration : 0);
      while (ti < tl.length && vid.currentTime >= tl[ti][1]) { const n = tl[ti++]; if (n[0] === 't') narrate(n[2]); else if (n[2] === 'clear') clearNotes(true); else addNote(n[2], n[3], n[4], n[3].startsWith('Knoble'), EPS[EP].color); } };
    vid.play().catch(() => { vid.muted = true; vid.play().catch(() => { $('#startcard').classList.remove('off'); }); });
  });
}
vid.addEventListener('playing', () => $('#poster').classList.add('off'));
const whenPlaying = () => new Promise(r => { if (!vid.paused && vid.currentTime > 0.05) r(); else vid.addEventListener('playing', () => r(), {once: true}); });

function loadEp(k) {
  run++; stopIX(); EP = k; const e = EPS[k]; document.body.dataset.tint = e.k;
  $('#chipEp').textContent = 'EP 0' + (k + 1); $('#chipMeta').textContent = `${e.time} · ${e.place} · ${e.title}`;
  $('#outro').classList.remove('on'); $('#laptop').classList.remove('on'); ix.classList.remove('on'); frame.classList.remove('ixmode'); caption(); clearNotes(); narrate();
  vid.removeAttribute('src'); vid.poster = e.poster; vid.load(); $('#poster').src = e.poster; $('#poster').classList.remove('off'); segIdx = 0; segN = 2 + e.after.length; railUpdate();
}
async function startEp() {
  const my = ++run, e = EPS[EP]; $('#startcard').classList.add('off'); frame.classList.add('playing'); segIdx = 0; railUpdate();
  await playVideo(e.a, e.notesA, e.narrA); if (my !== run) return;
  $$('#notes .note').forEach(n => n.classList.add('dim')); narrate(); segIdx = 1; railUpdate();
  await interaction(e); if (my !== run) return;
  clearNotes(true); setTimeout(() => { if (my === run) addNote(...e.good, true, e.color); }, 450);
  for (let i = 0; i < e.after.length; i++) {
    const s = e.after[i]; segIdx = 2 + i; railUpdate();
    if (s.laptop) { await laptopScene(my); if (my !== run) return; continue; }
    const p = playVideo(s.v, s.notes || [], s.narr || []); await whenPlaying(); if (my !== run) return;
    ix.classList.remove('on'); frame.classList.remove('ixmode'); $('#laptop').classList.remove('on'); caption();
    await p; if (my !== run) return;
    if (i === 0 && EP === 0) clearNotes(true);
  }
  clearNotes(true); narrate(); segIdx = segN; railUpdate();
  if (EP < 2) await transitionTo(EP + 1, my); else $('#outro').classList.add('on');
}
async function transitionTo(k, my) {
  const n = EPS[k], tc = $('#tcard'); tc.style.setProperty('--tg', n.tg); $('#tcEp').textContent = 'EP 0' + (k + 1); $('#tcTitle').textContent = n.title; $('#tcPlace').textContent = n.place;
  const [h0, m0] = EPS[k - 1].time.split(':').map(Number), [h1, m1] = n.time.split(':').map(Number), a = h0 * 60 + m0, b = h1 * 60 + m1;
  tc.classList.add('on'); const t0 = performance.now();
  await new Promise(r => { const tick = now => { const t = clamp((now - t0 - 300) / 1300, 0, 1), v = Math.round(lerp(a, b, ease(t))); $('#tcTime').textContent = `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`; if (t < 1) requestAnimationFrame(tick); else r(); }; requestAnimationFrame(tick); });
  await sleep(900); if (my !== run) { tc.classList.remove('on'); return; }
  loadEp(k); startEp(); await sleep(450); tc.classList.remove('on');
}
$('#bStart').onclick = () => { started = true; startEp(); };
$$('#rail button').forEach((b, i) => b.onclick = () => { $('#tcard').classList.remove('on'); loadEp(i); startEp(); });
$('#bReplay').onclick = () => { loadEp(0); startEp(); };
$('#bSound').onclick = () => { muted = !muted; vid.muted = muted; $('#bSound').textContent = muted ? '🔇 소리 켜기' : '🔊 소리 끄기'; };

/* ---- laptop screen (EP1) ---- */
async function laptopScene(my) {
  const L = $('#laptop'), S = $('#screen');
  S.innerHTML = `<div class="scr"><div class="side"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="doc"><h4>2031 가을 축제 기획 보고서</h4><div class="bar"><b></b></div>
  <ul><li class="ok">행사 개요</li><li class="ok">예산안</li><li>부스 배치도 정리</li><li>안전 관리 계획</li><li>최종 검토 후 제출</li></ul>
  <div class="stack"><div>🎪 라인업 공개! 오늘 19:30</div><div>💬 학생회 단톡 12</div><div>🍜 푸드트럭 위치 안내</div><div>👋 민재: 언제 와??</div></div>
  <div class="pillm">🔕 알림 23개 보류 · 과제 집중</div><div class="done"><div><b>제출 완료 ✓</b><span>보류한 알림 23개 · 축제 라인업 보러 가기</span></div></div></div></div>`;
  L.classList.add('on'); narrate('화면 위 알림이 하나로 접히고, 할 일만 남는다.'); await sleep(450); if (my !== run) return;
  const scr = S.querySelector('.scr'), lis = S.querySelectorAll('li'), bar = S.querySelector('.bar b');
  await sleep(900); scr.classList.add('calm');
  for (const [i, w] of [[2, 80], [3, 90], [4, 100]]) { await sleep(800); if (my !== run) return; lis[i].classList.add('ok'); bar.style.width = w + '%'; railUpdate((i - 1) / 4); }
  await sleep(900); S.querySelector('.done').classList.add('on'); await sleep(2100); narrate();
}

/* ---- in-video interaction ---- */
function solveH(src, dst) { const A = [], b = [];
  for (let i = 0; i < 4; i++) { const [x, y] = src[i], [X, Y] = dst[i]; A.push([x, y, 1, 0, 0, 0, -X * x, -X * y]); b.push(X); A.push([0, 0, 0, x, y, 1, -Y * x, -Y * y]); b.push(Y); }
  for (let c = 0; c < 8; c++) { let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) if (r !== c) { const f = A[r][c] / A[c][c]; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; b[r] -= f * b[c]; } }
  const h = b.map((v, i) => v / A[i][i]); return [...h, 1]; }
function invH(m) { const [a, b, c, d, e, f, g, h, i] = m, A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g, D = -(b * i - c * h), E = a * i - c * g, F = -(a * h - b * g), G = b * f - c * e, H = -(a * f - c * d), I = a * e - b * d, det = a * A + b * B + c * C;
  return [A / det, D / det, G / det, B / det, E / det, H / det, C / det, F / det, I / det]; }
const ap = (m, x, y) => { const w = m[6] * x + m[7] * y + m[8]; return [(m[0] * x + m[1] * y + m[2]) / w, (m[3] * x + m[4] * y + m[5]) / w]; };
let IX = null, raf = 0, idleT = 0;
const gb = on => { $('#bSkip').classList.toggle('on', on); if (!on) $('#bAuto').classList.remove('on'); };
function stopIX() { if (IX) IX.done = true; IX = null; cancelAnimationFrame(raf); ix.classList.remove('on'); gb(false); clearTimeout(idleT); }
function interaction(e) {
  return new Promise(resolve => {
    const H = solveH([[0, 0], [1, 0], [1, 1], [0, 1]], e.quad), Hi = invH(H);
    const qc = e.quad.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]), gw = Math.hypot(e.quad[1][0] - e.quad[0][0], e.quad[1][1] - e.quad[0][1]);
    const vis = Math.min(frame.clientWidth, film.clientWidth) / film.clientWidth, small = frame.clientWidth < 640; // visible fraction of the film
    const Z = clamp((small ? .55 : .3) * vis * 1280 / gw, 2.2, small ? 6 : 4.2);
    IX = {e, H, Hi, qc, Z, z: 1, pads: new Map(CELLS.map(([x, y]) => [key(x, y), {L: 0, T: 0}])), path: [], phase: 0, drawing: false, cur: null, reached: false, final: null, sugA: 0, fails: 0, resolve, done: false};
    ix.classList.add('on'); frame.classList.add('ixmode'); gb(true);
    const ph = e.phases[0]; setTimeout(() => IX && caption(ph.step, ph.text, ph.ai), 700); armIdle();
    const loop = now => { if (!IX || IX.done) return; drawIX(now); raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop);
  });
}
function armIdle() { clearTimeout(idleT); idleT = setTimeout(() => { if (IX && !IX.drawing && !IX.final) $('#bAuto').classList.add('on'); }, 5500); }
function view() { const S = IX, z = S.z, k = clamp((z - 1) / ((S.Z - 1) || 1), 0, 1), c = [640 + (S.qc[0] - 640) * k, 360 + (S.qc[1] - 360) * k];
  return {z, f: (x, y) => [((x - c[0]) * z + 640) * KX, ((y - c[1]) * z + 360) * KX], inv: (px, py) => [(px / KX - 640) / z + c[0], (py / KX - 360) / z + c[1]]}; }
function drawIX(now) {
  const S = IX, e = S.e; const tz = S.final && now - S.final.t > 1400 ? 1 : S.Z; S.z += (tz - S.z) * .06;
  const V = view(), W = ix.width, Hh = ix.height; ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, Hh);
  const [x0, y0] = V.f(0, 0); ctx.drawImage(e.img, x0, y0, 1280 * V.z * KX, 720 * V.z * KX);
  ctx.fillStyle = `rgba(10,8,20,${.2 * clamp((V.z - 1) / 1.2, 0, 1)})`; ctx.fillRect(0, 0, W, Hh);
  const M = (u, v) => { const [x, y] = ap(S.H, u, v); return V.f(x, y); };
  const quadPath = (u0, v0, u1, v1, r) => { const pts = [], N = 4, corner = (cu, cv, a0) => { for (let i = 0; i <= N; i++) { const a = a0 + i / N * Math.PI / 2; pts.push(M(cu + Math.cos(a) * r, cv + Math.sin(a) * r)); } };
    corner(u1 - r, v0 + r, -Math.PI / 2); corner(u1 - r, v1 - r, 0); corner(u0 + r, v1 - r, Math.PI / 2); corner(u0 + r, v0 + r, Math.PI);
    ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };
  const pxU = Math.hypot(M(1, .5)[0] - M(0, .5)[0], M(1, .5)[1] - M(0, .5)[1]);
  ctx.save(); ctx.shadowColor = rgba(e.back); ctx.shadowBlur = pxU * .05; ctx.fillStyle = rgba(e.back); quadPath(-.045, -.045, 1.045, 1.045, .09); ctx.fill(); ctx.restore();
  const active = S.path.length > 0; S.pads.forEach(p => p.T = 0); const n = S.path.length;
  S.path.forEach((k, i) => { const p = S.pads.get(k), lv = .16 + .55 * Math.pow((i + 1) / n, 1.5); if (lv > p.T) p.T = lv; });
  if (S.drawing && S.cur) S.pads.get(S.cur).T = 1.05;
  if (S.final) { const f = S.pads.get(S.final.k), el = now - S.final.t; f.T = 1.5 + .12 * Math.sin(now / 380) + Math.max(0, 1 - el / 600) * .8; }
  const ph = e.phases[S.phase], showSug = ph && ph.suggest && !S.final; S.sugA += ((showSug ? 1 : 0) - S.sugA) * .08;
  const sugCell = (e.phases.find(p => p.suggest) || {}).suggest;
  for (const [x, y] of CELLS) {
    const k = key(x, y), p = S.pads.get(k); p.L += (p.T - p.L) * (p.T > p.L ? .25 : .08);
    const [u, v] = cellUV(x, y), base = baseRGB(u, v), viv = vivid(base), calm = active || S.final ? 1 - Math.min(1, p.L / 1.1) : 0;
    let c = mix(mix(base, [255, 255, 255], .28), mix([236, 233, 240], base, .25), calm * .65); c = mix(c, viv, Math.min(1, p.L / 1.1));
    ctx.save(); if (p.L > .06) { ctx.shadowColor = rgba(viv, Math.min(.95, p.L * .75)); ctx.shadowBlur = pxU * (.02 + p.L * .05); }
    ctx.fillStyle = rgba(c, .97); quadPath(u - HS / GR, v - HS / GR, u + HS / GR, v + HS / GR, .022); ctx.fill();
    if (p.L > 1.2) { ctx.shadowBlur = 0; ctx.fillStyle = `rgba(255,255,255,${Math.min(.28, (p.L - 1.2) * .6)})`; quadPath(u - HS / GR * .6, v - HS / GR * .6, u + HS / GR * .6, v + HS / GR * .6, .018); ctx.fill(); }
    ctx.restore();
  }
  if (sugCell && S.sugA > .02) { const [u, v] = cellUV(...sugCell), pulse = .55 + .45 * Math.sin(now / 260);
    ctx.save(); ctx.globalAlpha = S.sugA; ctx.shadowColor = 'rgba(142,124,255,.95)'; ctx.shadowBlur = pxU * .07; ctx.fillStyle = `rgba(160,140,255,${.55 + .35 * pulse})`;
    quadPath(u - HS / GR, v - HS / GR, u + HS / GR, v + HS / GR, .022); ctx.fill(); ctx.lineWidth = pxU * .008; ctx.strokeStyle = `rgba(255,255,255,${.6 + .4 * pulse})`; const g = HS / GR + .018; quadPath(u - g, v - g, u + g, v + g, .03); ctx.stroke(); ctx.restore(); }
  if (ph && !S.final) { const pts = ph.ghost.map(c => M(...cellUV(...c)));
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.shadowColor = 'rgba(80,60,160,.55)'; ctx.shadowBlur = pxU * .02;
    ctx.lineWidth = pxU * .016; ctx.setLineDash([pxU * .028, pxU * .03]); ctx.lineDashOffset = -now / 25; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(...p) : ctx.moveTo(...p)); ctx.stroke(); ctx.setLineDash([]);
    const [a, b] = [pts[pts.length - 2], pts[pts.length - 1]], ang = Math.atan2(b[1] - a[1], b[0] - a[0]), s = pxU * .045;
    ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.moveTo(b[0] + Math.cos(ang) * s * .6, b[1] + Math.sin(ang) * s * .6); ctx.lineTo(b[0] + Math.cos(ang + 2.5) * s, b[1] + Math.sin(ang + 2.5) * s); ctx.lineTo(b[0] + Math.cos(ang - 2.5) * s, b[1] + Math.sin(ang - 2.5) * s); ctx.fill();
    if (!S.drawing) { const st = pts[0], r = pxU * (.05 + .015 * Math.sin(now / 240)); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = pxU * .01; ctx.beginPath(); ctx.arc(st[0], st[1], r, 0, 7); ctx.stroke(); }
    ctx.restore(); }
}
function cellAt(ev) { if (!IX) return null; const r = ix.getBoundingClientRect(), V = view(); const [fx, fy] = V.inv((ev.clientX - r.left) / r.width * ix.width, (ev.clientY - r.top) / r.height * ix.height);
  const [u, v] = ap(IX.Hi, fx, fy), gi = (u * GR - HS) / PI_, gj = (v * GR - HS) / PI_, i = Math.round(gi), j = Math.round(gj); if (Math.abs(gi - i) > .8 || Math.abs(gj - j) > .8) return null;
  const x = clamp(i - 3, -3, 3), y = clamp(3 - j, -3, 3); return valid(x, y) ? key(x, y) : null; }
function visit(k) { const S = IX; if (!S || S.cur === k) return;
  if (S.cur) { let [x, y] = parse(S.cur); const [tx, ty] = parse(k); const dx = Math.abs(tx - x), dy = Math.abs(ty - y), sx = Math.sign(tx - x), sy = Math.sign(ty - y); let err = dx - dy;
    while (!(x === tx && y === ty)) { const e2 = 2 * err; if (e2 > -dy) { err -= dy; x += sx; } if (e2 < dx) { err += dx; y += sy; } if (valid(x, y) && key(x, y) !== k) step(key(x, y)); } }
  step(k); }
function step(k) { const S = IX; S.cur = k; S.path.push(k); const ph = S.e.phases[S.phase]; if (!ph || S.reached) return;
  if (cheb(parse(k), ph.to) === 0) { if (S.phase < S.e.phases.length - 1) { S.phase++; const np = S.e.phases[S.phase]; caption(np.step, np.text, np.ai); if (np.suggest) toast('AI가 다른 빛을 제안했어요', 1600); }
    else { S.reached = true; caption(ph.step, '좋아요. 이제 손을 떼서 확정하세요', ph.ai); } } }
function confirmIX(k) { const S = IX; if (!S || S.final) return; S.drawing = false; S.final = {k, t: performance.now()}; clearTimeout(idleT); gb(false);
  caption('CONFIRMED', S.e.result, S.e.decline || ''); toast(S.e.result); setTimeout(() => { if (S === IX) caption(); }, 2200);
  setTimeout(() => { if (S === IX) { S.done = true; cancelAnimationFrame(raf); S.resolve(); const loop = now => { if (IX !== S) return; drawIX(now); if (ix.classList.contains('on')) raf = requestAnimationFrame(loop); }; raf = requestAnimationFrame(loop); } }, 2600); }
ix.addEventListener('pointerdown', ev => { const S = IX; if (!S || S.final || S.auto) return; const k = cellAt(ev); armIdle(); const start = S.e.phases[0].ghost[0];
  if (!k || cheb(parse(k), start) > 1) { caption(S.e.phases[0].step, '빛나는 원(시작점)을 누른 채 시작하세요', ''); return; }
  ix.setPointerCapture(ev.pointerId); S.drawing = true; S.path = []; S.cur = null; S.phase = 0; S.reached = false; const ph = S.e.phases[0]; caption(ph.step, ph.text, ph.ai);
  visit(key(...start)); if (k !== key(...start)) visit(k); });
ix.addEventListener('pointermove', ev => { const S = IX; if (!S || !S.drawing) return; const k = cellAt(ev); if (k) visit(k); });
const up = () => { const S = IX; if (!S || !S.drawing) return; S.drawing = false; armIdle();
  if (S.reached) { const last = S.e.phases[S.e.phases.length - 1].to; confirmIX(cheb(parse(S.cur), last) <= 1 ? S.cur : key(...last)); }
  else { S.fails++; S.path = []; S.cur = null; S.phase = 0; const ph = S.e.phases[0]; caption(ph.step, '손을 떼지 말고 화살표 끝까지 이어서 그려 보세요', ph.ai); $('#bAuto').classList.add('on'); } };
ix.addEventListener('pointerup', up); ix.addEventListener('pointercancel', up);
$('#bAuto').onclick = async () => { const S = IX; if (!S || S.final) return; S.auto = true; $('#bAuto').classList.remove('on'); S.path = []; S.cur = null; S.phase = 0; S.reached = false; S.drawing = true;
  const seq = []; S.e.phases.forEach((p, i) => p.ghost.forEach((c, j) => { if (i && !j) return; seq.push(key(...c)); }));
  for (const k of seq) { if (IX !== S) return; visit(k); await sleep(k === key(...S.e.phases[0].to) && S.e.phases.length > 1 ? 1000 : 320); }
  await sleep(400); confirmIX(S.cur); };
$('#bSkip').onclick = () => { const S = IX; if (!S || S.final) return; const seq = []; S.e.phases.forEach(p => p.ghost.forEach(c => seq.push(key(...c)))); S.path = seq; S.cur = seq[seq.length - 1]; confirmIX(S.cur); };
window.__ix = () => IX; window.__cine = {loadEp, startEp};
loadEp(0);
onScroll();
