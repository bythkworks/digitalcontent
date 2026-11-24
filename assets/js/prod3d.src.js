// College Festival 2031 — real product models (GLB) on the map + their flight in.
// Bundled with three.js so it runs offline (file://) with no network.
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const b64 = (s) => { const bin = atob(s), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; };

function mkRenderer(canvas, w, h) {
  const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, premultipliedAlpha: true, powerPreference: 'high-performance' });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  r.setSize(w, h, false);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.ACESFilmicToneMapping; r.toneMappingExposure = 1.05;
  r.setClearColor(0x000000, 0);
  const pm = new THREE.PMREMGenerator(r);
  const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  return { r, env };
}

// one look for the flight, matching the site: pearly lavender glass with an iridescent sheen
function dreamMaterial(i) {
  const tints = [0xB4DCF2, 0xCFC9FF, 0xF7C4E6];
  return new THREE.MeshPhysicalMaterial({
    color: tints[i % 3], roughness: 0.16, metalness: 0.0, clearcoat: 1, clearcoatRoughness: 0.08,
    iridescence: 1, iridescenceIOR: 1.35, iridescenceThicknessRange: [180, 720],
    sheen: 1, sheenColor: new THREE.Color(0xF2B6E3), sheenRoughness: 0.35,
    emissive: new THREE.Color([0x7FB8E0, 0x9F98EC, 0xE08FCB][i % 3]), emissiveIntensity: 0.42,
  });
}

function normalize(root) {
  // y-up glTF → z-up map; centre it and make its largest half-extent 1
  root.rotation.x = Math.PI / 2; root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root), c = box.getCenter(new THREE.Vector3()), s = box.getSize(new THREE.Vector3());
  const k = 2 / Math.max(s.x, s.y, s.z);
  const wrap = new THREE.Group(), inner = new THREE.Group();
  inner.add(root); root.position.sub(c); inner.scale.setScalar(k); wrap.add(inner);
  return wrap;
}

