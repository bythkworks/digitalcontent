'use strict';

// 이 스크립트의 위치를 기준으로 3D 번들·모델 경로를 잡는다 (미리보기처럼 인라인이면 페이지 기준)
// about:srcdoc, 샌드박스 blob: 등 비표준 origin에서는 new URL()이 그대로 throw 할 수 있어
// 전체 스크립트 실행이 중단되지 않도록 반드시 try/catch로 감싼다.
let SCRIPT_BASE = null;
try {
  SCRIPT_BASE = document.currentScript && document.currentScript.src
    ? new URL('.', document.currentScript.src) : new URL('assets/js/', location.href);
} catch { SCRIPT_BASE = null; }
const MODEL_VERSION = '2611';
// SCRIPT_BASE를 구할 수 없는 환경(샌드박스 iframe 등)에서도 안전하게 경로를 만든다.
function assetURL(rel) {
  if (SCRIPT_BASE) { try { return new URL(rel, SCRIPT_BASE).href; } catch { /* fall through */ } }
  return rel; // 상대경로 문자열 그대로 반환 (브라우저가 현재 문서 기준으로 해석)
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const navigation = [...document.querySelectorAll('.tabs a')];
const sections = navigation.map(link => document.querySelector(link.hash));
const siteHeader = document.querySelector('.site-header');

let scheduled = false;
function syncNavigation() {
  scheduled = false;
  const threshold = siteHeader.getBoundingClientRect().bottom + 55;
  const active = sections.findLastIndex(section => section.getBoundingClientRect().top <= threshold);
  navigation.forEach((link, index) => {
    if (index === Math.max(0, active)) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function scheduleNavigation() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(syncNavigation);
}
addEventListener('scroll', scheduleNavigation, {passive:true});
addEventListener('resize', scheduleNavigation);
syncNavigation();

const reveal = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('revealed');
    reveal.unobserve(entry.target);
  }
}, {threshold:.12});
document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));

function bindChoices(group, buttons, select) {
  group.addEventListener('keydown', event => {
    const index = buttons.indexOf(event.target);
    if (index < 0) return;
    const shortcuts = {
      ArrowRight: (index + 1) % buttons.length,
      ArrowLeft: (index + buttons.length - 1) % buttons.length,
      Home: 0,
      End: buttons.length - 1
    };
    if (!(event.key in shortcuts)) return;
    event.preventDefault();
    const next = shortcuts[event.key];
    buttons[next].focus();
    select(next);
  });
  buttons.forEach((button, index) => button.addEventListener('click', () => select(index)));
}

// 장면 전환: 중첩된 전환기(작동 방식의 흐름 → 단계)도 자기 버튼·패널만 다루도록, 가장 가까운 전환기가 자신인 요소만 찾는다.
function ownElement(switcher, selector) {
  return [...switcher.querySelectorAll(selector)].find(element => element.closest('[data-switcher]') === switcher);
}
document.querySelectorAll('[data-switcher]').forEach(switcher => {
  const group = ownElement(switcher, '.choice-bar');
  const panelHost = ownElement(switcher, '[data-panels]');
  if (!group || !panelHost) return;
  const buttons = [...group.querySelectorAll('button')];
  const panels = [...panelHost.children];
  const count = switcher.querySelector(':scope > .story-nav .story-count');
  let current = 0;
  function select(index) {
    current = index;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => panel.hidden = i !== index);
    if (count) count.textContent = `${index + 1} / ${panels.length}`;
    switcher.querySelectorAll(':scope > .story-nav [data-step]').forEach(step => {
      const target = index + Number(step.dataset.step);
      step.disabled = target < 0 || target >= panels.length;
    });
  }
  bindChoices(group, buttons, select);
  switcher.querySelectorAll(':scope > .story-nav [data-step]').forEach(step => step.addEventListener('click', () => {
    const target = current + Number(step.dataset.step);
    if (target >= 0 && target < panels.length) select(target);
  }));
  select(0);
});

// ---------- 히어로: 테두리를 도는 파란 점 (움직임 줄이기 설정이면 멈춤) ----------
const heroOrbit = document.querySelector('#heroOrbit');
function syncHeroMotion() {
  if (!heroOrbit || !heroOrbit.pauseAnimations) return;
  if (reduceMotion.matches) { heroOrbit.pauseAnimations(); heroOrbit.setCurrentTime(0); }
  else heroOrbit.unpauseAnimations();
}
syncHeroMotion();
reduceMotion.addEventListener?.('change', syncHeroMotion);

