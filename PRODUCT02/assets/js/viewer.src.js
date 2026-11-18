import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const $ = id => document.getElementById(id);
const canvas = $('dsgCanvas'), stage = canvas.parentElement, hint = $('dsgHint'), fallback = $('dsgFallback');
const ui = $('dsgUI'), pinsLayer = $('dsgPins');
const viewImgs = [...stage.querySelectorAll('.dsg-img[data-view]')];
const thumbs = [...document.querySelectorAll('.dsg-thumb')];
let modelReady = false;

/* ---- 아래 썸네일: 3D ↔ 이미지 전환 (fade 0.3s) ---- */
function showView(view){
  thumbs.forEach(t => { const on = t.dataset.view === view; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
  viewImgs.forEach(img => img.classList.toggle('on', img.dataset.view === view));
  fallback.classList.toggle('on', view === '3d' && !modelReady);
  stage.classList.toggle('img-mode', view !== '3d');
  hint.style.opacity = view === '3d' ? 1 : 0;
}
thumbs.forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));

/* ---- 렌더러: 스튜디오 조명 + 부드러운 그림자 ---- */
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;
const scene = new THREE.Scene();
const DAY = new THREE.Color('#F5F5F7'), NIGHT = new THREE.Color('#000000');
scene.background = DAY.clone();
const envTex = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.03).texture;
scene.environment = envTex;

const key = new THREE.DirectionalLight(0xffffff, 1.6);
key.position.set(0.8, 5, 1.6); key.castShadow = true;
key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 9; key.shadow.blurSamples = 20; key.shadow.bias = -0.0005;
Object.assign(key.shadow.camera, {left:-2, right:2, top:2, bottom:-2, near:0.5, far:10});
scene.add(key);
const rim = new THREE.DirectionalLight(0xdfe6ff, 0.6); rim.position.set(-3, 2, -3); scene.add(rim);

const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);

/* 휠은 페이지 스크롤에 양보 — Ctrl/⌘ + 휠(트랙패드 핀치)일 때만 확대 */
canvas.addEventListener('wheel', e => { if (!e.ctrlKey && !e.metaKey) e.stopImmediatePropagation(); }, {capture:true});
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.dampingFactor = 0.06; controls.enablePan = false;
controls.minDistance = 3; controls.maxDistance = 9; controls.maxPolarAngle = Math.PI * 0.52;
controls.autoRotateSpeed = 0.9;

/* ---- 시점 (segmented control) ---- */
const CAMS = { '34':[2.0,1.1,5.6], front:[0,0.3,6.0], side:[6.0,0.3,0], top:[0,6.0,0.02] };
const seg = ui.querySelector('.seg'), segThumb = seg.querySelector('.thumb'), segBtns = [...seg.querySelectorAll('button')];
let camGoal = null;
function moveThumb(btn){
  if (!btn){ segThumb.style.opacity = 0; return; }
  segThumb.style.opacity = 1;
  segThumb.style.width = btn.offsetWidth + 'px';
  segThumb.style.transform = `translateX(${btn.offsetLeft}px)`;
}
function goCam(k){
  camGoal = new THREE.Vector3(...CAMS[k]).setLength(new THREE.Vector3(...CAMS[k]).length());
  segBtns.forEach(b => b.setAttribute('aria-pressed', b.dataset.cam === k));
  moveThumb(segBtns.find(b => b.dataset.cam === k));
}
camera.position.set(...CAMS['34']);
segBtns.forEach(b => b.addEventListener('click', () => { setRotate(false); goCam(b.dataset.cam); }));
controls.addEventListener('start', () => {
  camGoal = null; setRotate(false); hint.style.opacity = 0;
  segBtns.forEach(b => b.setAttribute('aria-pressed', false)); moveThumb(null);
});
addEventListener('resize', () => moveThumb(segBtns.find(b => b.getAttribute('aria-pressed') === 'true')));

/* ---- 자동 회전 ---- */
const rotBtn = $('rotBtn');
function setRotate(on){ controls.autoRotate = on; rotBtn.setAttribute('aria-pressed', on); rotBtn.setAttribute('aria-label', on ? '자동 회전 멈추기' : '자동 회전'); }
setRotate(true);
rotBtn.addEventListener('click', () => setRotate(!controls.autoRotate));