const Prod3D = {
  ready: false, items: [], fly: [],
  init({ stage, flyHost, models, props, onReady }) {
    try {
      this.stage = stage; this.flyHost = flyHost;
      const cv = document.createElement('canvas'); cv.className = 'map-gl map-gl3'; cv.setAttribute('aria-hidden', 'true');
      stage.appendChild(cv); this.cv = cv;
      const R = stage.getBoundingClientRect();
      this.main = mkRenderer(cv, Math.max(1, R.width), Math.max(1, R.height));
      this.scene = new THREE.Scene(); this.scene.environment = this.main.env;
      const sun = new THREE.DirectionalLight(0xfff4ea, 1.4); sun.position.set(-0.4, -0.6, 1); this.scene.add(sun, sun.target);
      this.scene.add(new THREE.HemisphereLight(0xEDE8FF, 0xF6D9C8, 0.6));
      this.cam = new THREE.PerspectiveCamera(30, 1, 0.5, 6000); this.cam.up.set(0, 0, 1);
      const loader = new GLTFLoader(); let left = models.length;
      this.props = {};
      (props || []).forEach(m => loader.parse(b64(m.b64), '', (g) => { const o = normalize(g.scene); o.traverse(c => { if (c.isMesh) { c.frustumCulled = false; if (m.color && c.material) { c.material = c.material.clone(); c.material.color = new THREE.Color(m.color); c.material.roughness = 0.45; c.material.envMapIntensity = 1.1; } } }); o.visible = false; this.scene.add(o); this.props[m.key] = o; }, (e) => console.warn('prop', m.key, e)));
      models.forEach((m, i) => {
        loader.parse(b64(m.b64), '', (gltf) => {
          const placed = normalize(gltf.scene);
          placed.traverse(o => { if (o.isMesh) { o.frustumCulled = false; if (o.material) o.material.envMapIntensity = 1.1; } });
          placed.visible = false; this.scene.add(placed);
          // flight copy: same shape, the site's single dreamy material
          const flyObj = normalize(gltf.scene.clone(true)); const dm = dreamMaterial(i);
          flyObj.traverse(o => { if (o.isMesh) { o.material = dm; o.frustumCulled = false; } });
          this.items[i] = { placed, flyObj };
          if (--left === 0) { this.ready = true; onReady && onReady(); }
        }, (e) => { console.warn('prod3d', m.key, e); if (--left === 0) { this.ready = this.items.filter(Boolean).length === models.length; onReady && onReady(); } });
      });
    } catch (e) { console.warn('prod3d init', e); }
  },
  resize(w, h) { if (!this.main) return; this.main.r.setSize(w, h, false); this.w = w; this.h = h; },
  // per frame: camera from the map + each product's state
  frame(st) {
    if (!this.ready) return;
    const { cam, look, fov, w, h, items, t } = st;
    if (w !== this.w || h !== this.h) this.resize(w, h);
    const C = this.cam; C.fov = fov; C.aspect = w / Math.max(1, h); C.near = 0.5; C.far = 8000;
    C.position.set(cam[0], -cam[1], cam[2]); C.lookAt(look[0], -look[1], look[2]); C.updateProjectionMatrix(); C.updateMatrixWorld();
    let any = false;
    items.forEach((s, i) => {
      const it = this.items[i]; if (!it) return;
      const o = it.placed, show = s.land > 0.003 && s.vis !== false;
      o.visible = show; if (!show) { (it.extra || []).forEach(c => c.visible = false); return; } any = true;
      o.position.set(s.pos[0], -s.pos[1], s.pos[2]);
      o.rotation.set(0, 0, -s.rz); o.children[0].rotation.set(-s.tilt, 0, 0);
      o.scale.setScalar(s.scale * s.land);
      // extra units of the same product (e.g. several PATH GUARD robots)
      it.extra = it.extra || [];
      (s.extra || []).forEach((e, k) => { let c = it.extra[k]; if (!c) { c = it.extra[k] = o.clone(true); this.scene.add(c); }
        c.visible = true; c.position.set(e.pos[0], -e.pos[1], e.pos[2]); c.rotation.set(0, 0, -(e.rz ?? s.rz)); c.children[0].rotation.set(-(e.tilt ?? s.tilt), 0, 0); c.scale.setScalar(s.scale * s.land); });
      for (let k = (s.extra || []).length; k < it.extra.length; k++) it.extra[k].visible = false;
    });
    (st.props || []).forEach(pr => { const o = this.props && this.props[pr.key]; if (!o) return; o.visible = !!pr.vis; if (!pr.vis) return; any = true;
      o.position.set(pr.pos[0], -pr.pos[1], pr.pos[2]); o.rotation.set(0, 0, pr.rz); o.scale.setScalar(pr.scale);
      const op = pr.op ?? 1; o.traverse(c => { if (c.isMesh && c.material) { c.material.opacity = op; c.material.transparent = op < 0.999; c.material.depthWrite = op > 0.98; } }); });
    this.cv.style.visibility = any ? 'visible' : 'hidden';
    if (any) this.main.r.render(this.scene, C);
  },
  // flight: each product drawn in its own little canvas so it can be out of focus on its own
  flyFrame(i, s) {
    const it = this.items[i]; if (!it) return;
    let f = this.fly[i];
    if (!f) {
      const cv = document.createElement('canvas'); cv.className = 'fp-fly'; cv.setAttribute('aria-hidden', 'true');
      this.flyHost.appendChild(cv);
      const S = 360, rr = mkRenderer(cv, S, S); const sc = new THREE.Scene(); sc.environment = rr.env;
      const l = new THREE.DirectionalLight(0xffffff, 1.6); l.position.set(-1, -2, 3); sc.add(l, new THREE.HemisphereLight(0xC9C3FF, 0xF8CAA7, 1.1)); const l2 = new THREE.PointLight(0xF2B6E3, 6, 0); l2.position.set(2.5, 1, -1); sc.add(l2);
      sc.add(it.flyObj);
      const cam = new THREE.PerspectiveCamera(28, 1, 0.1, 50); cam.up.set(0, 0, 1); cam.position.set(0, -4.6, 1.6); cam.lookAt(0, 0, 0);
      f = this.fly[i] = { cv, rr, sc, cam };
    }
    if (!s || !s.on) { f.cv.style.opacity = 0; return; }
    const o = it.flyObj; o.rotation.set(s.rx, s.ry, s.rz);
    f.rr.r.render(f.sc, f.cam);
    const k = s.px / 295; // canvas shows the model ~295px across at scale 1
    f.cv.style.opacity = s.op.toFixed(3);
    f.cv.style.transform = `translate(${(s.x - 180).toFixed(1)}px,${(s.y - 180).toFixed(1)}px) scale(${k.toFixed(4)})`;
    const lb = s.blur / Math.max(.2, k); // filter runs before the scale
    f.cv.style.filter = lb > 0.15 ? `blur(${lb.toFixed(2)}px)` : 'none';
  },
  // hover card on the final overview map: the product with its own (original) materials, turning slowly
  cardFrame(i, host, t) {
    const it = this.items[i]; if (!it) return;
    this.cards = this.cards || [];
    let c = this.cards[i];
    if (!c || c.host !== host) {
      if (c && c.cv.parentNode) c.cv.remove();
      const cv = document.createElement('canvas'); cv.className = 'pc-model'; cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
      const rr = mkRenderer(cv, 320, 320); const sc = new THREE.Scene(); sc.environment = rr.env;
      const l = new THREE.DirectionalLight(0xffffff, 1.6); l.position.set(-1, -2, 3);
      sc.add(l, new THREE.HemisphereLight(0xEDE8FF, 0xF6D9C8, 0.9));
      const obj = it.placed.clone(true); obj.visible = true; obj.position.set(0, 0, 0); obj.scale.setScalar(1); obj.children[0].rotation.set(0, 0, 0); sc.add(obj);
      const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50); cam.up.set(0, 0, 1); cam.position.set(0, -4.6, 1.8); cam.lookAt(0, 0, 0);
      c = this.cards[i] = { cv, rr, sc, cam, obj, host };
    }
    this.cards.forEach((o, k) => { if (o) o.cv.style.display = k === i ? 'block' : 'none'; });
    c.obj.rotation.set(0.25, 0, t * 0.6);
    c.rr.r.render(c.sc, c.cam);
  },
  // "3가지 제품" in the QUESTION scene: the same dreamy model, spinning in place of the old orbs
  coreFrame(i, host, t) {
    const it = this.items[i]; if (!it) return;
    this.cores = this.cores || [];
    let c = this.cores[i];
    if (!c) {
      const cv = document.createElement('canvas'); cv.className = 't-model'; cv.setAttribute('aria-hidden', 'true'); host.appendChild(cv);
      const rr = mkRenderer(cv, 320, 320); const sc = new THREE.Scene(); sc.environment = rr.env;
      const l = new THREE.DirectionalLight(0xffffff, 1.5); l.position.set(-1, -2, 3);
      const l2 = new THREE.PointLight(0xF2B6E3, 6, 0); l2.position.set(2.5, 1, -1);
      sc.add(l, l2, new THREE.HemisphereLight(0xC9C3FF, 0xF8CAA7, 1.1));
      const obj = it.flyObj.clone(true); sc.add(obj);
      const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 50); cam.up.set(0, 0, 1); cam.position.set(0, -4.4, 1.5); cam.lookAt(0, 0, 0);
      c = this.cores[i] = { cv, rr, sc, cam, obj };
    }
    c.obj.rotation.set(0.35 + Math.sin(t * 0.6 + i) * 0.15, 0, t * 0.7 + i * 2.1);
    c.rr.r.render(c.sc, c.cam);
  },
};
window.Prod3D = Prod3D;