// ---------- 스크롤 단계: 화면 가운데 띠를 지나는 단계를 활성화 ----------
function scrollSteps(container, steps, onStep) {
  let current = -1;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const index = steps.indexOf(entry.target);
      if (index !== current) { current = index; onStep(index); }
    }
  }, {rootMargin: matchMedia('(max-width: 900px)').matches ? '-64% 0px -26% 0px' : '-52% 0px -38% 0px'});
  steps.forEach(step => observer.observe(step));
  onStep(0);
}

// ---------- 문제 상황 · 목표선과 현실 ----------
// 페이지 스크롤은 그대로 두고, 고정된 도면이 스크롤 위치에 따라 8개 장면(비트1, 비트2, 멈춤1~5, 마무리)을 보여 준다.
const problem = document.querySelector('.ps');
if (problem) {
  const STOPS = 8;
  const LINES = ['출구는 저기. 그런데 길이 없다.', '모두 무대를 본다. 서윤만 빼고.', '잠시만요, 잠시만요, 잠시만요…'];
  const scroller = problem.querySelector('.ps-scroller');
  const plan = problem.querySelector('.ps-plan');
  const svg = problem.querySelector('.ps-svg');
  const route = JSON.parse(svg.dataset.route);
  const seo = svg.querySelector('.ps-seo');
  const caption = problem.querySelector('.ps-cap');
  const captionText = problem.querySelector('.ps-cap-text');
  const tail = problem.querySelector('.ps-cap-tail');
  const count = problem.querySelector('.ps-count b');
  const stepped = [...svg.querySelectorAll('[data-k]')];
  const variants = [...svg.querySelectorAll('[data-v]')];
  const VIEW_W = 940;
  let current = -1, step = 0, beat = 1;

  function placeCaption() {
    if (beat > 3) return;
    const scale = plan.clientWidth / VIEW_W;
    const [ax, ay] = route[step];
    const width = caption.offsetWidth, height = caption.offsetHeight;
    // 서윤의 왼쪽 위에 붙이고, 도면 밖으로 나가지 않게 맞춘다
    const anchorX = ax * scale, anchorY = ay * scale;
    const left = Math.max(8, Math.min(plan.clientWidth - width - 8, anchorX + 36 - width));
    const top = Math.max(8, anchorY - 34 - height);
    caption.style.left = `${left}px`;
    caption.style.top = `${top}px`;
    tail.style.left = `${Math.max(16, Math.min(width - 16, anchorX - left))}px`;
  }
  function show(index) {
    if (index === current) return;
    current = index;
    beat = index === 0 ? 1 : index === 1 ? 2 : index < STOPS - 1 ? 3 : 4;
    step = index >= 2 ? Math.min(index - 1, 5) : 0;
    problem.dataset.beat = String(beat);
    problem.dataset.step = String(step);
    stepped.forEach(element => {
      const k = Number(element.dataset.k);
      element.classList.toggle('on', k <= step);
      element.classList.toggle('now', k === step && beat === 3);
    });
    variants.forEach(element => element.classList.toggle('on', Number(element.dataset.v) === step));
    const [x0, y0] = route[0], [x, y] = route[step];
    seo.style.transform = `translate(${x - x0}px, ${y - y0}px)`;
    count.textContent = String(step);
    if (beat <= 3) captionText.textContent = LINES[beat - 1];
    placeCaption();
  }
  let pending = false;
  function update() {
    pending = false;
    const box = scroller.getBoundingClientRect();
    const travel = box.height - innerHeight;
    const progress = Math.min(1, Math.max(0, -box.top / Math.max(1, travel)));
    show(Math.min(STOPS - 1, Math.floor(progress * STOPS)));
  }
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, {passive: true});
  addEventListener('resize', () => { placeCaption(); update(); });
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) problem.classList.add('is-live');
  }, {threshold: .35}).observe(plan);
  update();
  placeCaption();
}