/* ---- 처음으로 · 전체화면 ---- */
$('resetBtn').addEventListener('click', () => { goCam('34'); setRotate(true); setFan(true); setNight(false); setPins(true); });
const fullBtn = $('fullBtn');
fullBtn.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : stage.requestFullscreen?.()?.catch?.(() => {}));

/* ---- 낮 / 밤 ---- */
const lightBtn = $('lightBtn');
let night = false, glowMats = [], allMats = [], lineMats = [];
function setNight(on){
  night = on; stage.classList.toggle('night', on); lightBtn.setAttribute('aria-pressed', on);
  lightBtn.setAttribute('aria-label', on ? '낮 조명' : '밤 조명');
  renderer.toneMappingExposure = on ? 0.85 : 1.0;
  key.intensity = on ? 0.35 : 1.6; rim.intensity = on ? 1.2 : 0.6;
  allMats.forEach(m => m.envMapIntensity = on ? 0.35 : (m.userData.env ?? 1));
  glowMats.forEach(m => m.emissiveIntensity = on ? 6 : 2.2);
  allMats.forEach(m => { if (m.name === 'FanGlass') m.opacity = on ? 0.09 : 0.16; });
  lineMats.forEach(m => { m.color.set(on ? '#8E8E93' : '#B8B8C0'); });
  ground.material.opacity = on ? 0.4 : 0.1;
  ao.material.opacity = on ? 0.2 : 0.55;
}
lightBtn.addEventListener('click', () => setNight(!night));
// 배경색 전환은 매 프레임 보간
const bgGoal = () => night ? NIGHT : DAY;

/* ---- 바닥: 그림자 받는 면 + 접지 그림자 ---- */
const ground = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({opacity:0.1}));
ground.rotation.x = -Math.PI/2; ground.receiveShadow = true; scene.add(ground);
const sh = document.createElement('canvas'); sh.width = sh.height = 128;
const g2 = sh.getContext('2d'), rg = g2.createRadialGradient(64,64,0,64,64,64);
rg.addColorStop(0,'rgba(0,0,0,.55)'); rg.addColorStop(.45,'rgba(0,0,0,.18)'); rg.addColorStop(1,'rgba(0,0,0,0)'); g2.fillStyle = rg; g2.fillRect(0,0,128,128);
const ao = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sh), transparent:true, depthWrite:false, opacity:0.55}));
ao.rotation.x = -Math.PI/2; scene.add(ao);

/* ---- 사실적인 재질 (임시 모델의 재질 이름일 때만 교체 · 실제 GLB 재질은 그대로 사용) ---- */
function noiseTexture(size = 256, amp = 22){
  const c = document.createElement('canvas'); c.width = c.height = size;
  const x = c.getContext('2d'), d = x.createImageData(size, size);
  for (let i = 0; i < d.data.length; i += 4){ const v = 128 + (Math.random() - .5) * amp * 2; d.data[i] = d.data[i+1] = d.data[i+2] = v; d.data[i+3] = 255; }
  x.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(10, 10); return t;
}
const grain = noiseTexture();
const MATS = {
  WhiteBody: () => new THREE.MeshPhysicalMaterial({   // 무광 오팔 화이트 (미세한 결)
    name:'WhiteBody', color:'#F1F0EC', roughness:0.55, metalness:0,
    clearcoat:0.25, clearcoatRoughness:0.45, sheen:0.3, sheenRoughness:0.8, sheenColor:'#ffffff',
    bumpMap:grain, bumpScale:0.6, roughnessMap:grain }),
  BlackGloss: () => new THREE.MeshPhysicalMaterial({  // 센서 띠: 블랙 글라스
    name:'BlackGloss', color:'#050507', roughness:0.06, metalness:0, clearcoat:1, clearcoatRoughness:0.03, ior:1.6, specularIntensity:1 }),
  Rubber: () => new THREE.MeshStandardMaterial({ name:'Rubber', color:'#141416', roughness:0.85, metalness:0, bumpMap:grain, bumpScale:0.4 }),
  FanGlass: () => new THREE.MeshPhysicalMaterial({    // 투명 폴리카보네이트 가림막
    name:'FanGlass', color:'#EEF0FF', roughness:0.05, metalness:0, clearcoat:1, clearcoatRoughness:0.02,
    ior:1.5, specularIntensity:1, envMapIntensity:1.6, side:THREE.DoubleSide, transparent:true, opacity:0.16, depthWrite:false }),
  RibLight: () => new THREE.MeshStandardMaterial({ name:'RibLight', color:'#ffffff', emissive:'#ffffff', emissiveIntensity:2.2, toneMapped:false, side:THREE.DoubleSide }),
};
function addUV(geo){                                     // 회전체용 원통 UV
  if (geo.attributes.uv) return;
  const p = geo.attributes.position, uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++){ uv[i*2] = Math.atan2(p.getZ(i), p.getX(i)) / (Math.PI*2) + .5; uv[i*2+1] = p.getY(i) * 2; }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
