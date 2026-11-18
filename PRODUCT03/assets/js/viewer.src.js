import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const canvas = document.getElementById('dsgCanvas');
const stage = canvas.parentElement;
const hint = document.getElementById('dsgHint');
const fallback = document.getElementById('dsgFallback');
const viewImgs = [...stage.querySelectorAll('.dsg-img[data-view]')];
const thumbs = [...document.querySelectorAll('.dsg-thumb')];
let modelReady = false;

/* 썸네일 클릭 → 대표 이미지 교체 (fade 0.3s) / 3D 복귀 */
function showView(view){
  thumbs.forEach(t => { const on = t.dataset.view === view; t.classList.toggle('on', on); t.setAttribute('aria-selected', on); });
  viewImgs.forEach(img => img.classList.toggle('on', img.dataset.view === view));
  fallback.classList.toggle('on', view === '3d' && !modelReady);
  hint.style.opacity = view === '3d' ? 1 : 0;
}
thumbs.forEach(t => t.addEventListener('click', () => showView(t.dataset.view)));

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(1.8, 1.0, 5.6);           // 3/4 정면 뷰 (팬이 보이도록)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.enablePan = false;
controls.minDistance = 3; controls.maxDistance = 9;
controls.autoRotate = true; controls.autoRotateSpeed = 1.2;
controls.addEventListener('start', () => controls.autoRotate = false);

// 부드러운 바닥 그림자
const sh = document.createElement('canvas'); sh.width = sh.height = 128;
const g = sh.getContext('2d'); const rg = g.createRadialGradient(64,64,0,64,64,64);
rg.addColorStop(0,'rgba(90,80,140,.35)'); rg.addColorStop(1,'rgba(90,80,140,0)'); g.fillStyle = rg; g.fillRect(0,0,128,128);
const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.8), new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(sh), transparent:true, depthWrite:false}));
shadow.rotation.x = -Math.PI/2; shadow.position.y = -0.42; scene.add(shadow);

// 더블클릭(file://)일 때는 내장 사본(assets/models/product-glb.js)을 사용
const __glbLoad=(url,onLoad,onProg,onErr)=>{const L=new GLTFLoader();if(location.protocol==='file:'&&window.PRODUCT_GLB_B64)L.parse(Uint8Array.from(atob(window.PRODUCT_GLB_B64),ch=>ch.charCodeAt(0)).buffer,'',onLoad,onErr);else L.load(url,onLoad,onProg,e=>{if(window.PRODUCT_GLB_B64)L.parse(Uint8Array.from(atob(window.PRODUCT_GLB_B64),ch=>ch.charCodeAt(0)).buffer,'',onLoad,onErr);else onErr&&onErr(e)})};
__glbLoad('assets/models/product.glb', gltf => {
  const m = gltf.scene;

  const box = new THREE.Box3().setFromObject(m), size = box.getSize(new THREE.Vector3()), c = box.getCenter(new THREE.Vector3());
  const s = 2 / Math.max(size.x, size.y, size.z);
  m.scale.setScalar(s); m.position.sub(c.multiplyScalar(s));

  // 렌더 이미지(IMG-01)와 색감을 맞추기 위한 보정: 파스텔 페이스 채도↑ + 은은한 발광, 인디케이터 발광
  m.traverse(o => {
    if (!o.isMesh) return;
    const mat = o.material, n = mat.name;
    if (n === 'Pastel_Gradient' && mat.map && mat.map.image) {
      // GLB 텍스처가 렌더보다 옅어서, 렌더 색(라벤더 → 핑크)으로 그라데이션을 다시 그림
      const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 16;
      const cx = cv.getContext('2d'), gr = cx.createLinearGradient(0, 0, 1024, 0);
      gr.addColorStop(0, '#C7A6F4'); gr.addColorStop(.5, '#E2B0EC'); gr.addColorStop(1, '#F7B4DC');
      cx.fillStyle = gr; cx.fillRect(0, 0, 1024, 16);
      const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
      mat.map = t; mat.emissiveMap = t; mat.emissive.set('#ffffff'); mat.emissiveIntensity = .22; mat.needsUpdate = true;
    }
    if (n === 'Cyan_Indicator') { mat.emissive.set('#35E8FF'); mat.emissiveIntensity = .7; }
    if (n === 'Mint_Inlay')     { mat.emissive.set('#45F59A'); mat.emissiveIntensity = 1.1; }
  });
  shadow.position.y = -size.y * s / 2 - 0.01;
  scene.add(m);
  modelReady = true; fallback.classList.remove('on');
  hint.textContent = '드래그해서 회전 · 스크롤해서 확대';
}, undefined, () => {
  hint.textContent = '3D는 로컬 서버/배포 환경에서 표시됩니다';
});

function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage); resize();

// 화면에 보일 때만 렌더
let visible = false;
new IntersectionObserver(([e]) => visible = e.isIntersecting).observe(stage);
renderer.setAnimationLoop(() => { if (!visible) return; controls.update(); renderer.render(scene, camera); });