// 사용 시나리오 · 영상이 들어갈 자리를 버튼/휠/키보드로 한 장씩 넘겨본다 (페이지 스크롤과 분리)
const story = document.querySelector('.sx');
if (story) {
  const sxSteps = [...story.querySelectorAll('.sx-step')];
  const gallery = story.querySelector('.sx-frames');
  const frames = [...story.querySelectorAll('.sx-media')];
  const counter = story.querySelector('.sx-count b');
  const rail = [...story.querySelectorAll('.sx-rail li')];
  const prevButton = story.querySelector('.sx-prev');
  const nextButton = story.querySelector('.sx-next');
  if (matchMedia('(min-width: 901px)').matches) frames.forEach(frame => { frame.querySelector('img').loading = 'eager'; });
  let sxIndex = 0;
  function showScene(next) {
    sxIndex = Math.max(0, Math.min(frames.length - 1, next));
    story.dataset.active = String(sxIndex);
    frames.forEach((frame, i) => frame.classList.toggle('on', i === sxIndex));
    sxSteps.forEach((step, i) => step.classList.toggle('is-active', i === sxIndex));
    counter.textContent = String(sxIndex + 1).padStart(2, '0');
    const chapter = sxSteps[sxIndex].dataset.chapter;
    rail.forEach(item => item.classList.toggle('on', item.dataset.chapter === chapter));
    prevButton.disabled = sxIndex === 0;
    nextButton.disabled = sxIndex === frames.length - 1;
  }
  function sxStep(direction) {
    const target = sxIndex + direction;
    if (target < 0 || target >= frames.length) return false;
    showScene(target);
    return true;
  }
  prevButton.addEventListener('click', () => sxStep(-1));
  nextButton.addEventListener('click', () => sxStep(1));
  sxSteps.forEach((step, i) => step.addEventListener('click', () => showScene(i)));
  // 휠 한 번(또는 트랙패드 한 번의 밀기와 그 관성)은 장면 한 장으로 계산한다.
  // 갤러리 위에서만 가로채고, 첫/마지막 장면에서는 페이지가 그대로 스크롤된다.
  let lastWheel = 0, gestureUsed = false, wheelSum = 0, lockUntil = 0;
  gallery.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const now = performance.now();
    if (now - lastWheel > 220) { gestureUsed = false; wheelSum = 0; }
    lastWheel = now;
    const canMove = direction > 0 ? sxIndex < frames.length - 1 : sxIndex > 0;
    if (gestureUsed) { event.preventDefault(); return; }
    if (!canMove) return;
    event.preventDefault();
    wheelSum += event.deltaY;
    if (Math.abs(wheelSum) < 30 || now < lockUntil) return;
    wheelSum = 0;
    sxStep(direction);
    gestureUsed = true;
    lockUntil = now + 450;
  }, {passive: false});
  gallery.tabIndex = 0;
  gallery.addEventListener('keydown', event => {
    const keys = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1};
    if (!(event.key in keys)) return;
    if (sxStep(keys[event.key])) event.preventDefault();
  });
  let sxStart;
  gallery.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') sxStart = [event.clientX, event.clientY]; });
  gallery.addEventListener('pointerup', event => {
    if (!sxStart) return;
    const dx = event.clientX - sxStart[0], dy = event.clientY - sxStart[1];
    sxStart = undefined;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) sxStep(dx < 0 ? 1 : -1);
  });
  showScene(0);
}