function upgradeMaterials(root){
  const cache = {};
  root.traverse(o => {
    if (!o.isMesh) return;
    const name = o.material.name;
    let k = name;
    if (/^Wheel/.test(o.name) || /^Wheel/.test(o.parent?.name || '')) k = 'Rubber';
    if (MATS[k]){
      addUV(o.geometry);
      o.material = cache[k] ||= MATS[k]();
    }
    const m = o.material;
    o.castShadow = m.name !== 'FanGlass' && m.name !== 'RibLight';
    o.receiveShadow = true;
    m.userData.env = m.envMapIntensity ?? 1;
    allMats.push(m);
    if (m.emissive && m.emissive.getHex() !== 0) glowMats.push(m);
  });
}

/* ---- 가림막 펼치기 / 접기 ---- */
const fanBtn = $('fanBtn'), fanLabel = $('fanLabel');
let fanOpen = true, fanT = 1, fanParts = null, fanLines = null, mixer = null, actions = [];
const PIV = [0, 0.25], R = 0.56, STEPS = 40;
const fanAngles = (side, t) => side < 0 ? [90 + 10*t, 90 + 62*t] : [90 - 62*t, 90 - 10*t];
const rad = THREE.MathUtils.degToRad;
function writeFan(geo, side, t){
  const [a0, a1] = fanAngles(side, t), pos = geo.attributes.position;
  pos.setXYZ(0, PIV[0], PIV[1], 0);
  for (let i = 0; i <= STEPS; i++){ const a = rad(a0 + (a1 - a0) * i / STEPS); pos.setXYZ(i + 1, PIV[0] + R*Math.cos(a), PIV[1] + R*Math.sin(a), 0); }
  pos.needsUpdate = true; geo.computeBoundingSphere();
}
function writeRib(geo, side, t){
  const a = rad(side < 0 ? 90 + 62*t : 90 - 62*t), w = 0.007;
  const dx = Math.cos(a), dy = Math.sin(a), px = -dy*w, py = dx*w, pos = geo.attributes.position;
  const p0 = [PIV[0] + dx*0.09, PIV[1] + dy*0.09], p1 = [PIV[0] + dx*R, PIV[1] + dy*R];
  [[p0[0]-px,p0[1]-py],[p0[0]+px,p0[1]+py],[p1[0]-px,p1[1]-py],[p1[0]+px,p1[1]+py]].forEach((q,i) => pos.setXYZ(i, q[0], q[1], 0));
  pos.needsUpdate = true; geo.computeBoundingSphere();
}
// 가림막의 바깥 테두리 + 접힘선 (실제 렌더의 가는 선)
function writeLines(side, t){
  const L = fanLines[side < 0 ? 0 : 1], [a0, a1] = fanAngles(side, t), pts = [];
  for (let i = 0; i <= STEPS; i++){ const a = rad(a0 + (a1 - a0) * i / STEPS); pts.push(PIV[0] + R*Math.cos(a), PIV[1] + R*Math.sin(a), 0); }
  L.arc.geometry.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  const mid = rad((a0 + a1) / 2), base = rad(side < 0 ? a0 : a1);
  const cr = [];
  [mid, base].forEach(a => cr.push(PIV[0] + Math.cos(a)*0.09, PIV[1] + Math.sin(a)*0.09, 0, PIV[0] + R*Math.cos(a), PIV[1] + R*Math.sin(a), 0));
  L.crease.geometry.setAttribute('position', new THREE.Float32BufferAttribute(cr, 3));
}
function makeFanGeo(){
  const g = new THREE.BufferGeometry(), n = STEPS + 2, idx = [];
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n*3), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(n*3).map((_, i) => i % 3 === 2 ? 1 : 0), 3));
  for (let i = 0; i < STEPS; i++) idx.push(0, i + 1, i + 2);
  g.setIndex(idx); return g;
}
function makeRibGeo(){
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(12), 3));
  g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array([0,0,1,0,0,1,0,0,1,0,0,1]), 3));
  g.setIndex([0,2,1,1,2,3]); return g;
}
function applyFan(t){
  if (!fanParts) return;
  writeFan(fanParts.FanLeft.geometry, -1, t); writeFan(fanParts.FanRight.geometry, 1, t);
  writeRib(fanParts.RibLeft.geometry, -1, t); writeRib(fanParts.RibRight.geometry, 1, t);
  writeLines(-1, t); writeLines(1, t);
  const vis = t > 0.02;
  Object.values(fanParts).forEach(m => m.visible = vis);
  fanLines.forEach(L => { L.arc.visible = L.crease.visible = vis; });
}
function setFan(open){
  fanOpen = open; fanBtn.setAttribute('aria-pressed', open);
  fanLabel.textContent = open ? '가림막 접기' : '가림막 펼치기';
  actions.forEach(a => { a.paused = false; a.timeScale = open ? -1 : 1; a.play(); });
}
fanBtn.addEventListener('click', () => setFan(!fanOpen));

