/* KNOBLE — shared real-time 3D model (hero + hands-on viewer) */
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';

let bufP = null;
function glbBuffer() {
  if (!bufP) bufP = (async () => { while (!window.KNOBLE_GLB) await new Promise(r => setTimeout(r, 40));
    const bin = atob(window.KNOBLE_GLB), u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); return u8.buffer; })();
  return bufP;
}
const HALO = () => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  [[0, 'rgba(255,255,255,1)'], [.35, 'rgba(255,255,255,.55)'], [.7, 'rgba(255,255,255,.12)'], [1, 'rgba(255,255,255,0)']].forEach(s => r.addColorStop(...s));
  g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };

export function createKnoble(canvas, opt = {}) {
  const stage = canvas.parentElement;
  const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.toneMapping = THREE.NeutralToneMapping; renderer.toneMappingExposure = 1.05; renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), .04).texture;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e4f4, .6));
  const keyL = new THREE.DirectionalLight(0xffffff, .9); keyL.position.set(-1, 3, 2); scene.add(keyL);
  const camera = new THREE.PerspectiveCamera(opt.fov || 30, 1, .01, 50);
  const home = opt.camera || [0, 2.5, 2.15]; camera.position.set(...home);
  const controls = new OrbitControls(camera, canvas);
  Object.assign(controls, {enableDamping: true, enablePan: false, rotateSpeed: .6}, opt.controls || {});
  controls.target.set(0, .05, 0);
  const shadow = (() => { const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d');
    const r = g.createRadialGradient(128, 128, 10, 128, 128, 128); r.addColorStop(0, 'rgba(70,60,120,.26)'); r.addColorStop(.55, 'rgba(70,60,120,.09)'); r.addColorStop(1, 'rgba(70,60,120,0)');
    g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false}));
    m.rotation.x = -Math.PI / 2; m.position.y = .001; scene.add(m); return m; })();
  const halo = HALO();

  const api = {ready: false, pads: [], grid: new Map(), mode: 'base', explode: 0, onState: null, onReady: null, interacted: false};
  const pads = api.pads, grid = api.grid; let SP = 0; const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const parts = {}; const glowMats = [];
  let explodeT = 0, explodeV = 0;

  glbBuffer().then(buf => new GLTFLoader().parse(buf, '', gltf => {
    const root = gltf.scene, box = new THREE.Box3().setFromObject(root), size = box.getSize(new THREE.Vector3()), s = 1 / size.x;
    root.scale.multiplyScalar(s); root.position.y = -box.min.y * s; scene.add(root); root.updateMatrixWorld(true);
    let sampler = null;
    root.traverse(o => {
      if (!o.isMesh && o.name !== 'Body2.001') return;
      const nm = o.name;
      if (['Body1', 'Body2.001', 'Body3', 'Body4', 'Body5', 'Body285', 'Body287'].includes(nm)) { parts[nm] = {o, y0: o.position.y}; }
      if (o.isMesh && o.material && o.material.emissiveMap && !/^Body2\d\d$/.test(nm)) { o.material = o.material.clone(); glowMats.push(o.material); o.material.userData.e0 = o.material.emissiveIntensity; }
      const m = /^Body2(\d\d)$/.exec(nm); if (!m || !o.isMesh) return; const n = +('2' + m[1]); if (n < 240 || n > 284) return;
      if (!sampler && o.material.emissiveMap) { const img = o.material.emissiveMap.image, c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const g = c.getContext('2d', {willReadFrequently: true}); g.drawImage(img, 0, 0); sampler = {g, w: img.width, h: img.height}; }
      const mat = o.material.clone(); o.material = mat; mat.userData.e0 = mat.emissiveIntensity;
      const U = {uMix: {value: 0}, uGlow: {value: 0}, uCalm: {value: 0}, uHue: {value: new THREE.Color()}};
      mat.userData.U = U; mat.customProgramCacheKey = () => 'knoblePad';
      mat.onBeforeCompile = sh => { Object.assign(sh.uniforms, U);
        sh.fragmentShader = 'uniform float uMix;uniform float uGlow;uniform float uCalm;uniform vec3 uHue;\n' + sh.fragmentShader
          .replace('#include <map_fragment>', `#include <map_fragment>
            float dl=dot(diffuseColor.rgb,vec3(.299,.587,.114));
            diffuseColor.rgb=mix(diffuseColor.rgb,mix(vec3(dl),vec3(.96,.95,.97),.35),uCalm*.55);
            diffuseColor.rgb=mix(diffuseColor.rgb,uHue*.85,uMix*.85);`)
          .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
            float el=dot(totalEmissiveRadiance,vec3(.299,.587,.114));
            totalEmissiveRadiance=mix(totalEmissiveRadiance,vec3(el),uCalm*.6)*(1.-uCalm*.35);
            totalEmissiveRadiance=mix(totalEmissiveRadiance,uHue*uGlow,uMix);`); };
      const uv = o.geometry.attributes.uv; let u = 0, v = 0; for (let i = 0; i < uv.count; i++) { u += uv.getX(i); v += uv.getY(i); } u /= uv.count; v /= uv.count;
      const bb = new THREE.Box3().setFromObject(o);
      pads.push({mesh: o, mat, u, v, c: bb.getCenter(new THREE.Vector3()), top: bb.max.y, y0: o.position.y, L: 0, T: 0, press: 0, sug: 0});
    });
    pads.forEach(p => { let col = new THREE.Color(0xB8B6E5);
      if (sampler) { const d = sampler.g.getImageData(Math.min(sampler.w - 1, Math.max(0, p.u * sampler.w | 0)), Math.min(sampler.h - 1, Math.max(0, p.v * sampler.h | 0)), 1, 1).data;
        col = new THREE.Color().setRGB(d[0] / 255, d[1] / 255, d[2] / 255, THREE.SRGBColorSpace); const h = {}; col.getHSL(h); col.setHSL(h.h, 1, .52); }
      p.hue = col.clone(); p.mat.userData.U.uHue.value.copy(col);
      p.halo = new THREE.Sprite(new THREE.SpriteMaterial({map: halo, color: col, transparent: true, opacity: 0, depthWrite: false, depthTest: false})); p.halo.renderOrder = 10; scene.add(p.halo); });
    const xs = [...new Set(pads.map(p => +p.c.x.toFixed(4)))].sort((a, b) => a - b); SP = xs[1] - xs[0];
    const topY = Math.max(...pads.map(p => p.top)); plane.constant = -topY; api.topY = topY;
    pads.forEach(p => { p.gx = Math.round(p.c.x / SP); p.gy = -Math.round(p.c.z / SP); grid.set(p.gx + ',' + p.gy, p); });
    // hotspot anchors (world)
    const ctr = o => new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());
    const bx = o => new THREE.Box3().setFromObject(o);
    api.anchors = {
      pads: grid.get('0,0').c.clone().setY(topY + .01),
      ring: (() => { const b = bx(parts.Body5.o); return new THREE.Vector3(b.min.x + (b.max.x - b.min.x) * .16, b.max.y + .02, b.min.z + (b.max.z - b.min.z) * .16); })(),
      axis: (() => { const c = root.getObjectByName('AXIS ICON | 활동 (위)'); return c ? ctr(c).add(new THREE.Vector3(0, .012, 0)) : new THREE.Vector3(); })(),
      usb: ctr(parts.Body287.o), core: (() => { const b = bx(parts.Body1.o); return new THREE.Vector3(0, b.min.y + .01, 0); })(),
      panel: ctr(parts.Body4.o)
    };
    api.ready = true; api.onReady && api.onReady();
  }));

  /* ---------- gesture model ---------- */
  const G = {mode: 'idle', path: [], cur: null, final: null, release: 0};
  api.G = G;
  function describe(p) {
    if (!p) return ['중립', '업무 0 · 활동 0'];
    const x = p.gx, y = p.gy, a = Math.max(Math.abs(x), Math.abs(y)), lv = ['', '약하게', '', '강하게'][a] || '';
    const name = !x && !y ? '중립' : x < 0 && y > 0 ? '과제에 집중' : x < 0 && y < 0 ? '쉬면서 남은 일 확인' : x > 0 && y > 0 ? '축제를 적극적으로' : x > 0 && y < 0 ? '여유롭게 둘러보기' : x < 0 ? '업무 쪽' : x > 0 ? '오락 쪽' : y > 0 ? '활동 쪽' : '휴식 쪽';
    return [(lv ? lv + ' · ' : '') + name, `${x <= 0 ? '업무 ' + -x : '오락 ' + x} · ${y >= 0 ? '활동 ' + y : '휴식 ' + -y}`];
  }
  api.describe = describe;
  const emit = () => api.onState && api.onState(describe(G.final || G.cur), G);
  function reset() { G.mode = 'idle'; G.path = []; G.cur = null; G.final = null; emit(); }
  function start(p) { reset(); G.mode = 'draw'; visit(p); }
  function visit(p) {
    if (G.cur === p) return;
    if (G.cur) { let x = G.cur.gx, y = G.cur.gy; const dx = Math.abs(p.gx - x), dy = Math.abs(p.gy - y), sx = Math.sign(p.gx - x), sy = Math.sign(p.gy - y); let err = dx - dy;
      while (!(x === p.gx && y === p.gy)) { const e2 = 2 * err; if (e2 > -dy) { err -= dy; x += sx; } if (e2 < dx) { err += dx; y += sy; } const q = grid.get(x + ',' + y); if (q && q !== p) { G.cur = q; G.path.push(q); } } }
    G.cur = p; G.path.push(p); emit();
  }
  function end() { if (G.mode !== 'draw') return; G.mode = 'settled'; G.final = G.cur; G.release = performance.now(); emit(); }
  Object.assign(api, {reset, start, visit, end});
  api.cell = (x, y) => grid.get(x + ',' + y);
  api.suggest = null; // pad that AI suggests

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3();
  function padAt(e) { const r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1); ray.setFromCamera(ndc, camera);
    if (!SP || api.mode === 'off' || explodeV > .05 || !ray.ray.intersectPlane(plane, hit)) return null; const gx = Math.round(hit.x / SP), gy = -Math.round(hit.z / SP);
    if (Math.abs(hit.x / SP - gx) > .62 || Math.abs(-hit.z / SP - gy) > .62) return null; return grid.get(gx + ',' + gy) || null; }
  let dp = null;
  canvas.addEventListener('pointerdown', e => { api.interacted = true; api.onTouch && api.onTouch(); const p = padAt(e);
    if (p && opt.draw !== false) { controls.enabled = false; dp = e.pointerId; canvas.setPointerCapture(e.pointerId); start(p); } }, {capture: true});
  canvas.addEventListener('pointermove', e => { const p = padAt(e); if (dp === e.pointerId) { if (p) visit(p); } else canvas.classList.toggle('on-pad', !!p); });
  const up = e => { if (dp !== e.pointerId) return; dp = null; controls.enabled = true; end(); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  let demoT = 0;
  api.playDemo = (seq, loop = true, onEnd) => { clearTimeout(demoT); let k = 0;
    const nx = () => { const [x, y, ms] = seq[k]; const p = grid.get(x + ',' + y); if (!p) return; k ? visit(p) : start(p); k++;
      demoT = setTimeout(k < seq.length ? nx : () => { end(); onEnd && onEnd(); if (loop) demoT = setTimeout(() => { if (!api.interacted) api.playDemo(seq, loop, onEnd); }, 5200); }, ms); };
    if (api.ready) nx(); else api.onReady = () => nx(); };
  api.stopDemo = () => clearTimeout(demoT);

  /* ---------- views, explode, modes ---------- */
  let camTo = null;
  api.view = name => { const V = {'3q': [1.25, 1.55, 1.9], top: [0, 2.9, .02], side: [0, .55, 2.75], front: [0, 1.2, 2.5], bottom: [.9, -1.6, 1.6], home: home};
    camTo = new THREE.Vector3(...(V[name] || home)); controls.autoRotate = false; };
  api.setExplode = v => explodeT = v;
  api.setMode = m => { api.mode = m; };
  api.camera = camera; api.controls = controls; api.canvas = canvas;
  api.offsetOf = k => (OFF[k] || 0) * explodeV / 52;
  api.project = (v, part) => { const p = v.clone(); if (part) p.y += api.offsetOf(part); p.project(camera); const r = canvas.getBoundingClientRect();
    return {x: (p.x + 1) / 2 * r.width, y: (1 - p.y) / 2 * r.height, behind: p.z > 1}; };

  /* ---------- render ---------- */
  let visible = true; new IntersectionObserver(es => visible = es[0].isIntersecting).observe(stage);
  function resize() { const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener('resize', resize); new ResizeObserver(resize).observe(stage); resize();
  const OFF = {Body2: 15, Body5: 9, Body4: 6, Body3: 0, Body285: -7, Body287: -7, Body1: -13, pads: 22};
  let last = performance.now();
  renderer.setAnimationLoop(now => {
    if (!visible) { last = now; return; }
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    if (camTo) { camera.position.lerp(camTo, Math.min(1, dt * 4)); if (camera.position.distanceTo(camTo) < .01) camTo = null; }
    controls.update();
    explodeV += (explodeT - explodeV) * Math.min(1, dt * 6);
    for (const [k, part] of Object.entries(parts)) { const key = k.replace('.001', ''); part.o.position.y = part.y0 + (OFF[key] || 0) * explodeV; }
    shadow.material.opacity = 1 - explodeV * .5;
    const off = api.mode === 'off';
    glowMats.forEach(m => { const t = off ? 0 : m.userData.e0; m.emissiveIntensity += (t - m.emissiveIntensity) * Math.min(1, dt * 6); });
    pads.forEach(p => p.T = 0);
    const n = G.path.length, active = G.mode !== 'idle' && n > 0 && !off;
    if (active) {
      const e = G.mode === 'settled' ? now - G.release : 0, fade = G.mode === 'settled' ? (e < 1400 ? 1 : Math.max(.5, 1 - (e - 1400) / 2600)) : 1;
      G.path.forEach((p, k) => { const lv = (.14 + .56 * Math.pow((k + 1) / n, 1.6)) * fade; if (lv > p.T) p.T = lv; });
      if (G.mode === 'draw') G.cur.T = 1.05; else { const f = G.final, fl = Math.max(0, 1 - e / 650); f.T = 1.5 + .12 * Math.sin(now / 1000 * 2.4) + fl * .7; }
    }
    const violet = new THREE.Color(0x8E7CFF);
    pads.forEach(p => {
      p.L += (p.T - p.L) * Math.min(1, dt * (p.T > p.L ? 14 : 5));
      const isSug = api.suggest === p && !off; p.sug += ((isSug ? 1 : 0) - p.sug) * Math.min(1, dt * 5);
      const L = p.L, U = p.mat.userData.U, m = Math.min(1, L / 1.1), pulse = .55 + .45 * Math.sin(now / 260);
      U.uMix.value = Math.max(m, p.sug * (.75 + .25 * pulse));
      if (p.sug > .01 && p.sug > m) U.uHue.value.copy(p.hue).lerp(violet, p.sug); else U.uHue.value.copy(p.hue);
      U.uGlow.value = .55 + Math.max(L, p.sug * 1.2 * pulse) * .75;
      U.uCalm.value += (((active || api.suggest) && !off ? 1 - Math.max(m, p.sug) : 0) - U.uCalm.value) * Math.min(1, dt * 6);
      p.mat.emissiveIntensity += ((off ? 0 : p.mat.userData.e0) - p.mat.emissiveIntensity) * Math.min(1, dt * 6);
      const pr = G.mode === 'draw' && p === G.cur ? 1 : 0; p.press += (pr - p.press) * Math.min(1, dt * 18);
      p.mesh.position.y = p.y0 - p.press * .3 + OFF.pads * explodeV;
      p.halo.position.set(p.c.x, p.top + .004 + explodeV * (OFF.pads / 52), p.c.z);
      const hs = SP * (1.5 + Math.max(L, p.sug) * 1.9); p.halo.scale.set(hs, hs, 1);
      p.halo.material.color.copy(U.uHue.value); p.halo.material.opacity = off ? 0 : Math.min(.7, Math.max(L, p.sug * pulse) * .5);
    });
    api.onFrame && api.onFrame(now, explodeV);
    renderer.render(scene, camera);
  });
  api.explodeValue = () => explodeV;
  return api;
}