// ---------- 핵심 기능 카드: 카드 위에서 스크롤하면 한 장씩 ----------
const deck = document.querySelector('#featureDeck');
if (deck) {
  const cards = [...deck.querySelectorAll('.deck-card')];
  const dotHost = deck.querySelector('.deck-dots');
  const count = deck.querySelector('.deck-count');
  const [prevButton, nextButton] = deck.querySelectorAll('.deck-btn');
  cards.forEach(() => dotHost.append(document.createElement('i')));
  const dots = [...dotHost.children];
  let index = 0, lockUntil = 0, wheelSum = 0;
  function show(next) {
    index = Math.max(0, Math.min(cards.length - 1, next));
    cards.forEach((card, i) => {
      card.dataset.pos = String(i - index);
      card.setAttribute('aria-hidden', String(i !== index));
      card.inert = i !== index;
    });
    dots.forEach((dot, i) => dot.classList.toggle('on', i === index));
    count.textContent = `${index + 1} / ${cards.length}`;
    prevButton.disabled = index === 0;
    nextButton.disabled = index === cards.length - 1;
    deck.classList.toggle('at-end', index === cards.length - 1);
  }
  function step(direction) {
    const target = index + direction;
    if (target < 0 || target >= cards.length) return false;
    show(target);
    deck.classList.add('was-used');
    return true;
  }
  // 휠 한 번(또는 트랙패드 한 번의 밀기와 그 관성)은 카드 한 장으로 계산한다.
  // 이벤트 사이 간격이 220ms를 넘으면 새 동작으로 본다.
  let lastWheel = 0, gestureUsed = false;
  deck.addEventListener('wheel', event => {
    if (Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
    const direction = Math.sign(event.deltaY);
    if (!direction) return;
    const now = performance.now();
    if (now - lastWheel > 220) { gestureUsed = false; wheelSum = 0; }
    lastWheel = now;
    const canMove = direction > 0 ? index < cards.length - 1 : index > 0;
    if (gestureUsed) { event.preventDefault(); return; }
    if (!canMove) return;               // 첫·마지막 카드에서는 페이지가 그대로 스크롤된다
    event.preventDefault();
    wheelSum += event.deltaY;
    if (Math.abs(wheelSum) < 30 || now < lockUntil) return;
    wheelSum = 0;
    step(direction);
    gestureUsed = true;
    lockUntil = now + 450;
  }, {passive: false});
  prevButton.addEventListener('click', () => step(-1));
  nextButton.addEventListener('click', () => step(1));
  deck.addEventListener('keydown', event => {
    const keys = {ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1};
    if (event.target !== deck || !(event.key in keys)) return;
    if (step(keys[event.key])) event.preventDefault();
  });
  // 터치: 가로로 밀면 카드 이동, 세로 스크롤은 그대로 페이지로
  let start;
  deck.addEventListener('pointerdown', event => { if (event.pointerType !== 'mouse') start = [event.clientX, event.clientY]; });
  deck.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start[0], dy = event.clientY - start[1];
    start = undefined;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) step(dx < 0 ? 1 : -1);
  });
  show(0);
}

// ---------- 다이얼 시연 ----------
const product = document.querySelector('#flowayProduct');
const title = document.querySelector('#responseTitle');
const description = document.querySelector('#responseBody');
const sigLed = document.querySelector('#sigLed');
const sigHaptic = document.querySelector('#sigHaptic');
const sigGuide = document.querySelector('#sigGuide');
const hapticWave = document.querySelector('#hapticWave');
const hapticLabel = document.querySelector('#hapticLabel');
const responseGroup = document.querySelector('.response-buttons');
const responseButtons = [...responseGroup.querySelectorAll('button')];
const roleGroup = document.querySelector('.role-bar');
const roleButtons = [...roleGroup.querySelectorAll('button')];
const requesterControls = document.querySelector('#requesterControls');
const cooperatorControls = document.querySelector('#cooperatorControls');
const LEVELS = {
  green: {led: '초록 · 점멸 없음', haptic: 0, hapticText: '진동 없음'},
  yellow: {led: '노랑 · 느린 반복 점멸', haptic: 1, hapticText: '공연 중에도 느낄 수 있는 반복 진동'},
  orange: {led: '주황 · 중간 반복 점멸', haptic: 2, hapticText: '단계적으로 강해지는 반복 진동'},
  red: {led: '빨강 · 강한 반복 점멸', haptic: 3, hapticText: '매우 강한 반복 진동'}
};
const STATES = {
  request: {led: 'green', guide: 58, title: '이탈 희망 · 오른쪽 화살표', body: '다이얼을 오른쪽 화살표로 돌려 나가고 싶다는 요청을 보낸 상태입니다.', guideText: '나갈 방향을 실시간으로 가리킵니다.'},
  waiting: {led: 'orange', guide: 58, title: '대기 · AI 알림 · 아래쪽 모래시계', body: '주변이 복잡해 AI가 주변 사용자를 살피며 최적의 경로를 요청하는 중입니다. 지시선이 모래시계를 가리키는 동안 기다려 주세요.', guideText: '새 경로가 정해지면 그 방향으로 회전합니다.'},
  unavailable: {led: 'red', guide: 0, title: '이탈 불가 · 왼쪽 X', body: '위험한 상황이라 지금은 이동하면 안 됩니다. 지시선이 X를 가리킵니다.', guideText: '이동 방향을 안내하지 않습니다.'},
  cooperator: {led: 'yellow', guide: 270, title: '협조 알림 · 주변 확인', body: '근처 관람객이 나가려 하거나 구역이 붐벼 내 자리가 필요해진 상태입니다. 다이얼을 돌릴 필요는 없습니다.', guideText: '비켜설 방향을 가리킵니다.'}
};
function wavePath(level) {
  if (!level) return 'M0 17H160';
  let d = 'M0 17';
  for (let x = 0; x <= 160; x += 2) {
    const amp = level === 1 ? 6 : level === 2 ? 3 + 10 * x / 160 : 13;
    const freq = [0, .16, .28, .5][level];
    d += ` L${x} ${(17 + amp * Math.sin(x * freq)).toFixed(1)}`;
  }
  return d;
}
let stateKey = 'request';
function render(key) {
  const state = STATES[key];
  const level = LEVELS[state.led];
  product.dataset.mode = key === 'cooperator' ? product.dataset.mode : key;
  product.dataset.led = state.led;
  product.dataset.haptic = String(level.haptic);
  product.style.setProperty('--guide-angle', `${state.guide}deg`);
  title.textContent = state.title;
  description.textContent = state.body;
  sigLed.textContent = level.led;
  sigHaptic.textContent = level.hapticText;
  sigGuide.textContent = state.guideText;
  hapticWave.setAttribute('d', wavePath(level.haptic));
  hapticLabel.textContent = level.hapticText;
}
function showState(index) {
  stateKey = responseButtons[index].dataset.mode;
  responseButtons.forEach((button, i) => {
    button.classList.toggle('active', i === index);
    button.setAttribute('aria-pressed', String(i === index));
  });
  render(stateKey);
}
function showRole(index) {
  const role = roleButtons[index].dataset.role;
  product.dataset.role = role;
  roleButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  requesterControls.hidden = role !== 'requester';
  cooperatorControls.hidden = role !== 'cooperator';
  render(role === 'cooperator' ? 'cooperator' : stateKey);
}
bindChoices(responseGroup, responseButtons, showState);
bindChoices(roleGroup, roleButtons, showRole);
render('request');