/* ---- 설명 핀 (product.json → TEXT-06.hotspots, 좌표는 GLB 원본 단위) ---- */
const DEFAULT_PINS = [
  {label:'센서 띠', body:'광장 AI 카메라와 위치 정보를 주고받는 상단 블랙 밴드', pos:[0, 0.895, 0.092]},
  {label:'투명 가림막', body:'차량 경로 양옆으로 부채처럼 펼쳐져 동선을 나눕니다', pos:[-0.24, 0.57, 0], fan:true},
  {label:'가장자리 조명', body:'가림막 끝의 빛이 차량 통로의 경계를 그립니다', pos:[0.43, 0.43, 0], fan:true},
  {label:'바퀴', body:'차량 경로 양옆으로 스스로 이동하는 하단 바퀴', pos:[0.07, 0.01, 0.07]}
];
let pins = [], pinsOn = true, model = null;
const pinBtn = $('pinBtn');
function setPins(on){ pinsOn = on; pinBtn.setAttribute('aria-pressed', on); pinsLayer.style.display = on ? '' : 'none'; }
pinBtn.addEventListener('click', () => setPins(!pinsOn));
function buildPins(list){
  pinsLayer.innerHTML = '';
  pins = list.map(p => {
    const el = document.createElement('div');
    el.className = 'pin';
    el.innerHTML = `<button class="pin-dot"></button><div class="pin-card"><b></b><p></p></div>`;
    el.querySelector('.pin-dot').setAttribute('aria-label', p.label);
    el.querySelector('b').textContent = p.label; el.querySelector('p').textContent = p.body || '';
    el.querySelector('button').addEventListener('click', () => { const o = !el.classList.contains('open'); pins.forEach(q => q.el.classList.remove('open')); el.classList.toggle('open', o); });
    pinsLayer.appendChild(el);
    return {el, local:new THREE.Vector3(...p.pos), fan:!!p.fan};
  });
}
const tmp = new THREE.Vector3(), toCam = new THREE.Vector3(), out = new THREE.Vector3();
function updatePins(){
  if (!model || !pinsOn) return;
  const w = stage.clientWidth, h = stage.clientHeight;
  pins.forEach(p => {
    tmp.copy(p.local); model.localToWorld(tmp);
    toCam.copy(camera.position).sub(tmp).normalize();
    out.copy(tmp).setY(0);
    const facing = p.fan || out.length() < 0.05 || toCam.dot(out.normalize()) > -0.35;
    tmp.project(camera);
    p.el.classList.toggle('hide', tmp.z > 1 || (p.fan && fanT < 0.6) || !facing);
    p.el.classList.toggle('left', tmp.x > (w < 600 ? -0.1 : 0.35));
    p.el.style.transform = `translate(${(tmp.x*0.5+0.5)*w}px, ${(-tmp.y*0.5+0.5)*h}px)`;
  });
}

/* ---- 모델 불러오기 ---- */
function onModel(gltf){
  model = gltf.scene;
  const box = new THREE.Box3().setFromObject(model), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const s = 2 / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(s); model.position.sub(c.multiplyScalar(s));
  ground.position.y = ao.position.y = -size.y * s / 2 - 0.002;
  scene.add(model);
  upgradeMaterials(model);

  if (gltf.animations.length){                    // 1) GLB 애니메이션
    mixer = new THREE.AnimationMixer(model);
    actions = gltf.animations.map(clip => { const a = mixer.clipAction(clip); a.setLoop(THREE.LoopOnce); a.clampWhenFinished = true; return a; });
  } else {                                        // 2) 임시 모델: 코드로 접기
    const found = {};
    ['FanLeft','FanRight','RibLeft','RibRight'].forEach(n => { const o = model.getObjectByName(n); const mesh = o && (o.isMesh ? o : o.getObjectByProperty('isMesh', true)); if (mesh) found[n] = mesh; });
    if (Object.keys(found).length === 4){
      found.FanLeft.geometry = makeFanGeo(); found.FanRight.geometry = makeFanGeo();
      found.RibLeft.geometry = makeRibGeo(); found.RibRight.geometry = makeRibGeo();
      fanParts = found;
      const lm = new THREE.LineBasicMaterial({color:'#B8B8C0', transparent:true, opacity:0.9}); lineMats.push(lm);
      fanLines = [0, 1].map(() => {
        const arc = new THREE.Line(new THREE.BufferGeometry(), lm), crease = new THREE.LineSegments(new THREE.BufferGeometry(), lm);
        found.FanLeft.parent.add(arc, crease); return {arc, crease};
      });
      applyFan(1);
    } else fanBtn.hidden = true;                  // 3) 접는 기능 없음
  }

  (window.__contentReady || Promise.resolve()).then(() => buildPins(window.PRODUCT?.['TEXT-06']?.hotspots || DEFAULT_PINS));
  modelReady = true; fallback.classList.remove('on'); ui.hidden = false;
  requestAnimationFrame(() => moveThumb(segBtns[0]));
  hint.textContent = '드래그해서 둘러보기';
}
const loader = new GLTFLoader();
/*__GLB_LOAD__*/loader.load('assets/models/product.glb', onModel,
  e => { if (e.total) hint.textContent = `3D 불러오는 중 ${Math.round(e.loaded / e.total * 100)}%`; },
  () => {                                         // file:// 등으로 .glb를 못 읽으면 내장 사본 사용
    if (window.PRODUCT_GLB_B64) loader.parse(Uint8Array.from(atob(window.PRODUCT_GLB_B64), c => c.charCodeAt(0)).buffer, '', onModel,
      () => { hint.textContent = '3D를 불러오지 못했습니다'; });
    else hint.textContent = '3D는 로컬 서버/배포 환경에서 표시됩니다';
  });

function resize(){
  const w = stage.clientWidth, h = stage.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  controls.target.set(0, camera.aspect < 1 ? -0.28 : 0, 0);   // 세로 화면: 하단 컨트롤 위로 모델을 올림
}
new ResizeObserver(resize).observe(stage); resize();

let visible = false;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(stage);
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  const dt = clock.getDelta();
  if (!visible) return;
  scene.background.lerp(bgGoal(), Math.min(1, dt * 6));
  if (camGoal){                                    // 구면 보간으로 시점 이동
    const len = THREE.MathUtils.lerp(camera.position.length(), camGoal.length(), 0.1);
    camera.position.lerp(camGoal, 0.1).setLength(len);
    if (camera.position.distanceTo(camGoal) < 0.01) camGoal = null;
  }
  const goal = fanOpen ? 1 : 0;
  if (Math.abs(fanT - goal) > 0.001){ fanT += (goal - fanT) * Math.min(1, dt * 4.5); applyFan(fanT); }
  else if (fanT !== goal){ fanT = goal; applyFan(fanT); }
  if (mixer) mixer.update(dt);
  controls.update(); renderer.render(scene, camera); updatePins();
});