// ---------- 제품 디자인 · 3D ----------
// 순서: (1) WebGL 확인 → (2) 3D 번들(floway-3d.js) → (3) 모델: 서버에서는 GLB 파일, 실패하거나 file://이면 데이터 스크립트
// 어느 단계에서 실패해도 렌더 이미지를 그대로 두고 이유를 한 줄로 알린다.
const modelDock = document.querySelector('#modelDock');
const modelStatus = document.querySelector('#modelStatus');
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('script'));
    document.head.append(script);
  });
}
function base64ToBuffer(b64) {
  const binary = atob(b64), bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}
function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
}
function showProgress(ratio) {
  modelStatus.textContent = ratio == null ? '3D 모델 불러오는 중' : `3D 모델 불러오는 중 ${Math.round(ratio * 100)}%`;
}
async function modelFromData() {
  if (!window.FLOWAY_MODEL) await loadScript(assetURL(`../models/floway-${MODEL_VERSION}.js`));
  return {buffer: base64ToBuffer(window.FLOWAY_MODEL.b64)};
}
function fail(reason) {
  modelDock.classList.add('is-failed');
  modelStatus.textContent = `${reason} 렌더 이미지로 보여 드리며, 위 버튼으로 다섯 방향을 볼 수 있습니다.`;
}
let viewerStarted = false;
async function startViewer() {
  if (viewerStarted) return;
  viewerStarted = true;
  if (!hasWebGL()) return fail('이 브라우저에서는 3D(WebGL)를 쓸 수 없어');
  showProgress(null);
  try {
    if (!window.FLOWAY3D) await loadScript(assetURL('floway-3d.js'));
  } catch { return fail('3D 뷰어 파일을 불러오지 못해'); }
  const view = {
    canvas: document.querySelector('#dsgCanvas'), reset: document.querySelector('#reset3d'),
    spin: document.querySelector('#spin3d'), onProgress: showProgress
  };
  const sources = [];
  if (!window.FLOWAY_MODEL && location.protocol !== 'file:') sources.push(async () => ({url: assetURL(`../models/floway-${MODEL_VERSION}.glb`)}));
  sources.push(modelFromData);
  for (const getSource of sources) {
    try {
      await window.FLOWAY3D.openViewer({...view, source: await getSource()});
      modelDock.classList.add('is-ready');
      modelStatus.textContent = '';
      return;
    } catch { /* 다음 방법으로 */ }
  }
  fail('3D 모델 파일을 불러오지 못해');
}
if (modelDock) {
  new IntersectionObserver((entries, observer) => {
    if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); startViewer(); }
  }, {rootMargin: '400px 0px'}).observe(modelDock);
}
