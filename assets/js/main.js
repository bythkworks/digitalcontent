(()=>{
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const range=(p,a,b)=>clamp((p-a)/(b-a));
const eOut=t=>1-Math.pow(1-t,3), eIn=t=>t*t*t, eIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
const bump=t=>Math.sin(Math.PI*clamp(t));
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let VW=innerWidth, VH=innerHeight;

/* ======================= IMAGERY (generated SVG) ======================= */
let uid=0;
function rng(seed){let s=seed>>>0||1;return()=>(s=(s*1664525+1013904223)>>>0)/4294967296}
const PAL={
  dusk:['#CFE2F3','#E2DCF4','#F5DAEB','#FCE5D4'],
  day:['#D7E9F6','#E6EEF8','#EFE6F6','#F9EDE4'],
  lav:['#DCD9F3','#E8DDF5','#F4DDEE','#FBE8DC'],
  peach:['#E4E4F6','#F1DFEF','#F9DFE3','#FCE9D9'],
};
function scene(opt={}){
  const id='s'+(uid++); const p=PAL[opt.pal||'dusk']; const r=rng(opt.seed||3);
  const crowd=opt.crowd??60;
  let ppl='';
  for(let i=0;i<crowd;i++){const x=r()*1600, y=760+r()*170, s=.6+ (y-760)/170*0.9; const c=['#B9B4DA','#C9B6D9','#AFC3DD','#D8BCCB'][i%4];
    ppl+=`<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)}) scale(${s.toFixed(2)})" opacity=".75"><circle cy="-46" r="9" fill="${c}"/><rect x="-10" y="-36" width="20" height="38" rx="10" fill="${c}"/></g>`}
  let bulbs='';
  for(const [x0,y0,x1,y1,cy] of [[180,520,800,470,600],[800,470,1420,520,600]]){for(let i=0;i<=14;i++){const t=i/14;const x=(1-t)*(1-t)*x0+2*(1-t)*t*((x0+x1)/2)+t*t*x1;const y=(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1;bulbs+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="${['#FFF3E6','#F3E1FA','#E3F0FB','#FBE3F1'][i%4]}" filter="url(#${id}g2)"/>`}}
  let orbs='';
  for(let i=0;i<(opt.orbs??4);i++){const x=200+r()*1200,y=170+r()*260,s=18+r()*30;orbs+=orb(id,x,y,s)}
  const motif=opt.motif?motifs[opt.motif](id,r):'';
  return `<svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${opt.alt||'파스텔 조명이 켜진 미래 축제 풍경 일러스트'}">
<defs>
<linearGradient id="${id}sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p[0]}"/><stop offset=".42" stop-color="${p[1]}"/><stop offset=".7" stop-color="${p[2]}"/><stop offset="1" stop-color="${p[3]}"/></linearGradient>
<radialGradient id="${id}sun"><stop offset="0" stop-color="#FFF4EA"/><stop offset=".45" stop-color="#F8CAA7" stop-opacity=".6"/><stop offset="1" stop-color="#F8CAA7" stop-opacity="0"/></radialGradient>
<linearGradient id="${id}pav" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F1ECF8"/></linearGradient>
<radialGradient id="${id}in" cx=".5" cy=".8" r=".8"><stop offset="0" stop-color="#FFE6F3"/><stop offset=".5" stop-color="#E9C3E6"/><stop offset="1" stop-color="#C7C1EE"/></radialGradient>
<linearGradient id="${id}gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3ECF6"/><stop offset="1" stop-color="#FFFFFF"/></linearGradient>
<linearGradient id="${id}beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset="1" stop-color="#fff" stop-opacity=".55"/></linearGradient>
<radialGradient id="${id}orb" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#E6E9FA"/><stop offset=".7" stop-color="#D9C9F0"/><stop offset="1" stop-color="#F4CBE3"/></radialGradient>
<filter id="${id}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="${id}g2" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="2.2"/></filter>
<linearGradient id="${id}fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="${opt.fade??.9}"/></linearGradient>
</defs>
<rect width="1600" height="1000" fill="url(#${id}sky)"/>
<circle cx="1140" cy="430" r="300" fill="url(#${id}sun)"/>
<path d="M0 620 C 240 540 430 560 650 600 S 1080 530 1300 575 S 1520 600 1600 585 V1000 H0Z" fill="#E6DCF2" opacity=".85"/>
<path d="M0 660 C 300 620 520 640 800 650 S 1300 630 1600 655 V1000 H0Z" fill="#F1E6F3"/>
<path d="M0 690 H1600 V1000 H0Z" fill="url(#${id}gr)"/>
<ellipse cx="800" cy="640" rx="300" ry="60" fill="#F3B8DD" opacity=".45" filter="url(#${id}g)"/>
<path d="M560 705 V520 C560 360 1040 360 1040 520 V705 Z" fill="url(#${id}pav)"/>
<path d="M640 705 V560 C640 450 960 450 960 560 V705Z" fill="url(#${id}in)"/>
<g opacity=".8"><path d="M700 470 L560 705 H660Z" fill="url(#${id}beam)"/><path d="M800 455 L760 705 H840Z" fill="url(#${id}beam)"/><path d="M900 470 L940 705 H1040Z" fill="url(#${id}beam)"/></g>
<ellipse cx="800" cy="700" rx="220" ry="18" fill="#fff" opacity=".7" filter="url(#${id}g2)"/>
<g><ellipse cx="300" cy="700" rx="170" ry="40" fill="#F4C3E2" opacity=".5" filter="url(#${id}g)"/>
<path d="M140 715 C140 590 210 545 265 585 C300 500 400 505 420 600 C460 575 500 615 500 715 Z" fill="url(#${id}pav)"/>
<path d="M215 715 V650 C215 615 285 615 285 650 V715Z" fill="url(#${id}in)" opacity=".9"/>
<path d="M330 715 V640 C330 600 410 600 410 640 V715Z" fill="url(#${id}in)" opacity=".75"/></g>
<g><ellipse cx="1310" cy="700" rx="170" ry="40" fill="#C9D9F4" opacity=".55" filter="url(#${id}g)"/>
<path d="M1110 715 C1110 600 1170 560 1230 595 C1265 520 1380 520 1400 605 C1450 590 1480 630 1480 715Z" fill="url(#${id}pav)"/>
<path d="M1190 715 V655 C1190 620 1260 620 1260 655 V715Z" fill="url(#${id}in)" opacity=".85"/>
<path d="M1310 715 V645 C1310 605 1390 605 1390 645 V715Z" fill="url(#${id}in)" opacity=".7"/></g>
<path d="M180 520 Q490 600 800 470 Q1110 600 1420 520" fill="none" stroke="#D9D2EA" stroke-width="1.5"/>
${bulbs}
${orbs}
${ppl}
<path d="M-20 1000 V720 C-20 560 260 545 280 700 V1000 h-46 V725 C230 615 30 625 30 725 V1000Z" fill="url(#${id}pav)" opacity=".96"/>
<path d="M1620 1000 V720 C1620 560 1340 545 1320 700 V1000 h46 V725 C1370 615 1570 625 1570 725 V1000Z" fill="url(#${id}pav)" opacity=".96"/>
${motif}
<rect y="760" width="1600" height="240" fill="url(#${id}fade)"/>
</svg>`;
}
function orb(id,x,y,s){return `<g transform="translate(${x.toFixed(0)} ${y.toFixed(0)})"><circle r="${s*1.8}" fill="#fff" opacity=".35" filter="url(#${id}g2)"/><circle r="${s}" fill="url(#${id}orb)" opacity=".95"/><ellipse cx="${-s*.32}" cy="${-s*.38}" rx="${s*.34}" ry="${s*.2}" fill="#fff" opacity=".85" transform="rotate(-30)"/></g>`}
const motifs={
  orb:(id)=>`<g><circle cx="800" cy="330" r="190" fill="#fff" opacity=".35" filter="url(#${id}g)"/>${orb(id,800,330,105)}<ellipse cx="800" cy="330" rx="200" ry="50" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/><ellipse cx="800" cy="330" rx="260" ry="70" fill="none" stroke="#fff" stroke-width="1" opacity=".5" stroke-dasharray="4 8"/></g>`,
  waves:(id)=>{let s='';for(let i=1;i<=5;i++)s+=`<ellipse cx="800" cy="760" rx="${i*120}" ry="${i*30}" fill="none" stroke="#fff" stroke-width="${3-i*.4}" opacity="${1-i*.16}"/>`;return `<g>${s}${orb(id,800,600,46)}<rect x="770" y="640" width="60" height="120" rx="30" fill="#fff" opacity=".9"/></g>`},
  person:(id)=>`<g><circle cx="800" cy="520" r="200" fill="#fff" opacity=".35" filter="url(#${id}g)"/><circle cx="800" cy="440" r="48" fill="#fff"/><rect x="738" y="500" width="124" height="230" rx="62" fill="#fff"/><circle cx="800" cy="560" r="150" fill="none" stroke="#fff" stroke-width="2" opacity=".8"/>
<g transform="translate(930 330)"><rect width="230" height="110" rx="26" fill="#fff" opacity=".6"/><rect width="230" height="110" rx="26" fill="none" stroke="#fff" stroke-width="2"/><circle cx="44" cy="55" r="18" fill="#E8B0DD"/><rect x="78" y="38" width="120" height="12" rx="6" fill="#B8B6E5" opacity=".7"/><rect x="78" y="62" width="80" height="10" rx="5" fill="#9CC8E2" opacity=".6"/></g></g>`,
  network:(id)=>{const pts=[[420,330],[700,240],[980,320],[1200,250],[560,480],[860,450],[1120,470]];let l='';[[0,1],[1,2],[2,3],[0,4],[4,5],[5,2],[5,6],[6,3],[1,5]].forEach(([a,b])=>l+=`<line x1="${pts[a][0]}" y1="${pts[a][1]}" x2="${pts[b][0]}" y2="${pts[b][1]}" stroke="#fff" stroke-width="2" opacity=".75"/>`);return `<g>${l}${pts.map((q,i)=>orb(id,q[0],q[1],i%3?24:34)).join('')}</g>`},
};

/* product visuals */
function prodSVG(kind){
  const id='p'+(uid++);
  const defs=`<defs>
<linearGradient id="${id}i" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C9E1F2"/><stop offset=".35" stop-color="#D5D2F3"/><stop offset=".65" stop-color="#F2CDEA"/><stop offset="1" stop-color="#FBDCC6"/></linearGradient>
<linearGradient id="${id}j" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity=".95"/><stop offset=".5" stop-color="#ffffff" stop-opacity=".25"/><stop offset="1" stop-color="#ffffff" stop-opacity=".7"/></linearGradient>
<linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E7E6F1"/></linearGradient>
<radialGradient id="${id}glow"><stop offset="0" stop-color="#fff"/><stop offset=".4" stop-color="#F3D3EE"/><stop offset="1" stop-color="#F3D3EE" stop-opacity="0"/></radialGradient>
<filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
  const shadow=`<ellipse cx="300" cy="520" rx="170" ry="26" fill="#8C84C4" opacity=".22" filter="url(#${id}b)"/>`;
  const shapes={
    band:`<g transform="rotate(-14 300 300)"><ellipse cx="300" cy="300" rx="170" ry="120" fill="none" stroke="url(#${id}i)" stroke-width="64"/><ellipse cx="300" cy="300" rx="170" ry="120" fill="none" stroke="url(#${id}j)" stroke-width="64" opacity=".6"/><ellipse cx="300" cy="300" rx="198" ry="148" fill="none" stroke="#fff" stroke-width="2" opacity=".9"/><ellipse cx="300" cy="300" rx="140" ry="92" fill="none" stroke="#fff" stroke-width="1.5" opacity=".7"/>
<rect x="220" y="140" width="160" height="78" rx="34" fill="url(#${id}w)" stroke="#fff" stroke-width="2"/><rect x="236" y="154" width="128" height="50" rx="25" fill="url(#${id}i)" opacity=".85"/><circle cx="300" cy="179" r="22" fill="url(#${id}glow)"/><path d="M262 179h76" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/></g>`,
    light:`<rect x="250" y="250" width="100" height="250" rx="50" fill="url(#${id}w)" stroke="#fff" stroke-width="2"/><circle cx="300" cy="215" r="150" fill="url(#${id}glow)" opacity=".75"/><path d="M190 230 a110 110 0 0 1 220 0 v10 h-220z" fill="url(#${id}i)"/><path d="M190 230 a110 110 0 0 1 220 0" fill="none" stroke="#fff" stroke-width="3"/><path d="M220 210 a80 80 0 0 1 70 -70" stroke="#fff" stroke-width="10" stroke-linecap="round" fill="none" opacity=".7"/><rect x="275" y="320" width="50" height="8" rx="4" fill="url(#${id}i)"/><rect x="275" y="340" width="50" height="8" rx="4" fill="url(#${id}i)" opacity=".6"/>`,
    pod:`<path d="M110 500 C110 250 200 150 300 150 C400 150 490 250 490 500 Z" fill="url(#${id}i)" opacity=".85"/><path d="M110 500 C110 250 200 150 300 150 C400 150 490 250 490 500 Z" fill="url(#${id}j)" opacity=".7"/><path d="M200 500 C200 330 250 280 300 280 C350 280 400 330 400 500Z" fill="#fff" opacity=".85"/><rect x="230" y="420" width="140" height="40" rx="20" fill="url(#${id}i)"/><path d="M150 400 C150 260 210 190 280 175" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>`,
    sign:`<rect x="190" y="110" width="220" height="380" rx="40" fill="url(#${id}i)" opacity=".7"/><rect x="190" y="110" width="220" height="380" rx="40" fill="url(#${id}j)" opacity=".75" stroke="#fff" stroke-width="2"/><rect x="225" y="160" width="150" height="16" rx="8" fill="#fff"/><rect x="225" y="200" width="110" height="12" rx="6" fill="#fff" opacity=".75"/><g fill="#fff"><rect x="225" y="270" width="150" height="30" rx="15" opacity=".95"/><rect x="225" y="315" width="110" height="30" rx="15" opacity=".7"/><rect x="225" y="360" width="70" height="30" rx="15" opacity=".5"/></g><circle cx="355" cy="285" r="7" fill="#E8B0DD"/><rect x="270" y="490" width="60" height="20" rx="6" fill="url(#${id}w)"/>`,
    beacon:`<circle cx="300" cy="320" r="210" fill="none" stroke="url(#${id}i)" stroke-width="2" opacity=".6"/><circle cx="300" cy="320" r="160" fill="none" stroke="url(#${id}i)" stroke-width="3" opacity=".8"/><path d="M190 340 C190 250 240 210 300 210 C360 210 410 250 410 340 C410 420 360 450 300 450 C240 450 190 420 190 340Z" fill="url(#${id}w)" stroke="#fff" stroke-width="2"/><path d="M215 330 C215 270 255 240 300 240 C345 240 385 270 385 330" fill="none" stroke="url(#${id}i)" stroke-width="22" stroke-linecap="round"/><circle cx="300" cy="350" r="34" fill="url(#${id}glow)"/><circle cx="300" cy="350" r="10" fill="#E8B0DD"/>`,
    station:`<rect x="180" y="190" width="240" height="300" rx="60" fill="url(#${id}w)" stroke="#fff" stroke-width="2"/><ellipse cx="300" cy="190" rx="120" ry="34" fill="url(#${id}i)"/><ellipse cx="300" cy="190" rx="120" ry="34" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="300" cy="186" rx="80" ry="18" fill="#fff" opacity=".6"/><rect x="180" y="300" width="240" height="18" fill="url(#${id}i)" opacity=".75"/><circle cx="300" cy="400" r="26" fill="none" stroke="url(#${id}i)" stroke-width="6"/><path d="M200 260 v150" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".8"/>`,
  };
  return `<svg viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="글래스모피즘 제품 렌더링">${defs}${shadow}${shapes[kind]}</svg>`;
}
function prodTile(kind,bg){return `<svg viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="tg${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${bg[0]}"/><stop offset="1" stop-color="${bg[1]}"/></linearGradient></defs><rect width="600" height="600" fill="url(#tg${uid++})"/></svg>`+prodSVG(kind)}

/* ======================= DATA ======================= */
const CHAPTERS=[
  {k:'CH.01',t:'AI가 공간으로 들어오다',d:'2031년, 소형 MCU가 탑재된 AI는 개인 기기와 일상 공간 곳곳에서 작동하기 시작했습니다.',m:'orb',pal:'dusk'},
  {k:'CH.02',t:'공간이 상황을 읽다',d:'벤치와 조명, 길과 무대가 스스로 주변의 소리와 붐빔을 느끼고 지금의 분위기를 이해합니다.',m:'waves',pal:'day'},
  {k:'CH.03',t:'나를 이해하는 AI',d:'AI는 나의 취향과 컨디션을 기억해, 필요한 순간에만 조용히 말을 겁니다.',m:'person',pal:'lav'},
  {k:'CH.04',t:'함께 만드는 일상',d:'개인과 공간, 운영자가 연결되어 모두에게 조금 더 편안한 하루를 함께 만들어 갑니다.',m:'network',pal:'peach'},
];
const SYS=[
  {k:'01',t:'SENSE',h:'공간과 사람의 상황을 감지합니다',p:'작은 MCU 센서들이 축제 곳곳에서 지금의 상태를 조용히 읽어냅니다.',c:['혼잡도','소음','온도','움직임'],
   ic:'<svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#7FAFD0" stroke-width="1.8" stroke-linecap="round"><circle cx="17" cy="17" r="3"/><path d="M11 11a8.5 8.5 0 0 0 0 12M23 11a8.5 8.5 0 0 1 0 12M7 7a14 14 0 0 0 0 20M27 7a14 14 0 0 1 0 20"/></svg>'},
  {k:'02',t:'DECIDE',h:'맥락을 이해하고 판단합니다',p:'시간과 장소, 개인의 취향을 함께 고려해 지금 가장 필요한 것이 무엇인지 판단합니다.',c:['시간대','개인 취향','공간 상태','안전'],
   ic:'<svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#8E8AD8" stroke-width="1.8" stroke-linecap="round"><circle cx="8" cy="9" r="3"/><circle cx="26" cy="9" r="3"/><circle cx="17" cy="26" r="3"/><path d="M10.5 10.8 15 23.5M23.5 10.8 19 23.5M11 9h12"/></svg>'},
  {k:'03',t:'ACT',h:'필요한 안내와 대응을 제공합니다',p:'빛과 진동, 소리처럼 화면이 아닌 방식으로 사람에게 자연스럽게 다가갑니다.',c:['빛','진동','소리','운영 알림'],
   ic:'<svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="#D08FC6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 4 8 19h8l-2 11 11-16h-8l1-10z"/></svg>'},
];
const CAT={personal:'개인',space:'공간',operator:'운영'};
const PRODUCTS=[
 {n:1,name:'MCUAI 웨어러블 PUI',place:'웰컴 파빌리온',cat:'personal',kind:'band',b:[170,190,150,130,90],
  one:'손목 위의 빛과 진동으로, 붐비는 축제 속 나만의 길을 안내합니다.',
  problem:'수만 명이 모이는 축제에서 사람들은 지도 앱을 보느라 고개를 숙이고, 혼잡한 동선 속에서 보고 싶던 공연과 부스를 놓칩니다.',
  points:['화면을 보지 않는 안내','혼잡도 기반 동선 추천','취향을 기억하는 하루'],
  steps:[['착용과 연결','입장 게이트에서 밴드를 착용하면 오늘의 관심사가 가볍게 연결됩니다.'],['빛으로 안내','가야 할 방향을 손목 위의 빛이 은은하게 가리킵니다.'],['진동으로 알림','기다리던 공연이 시작되기 전, 짧은 진동으로 알려줍니다.'],['기억으로 이어짐','다녀간 부스와 순간이 하루의 기록으로 남습니다.']],
  sda:['걸음과 위치, 주변 혼잡도와 소음을 감지합니다.','관심사와 현재 동선을 비교해 가장 편안한 경로를 판단합니다.','빛의 방향과 진동 패턴으로 화면 없이 안내합니다.'],
  feat:[['PUI 라이트 링','방향과 상태를 빛의 흐름으로 표현합니다.'],['햅틱 패턴','알림의 중요도에 따라 다른 진동 리듬을 사용합니다.'],['글래스 모듈','반투명 모듈 안에서 MCU가 조용히 작동합니다.'],['하루 배터리','축제가 끝날 때까지 충전 없이 사용합니다.']]},
 {n:2,name:'글래스 스테이지 라이트',place:'메인 스테이지',cat:'space',kind:'light',b:[560,140,260,200,150],
  one:'관객의 반응을 읽어 무대 조명의 색과 밝기를 스스로 조절합니다.',
  problem:'무대 조명은 미리 정해진 큐에 따라 움직여, 관객의 실제 분위기와 컨디션을 반영하지 못합니다.',
  points:['관객 반응에 맞춘 조명','눈부심 없는 밝기','공연 흐름과 연동'],
  steps:[['분위기 읽기','관객석의 소리와 움직임으로 지금의 열기를 읽습니다.'],['색 바꾸기','분위기에 맞춰 파스텔 톤의 빛이 천천히 변합니다.'],['밝기 맞추기','가까운 관객의 눈부심을 줄이도록 밝기를 조절합니다.'],['함께 마무리','공연의 끝에서 모두의 빛이 하나로 이어집니다.']],
  sda:['관객석의 소리 크기와 움직임의 리듬을 감지합니다.','곡의 흐름과 관객의 반응을 비교해 어울리는 빛을 판단합니다.','색, 밝기, 확산 각도를 부드럽게 바꿉니다.'],
  feat:[['글래스 돔','빛을 부드럽게 퍼뜨리는 반투명 돔 구조입니다.'],['반응형 색 온도','분위기에 맞춰 색 온도가 자연스럽게 변합니다.'],['눈부심 보호','관객과의 거리에 따라 밝기를 낮춥니다.'],['무대 연동','음향 콘솔과 연결되어 공연 흐름을 따릅니다.']]},
 {n:3,name:'쉼 포드',place:'휴식 정원',cat:'space',kind:'pod',b:[130,560,180,170,72],
  one:'주변 소음과 체온을 감지해, 지금 쉬어 가기 좋은 자리를 만들어 줍니다.',
  problem:'오래 서 있거나 시끄러운 공간에 지친 사람들이 잠시 쉴 곳을 찾기 어렵습니다.',
  points:['소음을 줄여 주는 공간','체온에 맞춘 온도','빈자리 알림'],
  steps:[['빈자리 확인','가까운 포드의 빈자리가 빛으로 표시됩니다.'],['조용히 앉기','포드에 앉으면 주변 소음이 부드럽게 줄어듭니다.'],['온도 맞춤','체온에 맞춰 바람과 온기가 조절됩니다.'],['다시 축제로','충분히 쉬면 다음 공연 시간을 알려줍니다.']],
  sda:['주변 소음, 기온, 앉아 있는 사람의 체온을 감지합니다.','쉬는 사람의 상태와 주변 환경을 비교해 필요한 조절을 판단합니다.','차음, 조명, 공기 흐름을 조절해 편안한 자리를 만듭니다.'],
  feat:[['돔 셸','소리를 흡수하는 반투명 셸 구조입니다.'],['무드 라이트','휴식에 맞춘 은은한 빛을 냅니다.'],['온도 조절','좌석과 공기의 온도를 함께 조절합니다.'],['점유 표시','빈자리 여부를 바깥에서도 알 수 있습니다.']]},
 {n:4,name:'푸드 큐 사인',place:'푸드 스트리트',cat:'operator',kind:'sign',b:[420,420,120,230,62],
  one:'대기 줄을 분석해 지금 가장 빨리 먹을 수 있는 부스를 알려줍니다.',
  problem:'인기 부스 앞에는 긴 줄이, 다른 부스는 한산한 불균형이 생겨 방문객과 운영자 모두 지칩니다.',
  points:['실시간 대기 시간','붐비지 않는 부스 추천','운영자 알림'],
  steps:[['줄 읽기','부스 앞 대기 인원과 속도를 읽습니다.'],['시간 표시','예상 대기 시간이 사인에 표시됩니다.'],['대안 추천','가까운 덜 붐비는 부스를 함께 보여줍니다.'],['운영 조율','운영자에게 인력 배치 제안이 전달됩니다.']],
  sda:['부스 앞 대기 인원과 줄이 줄어드는 속도를 감지합니다.','주변 부스와 비교해 동선이 고르게 나뉠 방법을 판단합니다.','사인 표시와 운영자 알림으로 흐름을 분산시킵니다.'],
  feat:[['글래스 패널','멀리서도 읽기 쉬운 반투명 디스플레이입니다.'],['대기 바','대기 시간을 막대의 길이로 직관적으로 보여줍니다.'],['방향 표시','추천 부스 방향을 빛으로 가리킵니다.'],['운영 연동','운영 스테이션과 실시간으로 연결됩니다.']]},
 {n:5,name:'분실물 비컨',place:'라운지',cat:'personal',kind:'beacon',b:[640,470,120,120,110],
  one:'소중한 물건에 붙여 두면, 멀어지는 순간 부드럽게 알려줍니다.',
  problem:'붐비는 축제에서 지갑, 카드, 소지품을 잃어버리면 찾기 어렵고 하루의 경험이 망가집니다.',
  points:['멀어지면 알림','마지막 위치 기억','분실물 센터 연결'],
  steps:[['붙이기','작은 비컨을 소지품에 붙입니다.'],['거리 감지','물건과 멀어지면 손목에 진동이 전해집니다.'],['위치 확인','마지막으로 머문 위치를 빛으로 안내받습니다.'],['돌려받기','누군가 발견하면 분실물 센터로 연결됩니다.']],
  sda:['소유자와 물건 사이의 거리와 움직임을 감지합니다.','일시적으로 내려놓은 것인지, 잃어버린 것인지 판단합니다.','진동과 빛으로 알리고 필요하면 분실물 센터에 연결합니다.'],
  feat:[['페블 셰이프','손에 쥐기 좋은 조약돌 형태입니다.'],['라이트 링','상태를 빛의 색으로 보여줍니다.'],['저전력 MCU','작은 배터리로 축제 기간 내내 작동합니다.'],['프라이버시','위치 정보는 소유자에게만 공유됩니다.']]},
 {n:6,name:'운영 관제 스테이션',place:'컨트롤 타워',cat:'operator',kind:'station',b:[700,700,140,140,200],
  one:'축제 전체의 흐름을 살피고, 운영자에게 필요한 대응을 먼저 제안합니다.',
  problem:'운영자는 넓은 축제장을 한눈에 볼 수 없어, 혼잡이나 안전 문제를 늦게 알아차리기 쉽습니다.',
  points:['한눈에 보는 축제 흐름','위험 상황 조기 감지','대응 제안'],
  steps:[['흐름 보기','축제 전체의 혼잡도와 분위기를 한 화면에 모읍니다.'],['조짐 찾기','평소와 다른 패턴을 먼저 발견합니다.'],['대응 제안','인력 배치와 동선 조정을 제안합니다.'],['함께 결정','최종 결정은 운영자가 내리고, 시스템이 실행을 돕습니다.']],
  sda:['각 구역 센서와 제품에서 들어오는 신호를 모읍니다.','전체 흐름 속에서 위험과 불편의 조짐을 판단합니다.','운영자에게 우선순위가 정리된 대응안을 제안합니다.'],
  feat:[['타워 폼','축제장 어디서나 보이는 원통형 구조입니다.'],['상태 링','축제 전체 상태를 상단 링의 빛으로 표현합니다.'],['운영 대시보드','운영자 기기와 실시간으로 연결됩니다.'],['사람 중심 결정','AI는 제안하고, 결정은 사람이 합니다.']]},
];
const DECOR=[[380,180,60,60,34],[440,180,40,60,26],[330,330,70,50,30],[860,400,70,90,40],[880,560,60,60,28],[520,760,90,70,36],[360,820,60,50,26],[620,880,60,40,22],[840,260,50,50,30],[120,380,70,60,30]];
const TREES=[[110,130],[360,120],[880,120],[930,190],[80,470],[350,470],[560,380],[600,660],[460,900],[300,720],[930,640],[640,960],[860,880],[120,860],[250,940],[960,420]];

const WORLD_ART = ["<img class=\"world-art\" src=\"assets/images/team-hero.webp\" alt=\"파스텔빛 대학 축제 입구\" decoding=\"async\">", "<img class=\"world-art\" src=\"assets/images/team-environment-01.webp\" alt=\"축제 부스에 적용된 소형 AI 모듈\" decoding=\"async\">", "<img class=\"world-art\" src=\"assets/images/team-environment-02.webp\" alt=\"주변 상황을 감지하는 캠퍼스 공간\" decoding=\"async\">", "<img class=\"world-art\" src=\"assets/images/team-environment-03.webp\" alt=\"개인 AI와 소통하는 축제 방문객\" decoding=\"async\">", "<img class=\"world-art\" src=\"assets/images/team-environment-04.webp\" alt=\"AI 단말을 활용해 협력하는 방문객과 운영자\" decoding=\"async\">", "<img class=\"world-art\" src=\"assets/images/team-environment-05.webp\" alt=\"축제 광장을 걷는 학생들\" decoding=\"async\">"];
/* ======================= INTRO ======================= */
const title='College Festival ';
const h1=$('#heroTitle');
let ci=0;
h1.innerHTML=[...title].map(c=>c===' '?' ':`<span class="ch" style="animation-delay:${(.15+ci++*.035).toFixed(3)}s">${c}</span>`).join('')+
  `<span class="ch grad-text" style="animation-delay:${(.15+ci*.035+.08).toFixed(3)}s">2031</span>`;
h1.querySelectorAll('.ch').forEach(s=>s.setAttribute('aria-hidden','true'));
$('#portalScene').innerHTML=WORLD_ART[0];
$('#wcScene').innerHTML=WORLD_ART[5];

const intro={el:$('#intro'),p:0,t:0};
const portal=$('#portal'),pScene=$('#portalScene'),halo=$('#halo'),pLabel=$('#portalLabel'),rings=$('#rings'),
  ghost=$('#ghost'),iTitle=$('#introTitle'),flash=$('#flash'),veil=$('#veil'),hint=$('#scrollHint'),persp=$('#persp');
hint.addEventListener('animationend',()=>{hint.classList.remove('fade-up');hint.style.opacity=(1-range(intro.p,0,.05)).toFixed(3)});
const copyEls=[...$('#introCopy > div').children];
persp.innerHTML=[0,1,2,3,4,5,6,7].map(i=>`<line stroke="${['#B8B6E5','#9CC8E2','#E8B0DD','#B8B6E5'][i%4]}" stroke-width="${i<4?1.4:.8}" opacity="${i<4?.9:.55}"/>`).join('');
const pLines=[...persp.children];

function renderIntro(p){
  const t1=range(p,0,.26), t2=range(p,.26,.64), t3=range(p,.64,.8), t4=range(p,.8,.95);
  const k=Math.min(1,Math.min(VW,VH)/900);
  const r1=150*k, r2=Math.min(VW,VH)*.33, r3=Math.hypot(VW,VH)/2+40;
  let r = t2<=0 ? lerp(0,r1,eOut(t1)) : t3<=0 ? lerp(r1,r2,eIO(t2)) : lerp(r2,r3,eIn(t3));
  if(reduce) r = p<.05?0:p<.64?r2:lerp(r2,r3,t3);
  portal.style.clipPath=`circle(${r.toFixed(1)}px at 50% 50%)`;
  pScene.style.transform=`scale(${(t3>0?lerp(1.12,1,eOut(t3)):lerp(1.3,1.12,eIO(t2))).toFixed(4)})`;
  const hs=2*r; halo.style.width=halo.style.height=hs+'px';
  halo.style.opacity=(clamp(t1*3)*(1-t3)).toFixed(3);
  pLabel.style.opacity=(range(p,.12,.24)*(1-range(p,.42,.54))).toFixed(3);pLabel.style.top=(VH/2+r+34)+'px';
  // title
  const tt=eOut(t1);
  iTitle.style.transform=`scale(${1+.15*tt})`; iTitle.style.opacity=(1-range(p,0,.18)).toFixed(3);
  iTitle.style.filter=`blur(${(8*range(p,0,.18)).toFixed(2)}px)`;
  iTitle.style.visibility=p>.2?'hidden':'visible';
  // ghost
  const gIn=range(p,.1,.26), gOut=range(p,.36,.6);
  ghost.style.opacity=(.85*gIn*(1-gOut)).toFixed(3);
  ghost.style.transform=`translateY(${(-20*gOut).toFixed(1)}px) scale(${(1-.18*gOut).toFixed(3)})`;
  // rings + lines
  const ro=eOut(t1)*(1-t3);
  rings.style.opacity=ro.toFixed(3);
  rings.style.transform=`scale(${((r1?Math.max(r,r1*.6):1)/150*.9+t3*1.5).toFixed(3)}) rotate(${(p*120).toFixed(1)}deg)`;
  const cx=VW/2, cy=VH/2, corners=[[0,0],[VW,0],[0,VH],[VW,VH],[VW*.25,0],[VW*.75,0],[VW*.25,VH],[VW*.75,VH]];
  const inner=Math.max(r*1.18,40);
  pLines.forEach((l,i)=>{const [x,y]=corners[i];const a=Math.atan2(y-cy,x-cx);
    const reach=lerp(.0,1,eOut(range(p,.04+i*.012,.3)));
    const ex=cx+Math.cos(a)*inner, ey=cy+Math.sin(a)*inner;
    l.setAttribute('x1',x);l.setAttribute('y1',y);l.setAttribute('x2',lerp(x,ex,reach).toFixed(1));l.setAttribute('y2',lerp(y,ey,reach).toFixed(1));});
  persp.style.opacity=(1-t3).toFixed(3);
  persp.setAttribute('viewBox',`0 0 ${VW} ${VH}`);
  // flash + veil + copy
  flash.style.opacity=reduce?0:(.45*bump(range(p,.7,.86))).toFixed(3);
  veil.style.opacity=range(p,.76,.88).toFixed(3);
  copyEls.forEach((el,i)=>{const c=eOut(range(p,.8+i*.035,.9+i*.035));el.style.opacity=c.toFixed(3);el.style.transform=`translateY(${(24*(1-c)).toFixed(1)}px)`;el.style.filter=`blur(${(6*(1-c)).toFixed(2)}px)`});
  hint.style.opacity=(1-range(p,0,.05)).toFixed(3);
  particles.level=(eOut(t1)*(1-t3*.2))*(p<.8?1:0); particles.r=r; particles.burst=t3>0&&t3<1?1:0;
}

/* particles */
const cvs=$('#particles'), ctx=cvs.getContext('2d');
const particles={list:[],level:0,r:0,burst:0};
const PCOL=['156,200,226','184,182,229','232,176,221','248,202,167','255,255,255'];
function sizeCanvas(){const d=Math.min(devicePixelRatio||1,2);cvs.width=VW*d;cvs.height=VH*d;ctx.setTransform(d,0,0,d,0,0)}
let lastScrollY=scrollY, scrollVel=0;
function tickParticles(){
  if(reduce)return;
  const L=particles.list, cx=VW/2, cy=VH/2;
  const spawn=particles.level*(1.2+Math.min(scrollVel,40)*.12)+particles.burst*6;
  for(let i=0;i<spawn;i++){ if(Math.random()>spawn-i && i>=Math.floor(spawn)) break;
    const a=Math.random()*Math.PI*2, rr=Math.max(particles.r,30)*(.95+Math.random()*.15);
    L.push({x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr,vx:Math.cos(a)*(.6+Math.random()*1.8),vy:Math.sin(a)*(.6+Math.random()*1.8)-.15,s:1.5+Math.random()*4.5,life:1,d:.006+Math.random()*.01,c:PCOL[(Math.random()*5)|0],rect:Math.random()<.35,rot:Math.random()*6});
  }
  if(L.length>420)L.splice(0,L.length-420);
  ctx.clearRect(0,0,VW,VH);
  for(let i=L.length-1;i>=0;i--){const q=L[i];q.x+=q.vx*(1+scrollVel*.04);q.y+=q.vy*(1+scrollVel*.04);q.vx*=1.004;q.vy*=1.004;q.life-=q.d;q.rot+=.05;
    if(q.life<=0){L.splice(i,1);continue}
    ctx.globalAlpha=Math.min(1,q.life*1.4)*.9;ctx.fillStyle=`rgb(${q.c})`;
    if(q.rect){ctx.save();ctx.translate(q.x,q.y);ctx.rotate(q.rot);ctx.fillRect(-q.s,-q.s*.45,q.s*2,q.s*.9);ctx.restore()}
    else{ctx.beginPath();ctx.arc(q.x,q.y,q.s,0,Math.PI*2);ctx.fill()}
  }
  ctx.globalAlpha=1;
}

/* ======================= WORLD A ======================= */
const stack=$('#stack'), chList=$('#chapters');
CHAPTERS.forEach((c,i)=>{
  stack.insertAdjacentHTML('beforeend',`<article class="wcard" aria-hidden="${i?'true':'false'}"><div class="img">${WORLD_ART[i+1]}</div><div class="txt"><small>${c.k}</small><h3>${c.t}</h3><p>${c.d}</p></div></article>`);
  chList.insertAdjacentHTML('beforeend',`<li><button data-ch="${i}"><em>${c.k}</em><b>${c.t}</b></button></li>`);
});
const wcards=$$('.wcard'), chBtns=$$('#chapters button'), counter=$('#counter'), wvbar=$('#wvbar');
const worldA={el:$('#world-a'),p:0,t:0,act:-1};
const waHead=$('#waHead'), waCopy=$('#waCopy'), waDeck=$('#waDeck'), waProg=$('#waProg');
CHAPTERS.forEach((c,i)=>{
  waCopy.insertAdjacentHTML('beforeend',`<div class="wa-c" aria-hidden="${i?'true':'false'}"><b class="wa-num" aria-hidden="true">0${i+1}</b><small>${c.k}</small><h3>${c.t}</h3><p>${c.d}</p></div>`);
  waDeck.insertAdjacentHTML('beforeend',`<div class="wa-card">${WORLD_ART[i+1]}<span class="wa-chip">${c.k}</span></div>`);
  waProg.insertAdjacentHTML('beforeend',`<button data-wch="${i}" aria-label="${c.k} ${c.t}">${WORLD_ART[i+1]}<span>${c.k}</span></button>`);
});
$$('#waProg .world-art').forEach(im=>{im.alt='';im.loading='lazy'});
const waCs=$$('.wa-c'), waCards=$$('.wa-card'), waBtns=$$('#waProg button');
// scattered (intro) poses: [x%, y%, zpx, rotY, rotZ, scale]
const WA_SC=[[-34,-40,-300,22,-8,.6],[40,-50,-560,-12,7,.5],[-52,44,-420,16,9,.52],[44,42,-180,-18,-6,.62]];
const WA_SCM=[[-26,-20,-260,16,-6,.6],[30,-26,-420,-10,6,.52],[-30,30,-360,12,7,.52],[28,26,-160,-12,-5,.62]];
function renderWorldA(p){
  const s=clamp((p-.24)/.62)*3, act=Math.min(3,Math.round(s));
  if(act!==worldA.act){worldA.act=act;waBtns.forEach((b,i)=>b.classList.toggle('on',i===act));waCs.forEach((c,i)=>c.setAttribute('aria-hidden',i===act?'false':'true'));chBtns.forEach((b,i)=>b.classList.toggle('on',i===act))}
  waProg.classList.toggle('show',p>.2&&p<.99);
}
function tickWorld(now){
  const el=worldA.el,top=el.offsetTop; if(scrollY+VH<top-10||scrollY>top+el.offsetHeight)return;
  const p=worldA.p, t=now/1000, mob=VW<700, g=eIO(range(p,.1,.22)), s=clamp((p-.24)/.62)*3;
  // heading: big statement → small header (desktop) / fades (mobile)
  const H=waHead.offsetHeight;
  if(mob){waHead.style.opacity=(1-g).toFixed(3);waHead.style.transform=`translateY(${(-H/2-g*40).toFixed(1)}px)`;}
  else{waHead.style.opacity=(1-.15*g).toFixed(3);waHead.style.transform=`translateY(${lerp(-H/2,92-VH/2,g).toFixed(1)}px) scale(${lerp(1,.42,g).toFixed(4)})`;}
  // copy per chapter
  waCs.forEach((c,k)=>{const d=s-k,ad=Math.abs(d),o=clamp(1-ad*2.4)*g;
    c.style.opacity=o.toFixed(3);
    c.style.transform=`translateY(calc(${mob?'0%':'-50%'} + ${(-d*50).toFixed(1)}px))`;
    c.style.filter=ad>.004?`blur(${Math.min(10,ad*16).toFixed(2)}px)`:'none'});
  // deck
  const SC=mob?WA_SCM:WA_SC, tx=tilt.x, ty=tilt.y;
  waDeck.style.transform=`rotateX(${(-ty*6).toFixed(2)}deg) rotateY(${(tx*8).toFixed(2)}deg)`;
  waCards.forEach((c,k)=>{
    const d=k-s; let x,y,z,rx=0,ry,rz,sc,o,br;
    if(d<0){const a=clamp(-d);x=a*28;y=-a*42;z=-a*120;rx=a*22;ry=-a*18;rz=a*9;sc=1-.08*a;o=1-a;br=1}
    else{x=d*7;y=-d*6.5;z=-d*150;ry=-d*4;rz=d*2.4;sc=1;o=d<=2.2?1:clamp(3.2-d);br=1-.1*Math.min(d,3)}
    if(g<1){const q=SC[k],w=1-g,wob=Math.sin(t*.9+k*1.7)*2.2*w;
      x=lerp(q[0],x,g);y=lerp(q[1],y,g)+wob;z=lerp(q[2],z,g);ry=lerp(q[3],ry,g);rz=lerp(q[4],rz,g)+Math.cos(t*.7+k)*1.4*w;sc=lerp(q[5],sc,g);o=lerp(1,o,g);br=lerp(1,br,g)}
    c.style.transform=`translate(${x.toFixed(2)}%,${y.toFixed(2)}%) translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    c.style.opacity=o.toFixed(3); c.style.filter=br<.995?`brightness(${br.toFixed(3)})`:'none';
    c.style.zIndex=d<0&&g>=1?20:Math.round(30+z/40);
  });
}
waBtns.forEach(b=>b.addEventListener('click',()=>scrollToY(holdY('world-a',+b.dataset.wch+1))));
chBtns.forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.ch;const el=worldA.el;const top=el.offsetTop, h=el.offsetHeight-VH;scrollToY(holdY('world-a',i+1))}));

/* ======================= WORLD C ======================= */
const worldC={el:$('#world-c'),p:0,t:0};
const wcEls=[0,1,2,3,4,5,6].map(i=>$('#wc'+i)), wcScene=$('#wcScene'), wcbar=$('#wcbar');
const wcWho=$('#world-c .who'), wcDim=$('#wcDim');
function renderWorldC(p){
  wcScene.style.transform=`scale(${(1.14-.14*p).toFixed(4)})`;
  const st=[[.0,.12],[.04,.18],[.12,.26]], up=eIO(range(p,.42,.56)), whoH=wcWho.offsetHeight+48;
  [0,1,2].forEach(i=>{const el=wcEls[i],c=eOut(range(p,...st[i]));el.style.opacity=c.toFixed(3);
    el.style.transform=`translateY(${(24*(1-c)+(1-up)*whoH/2).toFixed(1)}px)`;el.style.filter=c<.998?`blur(${(8*(1-c)).toFixed(2)}px)`:'none'});
  [3,4,5].forEach((i,k)=>{const el=wcEls[i],c=eOut(range(p,.5+k*.05,.64+k*.05));el.style.opacity=c.toFixed(3);
    el.style.transform=`translateY(${(40*(1-c)).toFixed(1)}px)`;el.style.filter=c<.998?`blur(${(8*(1-c)).toFixed(2)}px)`:'none'});
  wcDim.style.opacity=(.82+.18*up).toFixed(3);
  wcbar.style.width=(range(p,.6,.97)*100).toFixed(2)+'%';
}

/* ======================= SYSTEM ======================= */
const nodesEl=$('#nodes'), sysDesc=$('#sysDesc');
SYS.forEach((s,i)=>{
  nodesEl.insertAdjacentHTML('beforeend',`<div class="node" style="left:${(12+38*i)}%">${s.ic}<small>${s.k}</small><b>${s.t}</b></div>`);
  sysDesc.insertAdjacentHTML('beforeend',`<div><h3>${s.h}</h3><p>${s.p}</p><div class="chips">${s.c.map(x=>`<span>${x}</span>`).join('')}</div></div>`);
});
const nodes=$$('.node'), descs=[...sysDesc.children], lb=$('#linkBase'), lf=$('#linkFill');
const system={el:$('#system'),p:0,t:0};
function layoutLink(){const w=nodesEl.clientWidth,h=nodesEl.clientHeight;const x1=w*.12,x2=w*.88,y=h/2;
  for(const l of [lb,lf]){l.setAttribute('x1',x1);l.setAttribute('x2',x2);l.setAttribute('y1',y);l.setAttribute('y2',y)}
  const len=x2-x1;lf.setAttribute('stroke-dasharray',len);lf.dataset.len=len;}
function renderSystem(p){
  const lp=range(p,.12,.78); const len=+lf.dataset.len||1;
  lf.setAttribute('stroke-dashoffset',(len*(1-lp)).toFixed(1));
  const act= lp<.33?0: lp<.82?1:2;
  const exit=range(p,.9,1);
  nodes.forEach((n,i)=>{const g=clamp(1-Math.abs(lp*2-i)*1.4)*(1-exit);n.style.setProperty('--g',g.toFixed(3));n.classList.toggle('on',i===act);
    n.style.transform=`translateY(${(-10*g).toFixed(1)}px) scale(${(1+.08*g-.25*exit).toFixed(3)})`;n.style.opacity=(1-exit*.7).toFixed(3)});
  descs.forEach((d,i)=>{const on=i===act?1:0;d.style.opacity=on*(1-exit);d.style.transform=`translateY(${on?0:12}px)`;d.style.transition='opacity .6s var(--ease),transform .6s var(--ease)'});
}

/* ======================= MAP (CSS 3D) ======================= */
const world=$('#mapWorld'), mstage=$('#mapStage');
const map={rot:-38,tilt:56,zoom:1,base:1,tx:0,ty:0, cur:{rot:-38,tilt:56,zoom:1,tx:0,ty:0}, sel:null, hover:null};
function box(x,y,w,d,h,cls=''){
  return `<div class="shadow" style="left:${x+8}px;top:${y+10}px;width:${w+h*.35}px;height:${d+h*.25}px"></div>
<div class="bx ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${d}px">
<div class="face n" style="width:${w}px;height:${h}px;transform:translate3d(0,0,${h}px) rotateX(-90deg)"></div>
<div class="face w" style="width:${h}px;height:${d}px;transform:translate3d(0,0,${h}px) rotateY(90deg)"></div>
<div class="face s" style="width:${w}px;height:${h}px;transform:translate3d(0,${d}px,${h}px) rotateX(-90deg)">${cls.includes('prod')?`<div class="win" style="left:${w*.18}px;top:${h*.3}px;width:${w*.64}px;height:${Math.max(8,h*.22)}px"></div>`:''}</div>
<div class="face e" style="width:${h}px;height:${d}px;transform:translate3d(${w}px,0,${h}px) rotateY(90deg)">${cls.includes('prod')?`<div class="win" style="left:${h*.3}px;top:${d*.2}px;width:${Math.max(8,h*.22)}px;height:${d*.6}px"></div>`:''}</div>
<div class="face t" style="width:${w}px;height:${d}px;transform:translateZ(${h}px)"></div></div>`;
}
let mh=`<div class="ground"></div>
<div class="road" style="left:60px;top:470px;width:880px;height:46px"></div>
<div class="road" style="left:470px;top:60px;width:46px;height:880px"></div>
<div class="road" style="left:150px;top:380px;width:300px;height:30px;background:#F3F0FA"></div>
<div class="lawn" style="left:90px;top:520px;width:260px;height:260px"></div>
<div class="lawn" style="left:600px;top:110px;width:320px;height:260px;background:radial-gradient(circle,#F9EAF4,#F3E2EF)"></div>`;
DECOR.forEach(b=>mh+=box(...b));
PRODUCTS.forEach(p=>{const [x,y,w,d,h]=p.b;mh+=box(x,y,w,d,h,'prod p'+p.n)});
TREES.forEach(([x,y],i)=>{const s=18+(i*7)%16;mh+=`<div class="tree" style="left:${x}px;top:${y}px;--h:${s}"><i style="width:${s*2}px;height:${s*2}px"></i></div>`});
PRODUCTS.forEach(p=>{const [x,y,w,d,h]=p.b;mh+=`<div class="pin" data-n="${p.n}" style="left:${x+w/2}px;top:${y+d/2}px;--h:${h}" tabindex="0" role="button" aria-label="${p.n}번 ${p.name}, ${p.place}"><div class="pi"><span class="tip">${p.place} · ${p.name}</span><span class="head">${p.n}</span><span class="stem"></span></div></div>`});
world.innerHTML=mh;
const pins=$$('.pin'), trees=$$('.tree');
function fitMap(){const w=mstage.clientWidth,h=mstage.clientHeight;map.base=Math.min(w/1350,h/950)*(w<700?1.3:1);}
function applyMap(){
  const c=map.cur, s=map.base*c.zoom;
  world.style.transform=`scale(${s.toFixed(4)}) rotateX(${c.tilt.toFixed(2)}deg) rotateZ(${c.rot.toFixed(2)}deg) translate3d(${c.tx.toFixed(1)}px,${c.ty.toFixed(1)}px,0)`;
  const bb=`rotateZ(${(-c.rot).toFixed(2)}deg) rotateX(${(-c.tilt).toFixed(2)}deg)`;
  pins.forEach(p=>p.style.transform=`translate3d(0,0,${(+p.style.getPropertyValue('--h')+4)}px) ${bb} translate(-50%,-100%)`);
  trees.forEach(t=>{const s=+t.style.getPropertyValue('--h');t.style.transform=`translate3d(0,0,${s*.9}px) ${bb} translate(-50%,-60%)`});
}
function tickMap(){
  const c=map.cur;let moving=false;
  for(const k of ['rot','tilt','zoom','tx','ty']){const d=map[k]-c[k];if(Math.abs(d)>.0005){c[k]+=d*.12;moving=true}else c[k]=map[k]}
  if(moving||map.dirty){applyMap();map.dirty=false}
}
// drag
let drag=null;
mstage.addEventListener('pointerdown',e=>{if(e.target.closest('.pin'))return;drag={x:e.clientX,y:e.clientY,r:map.rot,t:map.tilt,moved:false};mstage.setPointerCapture(e.pointerId)});
mstage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>4){drag.moved=true;mstage.classList.add('drag')}
  map.rot=drag.r+dx*.3; map.tilt=clamp(drag.t-dy*.18,30,72)});
const endDrag=e=>{if(!drag)return;const wasMoved=drag.moved;drag=null;mstage.classList.remove('drag');if(!wasMoved&&map.sel)closeCard()};
mstage.addEventListener('pointerup',endDrag);mstage.addEventListener('pointercancel',endDrag);
mstage.addEventListener('wheel',e=>{if(!(e.ctrlKey||e.metaKey))return;e.preventDefault();map.zoom=clamp(map.zoom*Math.exp(-e.deltaY*.004),.6,2.2)},{passive:false});
$('#zIn').onclick=()=>map.zoom=clamp(map.zoom*1.2,.6,2.2);
$('#zOut').onclick=()=>map.zoom=clamp(map.zoom/1.2,.6,2.2);
$('#zReset').onclick=()=>{map.rot=-38;map.tilt=56;map.zoom=1;map.tx=0;map.ty=0;closeCard()};
// hover + select
function setHL(n){$$('.bx.prod').forEach(b=>b.classList.toggle('hl',b.classList.contains('p'+n)));pins.forEach(p=>p.classList.toggle('hl',+p.dataset.n===n));world.classList.toggle('focus',!!n)}
pins.forEach(p=>{const n=+p.dataset.n;
  p.addEventListener('pointerenter',()=>{if(!map.sel)setHL(n)});
  p.addEventListener('pointerleave',()=>{if(!map.sel)setHL(0)});
  p.addEventListener('click',e=>{e.stopPropagation();openCard(n)});
  p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCard(n)}});
});
const pcard=$('#pcard'), warpMap=$('#warpMap');
function warp(from=46,dur=900){if(reduce)return;mstage.classList.add('warp');const t0=performance.now();
  (function f(t){const k=clamp((t-t0)/dur);warpMap.setAttribute('scale',(from*(1-eOut(k))).toFixed(2));if(k<1)requestAnimationFrame(f);else mstage.classList.remove('warp')})(t0)}
function openCard(n){
  const p=PRODUCTS[n-1]; map.sel=n; setHL(n);
  const [x,y,w,d]=p.b; map.tx=-(x+w/2-500); map.ty=-(y+d/2-500); map.zoom=Math.max(map.zoom,1.25);
  $('#pcVis').innerHTML=prodSVG(p.kind); $('#pcLabel').textContent=`PROJECT 0${p.n} · ${CAT[p.cat]} · ${p.place}`;
  $('#pcName').textContent=p.name; $('#pcOne').textContent=p.one;
  pcard.classList.remove('open'); void pcard.offsetWidth; pcard.classList.add('open'); warp();
}
function closeCard(){map.sel=null;pcard.classList.remove('open');setHL(0);map.tx=0;map.ty=0;map.zoom=Math.min(map.zoom,1)}
$('#pcardX').onclick=closeCard;
pcard.addEventListener('pointerdown',e=>e.stopPropagation());
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(lbx.classList.contains('open'))closeLB();else if(detail.classList.contains('open'))closeDetail();else if(map.sel)closeCard()}});
// filters
$$('#filters button').forEach(b=>b.onclick=()=>{$$('#filters button').forEach(x=>{x.classList.toggle('on',x===b);x.setAttribute('aria-selected',x===b)});
  const f=b.dataset.f; pins.forEach(p=>p.classList.toggle('off',f!=='all'&&PRODUCTS[p.dataset.n-1].cat!==f));
  if(map.sel&&f!=='all'&&PRODUCTS[map.sel-1].cat!==f)closeCard();});

/* ======================= DETAIL ======================= */
const detail=$('#detail'), dBody=$('#dBody');
let dState=null;
const TILE_BG=[['#E4EEF8','#EDE7F8'],['#F3E6F4','#FBEBE1'],['#E8E6F8','#F7E5F1'],['#E3F0F3','#EEE7F7']];
function buildDetail(p){
  const i=p.n-1;
  dBody.innerHTML=`
<section class="d-hero" id="d-hero">
  <div class="orb a" style="width:460px;height:460px;left:-120px;top:-100px"></div>
  <div class="orb c" style="width:420px;height:420px;right:-80px;bottom:-120px"></div>
  <div class="prod" id="dProd">${prodSVG(p.kind)}</div>
  <div class="d-panel"><span class="label">HERO · PROJECT 0${p.n} · ${CAT[p.cat]}</span><h1>${p.name}</h1><p>${p.one}</p></div>
  <div class="d-next"><button class="btn" data-next>다른 제품 보기 <span class="arr">→</span></button></div>
</section>
<nav class="d-tabs" id="dTabs" aria-label="상세 섹션">${['HERO','OVERVIEW','EXPERIENCE','AI FUNCTION','DESIGN','GALLERY'].map((t,k)=>`<a href="#" data-t="d-${['hero','ov','ex','ai','ds','ga'][k]}">${t}</a>`).join('')}</nav>
<section class="d-sec" id="d-ov"><div class="ov">
  <div><span class="label reveal">OVERVIEW</span><h2 class="h-main reveal">제품이 해결하는 문제</h2><p class="body reveal">${p.problem}</p><ul class="reveal">${p.points.map(x=>`<li>${x}</li>`).join('')}</ul></div>
  <div class="img reveal">${scene({pal:['dusk','day','lav','peach'][i%4],seed:40+i,crowd:70,orbs:2,motif:'waves',fade:.3,alt:p.place+' 풍경'})}</div>
</div></section>
<section class="d-sec" id="d-ex">
  <div class="steps-head"><div><span class="label reveal">EXPERIENCE</span><h2 class="h-main reveal">사용자가 제품을 경험하는 과정</h2></div>
  <div class="steps-nav"><button class="btn sm" data-sx="-1" aria-label="이전">←</button><button class="btn sm" data-sx="1" aria-label="다음">→</button></div></div>
  <div class="steps" id="dSteps"></div>
  <div class="story" id="dStory" style="height:${p.steps.length*90+20}vh"><div class="story-sticky">${p.steps.map((s,k)=>`<article class="story-slide"><div class="img">${scene({pal:['day','lav','peach','dusk'][k],seed:60+k+i*5,crowd:30,orbs:k===3?0:2,motif:['orb','waves','person','network'][k],fade:.3})}</div><div><small>STEP 0${k+1} / 0${p.steps.length}</small><h4>${s[0]}</h4><p>${s[1]}</p></div></article>`).join('')}</div></div>
</section>
<section class="d-sec" id="d-ai"><span class="label reveal">AI FUNCTION</span><h2 class="h-main reveal">MCUAI의 감지 · 판단 · 대응 방식</h2>
  <div class="sda reveal">${p.sda.map((t,k)=>`${k?'<div class="lk"></div>':''}<div class="c"><small>0${k+1} ${SYS[k].t}</small><h4>${['감지','판단','대응'][k]}</h4><p>${t}</p></div>`).join('')}</div></section>
<section class="d-sec" id="d-ds" style="padding-top:110px"><span class="label reveal">DESIGN</span><h2 class="h-main reveal">제품 형태, 인터페이스 및 주요 특징</h2>
  <div class="design-wrap" id="dDesign"><div class="design-sticky">
    <div class="design-vis"><div class="prod" id="dProd2">${prodSVG(p.kind)}</div></div>
    <ul class="feat" id="dFeat">${p.feat.map(f=>`<li><b>${f[0]}</b><span>${f[1]}</span></li>`).join('')}</ul>
  </div></div></section>
<section class="d-sec" id="d-ga" style="padding-top:40px"><span class="label reveal">GALLERY</span><h2 class="h-main reveal">3D 모델, 제품 이미지 및 사용자 시나리오</h2>
  <div class="gallery reveal">${['3D 모델','제품 이미지','사용 장면','사용자 시나리오'].map((g,k)=>`<button data-g="${k}" aria-label="${g} 크게 보기">${k<2?prodTile(p.kind,TILE_BG[k]):scene({pal:['lav','peach'][k-2],seed:80+k+i,crowd:50,orbs:2,motif:['person','network'][k-2],fade:.2})}<span>${g}</span></button>`).join('')}</div></section>
<div class="d-foot"><button class="btn back" data-back><span class="arr">←</span> 3D 지도로 돌아가기</button><button class="btn dark" data-next>다음 제품 · ${PRODUCTS[p.n%6].name} <span class="arr">→</span></button></div>`;
  dState={p,tabs:$$('#dTabs a'),secs:['d-hero','d-ov','d-ex','d-ai','d-ds','d-ga'].map(id=>$('#'+id)),prod:$('#dProd'),prod2:$('#dProd2'),design:$('#dDesign'),feats:$$('#dFeat li'),fi:-1,story:$('#dStory'),slides:$$('#dStory .story-slide')};
  dState.tabs.forEach(a=>a.onclick=e=>{e.preventDefault();const t=$('#'+a.dataset.t);detail.scrollTo({top:a.dataset.t==='d-hero'?0:t.offsetTop-64,behavior:reduce?'auto':'smooth'})});
  $$('[data-next]',dBody).forEach(b=>b.onclick=()=>switchProduct(PRODUCTS[p.n%6].n));
  $$('[data-back]',dBody).forEach(b=>b.onclick=closeDetail);
  $$('[data-sx]',dBody).forEach(b=>b.onclick=()=>$('#dSteps').scrollBy({left:+b.dataset.sx*360,behavior:'smooth'}));
  $$('.gallery button',dBody).forEach(b=>b.onclick=()=>openLB(b.querySelector('svg').parentNode.innerHTML.replace(/<span>.*<\/span>/,'')));
  // drag scroll for steps
  const st=$('#dSteps');let sd=null;
  st.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;sd={x:e.clientX,l:st.scrollLeft};st.style.scrollSnapType='none'});
  addEventListener('pointermove',e=>{if(sd)st.scrollLeft=sd.l-(e.clientX-sd.x)});
  addEventListener('pointerup',()=>{if(sd){sd=null;st.style.scrollSnapType=''}});
  $$('.reveal',dBody).forEach(el=>{stagger(el);dio.observe(el)});
  detail.scrollTop=0; onDetailScroll();
}
const dio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');dio.unobserve(e.target)}}),{root:detail,threshold:.12});
function onDetailScroll(){
  if(!dState)return; const y=detail.scrollTop;
  const hp=clamp(y/(VH*.9));
  dState.prod.style.transform=`translate(-50%,-50%) translateY(${(-60*hp).toFixed(1)}px) scale(${(1-.15*hp).toFixed(3)}) rotate(${(-8*hp).toFixed(2)}deg)`;
  if(dState.story){const st=dState.story,top=st.getBoundingClientRect().top+y,n=dState.slides.length;
    const sp=clamp((y-top+64)/Math.max(1,st.offsetHeight-VH+64)), raw=sp*(n-1), fl=Math.min(n-2,Math.floor(raw)), fr=raw-fl;
    const av=n<2?0:fl+(fr<.3?0:fr>.7?1:eIO((fr-.3)/.4));
    dState.slides.forEach((sl,k)=>{const d=av-k,ad=Math.abs(d),o=clamp(1-ad*1.6);
      sl.style.opacity=o.toFixed(3); sl.style.transform=`translateY(${(-d*60).toFixed(1)}px) scale(${(1-Math.min(.06,ad*.06)).toFixed(4)})`;
      sl.style.filter=ad>.004?`blur(${Math.min(10,ad*14).toFixed(2)}px)`:'none'; sl.style.pointerEvents=o>.5?'auto':'none'});}
  let a=0; dState.secs.forEach((s,k)=>{if(s.offsetTop-140<=y)a=k}); dState.tabs.forEach((t,k)=>t.classList.toggle('on',k===a));
  const d=dState.design, dp=clamp((y-d.offsetTop- d.parentNode.offsetTop+VH*.2)/(d.offsetHeight-VH*.6));
  const dpp=clamp((y-(d.getBoundingClientRect().top+y)+64)/(d.offsetHeight-VH+64));
  dState.prod2.style.transform=`rotate(${lerp(-14,14,dpp).toFixed(2)}deg) scale(${lerp(.86,1.08,eIO(dpp)).toFixed(3)})`;
  const fi=Math.min(3,Math.floor(dpp*4)); if(fi!==dState.fi){dState.fi=fi;dState.feats.forEach((f,k)=>f.classList.toggle('on',k===fi))}
}
detail.addEventListener('scroll',onDetailScroll,{passive:true});
function tween(dur,fn,done){const t0=performance.now();(function f(t){const k=clamp((t-t0)/dur);fn(k);if(k<1)requestAnimationFrame(f);else done&&done()})(t0)}
let savedY=0;
function openDetail(n){
  const p=PRODUCTS[n-1]; buildDetail(p); savedY=scrollY;
  const r=pcard.getBoundingClientRect(); const from=[r.top,VW-r.right,VH-r.bottom,r.left];
  detail.classList.add('open'); document.body.style.overflow='hidden'; warp(60,1000);
  if(reduce){detail.style.clipPath='none';detail.classList.add('ready');return}
  tween(1000,k=>{const e=eIO(k);detail.style.clipPath=`inset(${from.map(v=>(v*(1-e)).toFixed(1)+'px').join(' ')} round ${(28*(1-e)).toFixed(1)}px)`;dBody.style.transform=`scale(${(1.08-.08*eOut(k)).toFixed(4)})`;dBody.style.filter=`blur(${(10*(1-eOut(k))).toFixed(2)}px)`},()=>{dBody.style.transform='';dBody.style.filter='';detail.style.clipPath='none';detail.classList.add('ready');$('#dBack').focus({preventScroll:true})});
}
function closeDetail(){
  if(!dState)return; const n=dState.p.n; detail.classList.remove('ready');
  const finish=()=>{detail.classList.remove('open');detail.style.clipPath='';document.body.style.overflow='';dState=null;openCard(n);$$('.pin')[n-1].focus({preventScroll:true})};
  if(reduce)return finish();
  const r=pcard.getBoundingClientRect(); const to=[r.top||VH*.3,(VW-r.right)||40,(VH-r.bottom)||VH*.3,r.left||VW*.6];
  tween(700,k=>{const e=eIO(k);detail.style.clipPath=`inset(${to.map(v=>(v*e).toFixed(1)+'px').join(' ')} round ${(28*e).toFixed(1)}px)`;detail.style.opacity=(1-range(k,.6,1)).toFixed(3)},()=>{detail.style.opacity='';finish()});
}
function switchProduct(n){
  if(reduce){buildDetail(PRODUCTS[n-1]);return}
  tween(350,k=>{dBody.style.opacity=1-k;dBody.style.filter=`blur(${8*k}px)`},()=>{buildDetail(PRODUCTS[n-1]);map.sel=n;
    tween(500,k=>{dBody.style.opacity=k;dBody.style.filter=`blur(${8*(1-k)}px)`},()=>dBody.style.filter='')});
}
$('#pcGo').onclick=()=>openDetail(map.sel);
$('#dBack').onclick=closeDetail;
const lbx=$('#lightbox');
function openLB(html){$('#lbFrame').innerHTML=html;lbx.classList.add('open');$('#lbX').focus()}
function closeLB(){lbx.classList.remove('open')}
$('#lbX').onclick=closeLB; lbx.addEventListener('click',e=>{if(e.target===lbx)closeLB()});

/* ======================= NAV / SCROLL ======================= */
const nav=$('#nav'), dots=$('#dots');
const secOrder=['intro','world-a','system','projects'];
function scrollToY(y){smoothTo(y)}
function goTo(id){const el=$('#'+id); let y=HOLDS[id]?holdY(id,0):el.offsetTop; if(id==='intro')y=0; scrollToY(y)}
$$('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goTo(a.dataset.go)}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('main .reveal').forEach(el=>io.observe(el));



/* ======================= 03.5 INTERLUDE (dark turn) ======================= */
const turn={el:$('#turn'),p:0,t:0};
const tDark=$('#tDark'),tRing=$('#tRing'),tPreH=$('#tPre .t-h'),tQ=$('#tQ'),tQH=$('#tQ .t-h'),tCores=$$('#tCores .t-core'),tLenses=$$('#tCores .lens'),tDisp3=$('#tDisp3'),tTurb3=$('#tTurb3'),
      tSpace=$('#tSpace'),tDust=$('#tDust'),tDisp=$('#tDisp'),tDisp2=$('#tDisp2'),tTurb=$('#tTurb'),tTurb2=$('#tTurb2');
const tA=$('#ta1');
const tBlobs=$$('#tAurora i');
const tm={x:0,y:0,cx:0,cy:0};
addEventListener('pointermove',e=>{tm.x=e.clientX/innerWidth-.5;tm.y=e.clientY/innerHeight-.5},{passive:true});
const T_MOB=innerWidth<700;
const shards=Array.from({length:T_MOB?9:13},(_,i)=>{
  const el=document.createElement('div');el.className='shard';
  const w=(T_MOB?110:170)+((i*53)%5)*(T_MOB?16:30), h=w*(.55+((i*31)%4)*.12);
  el.style.setProperty('--w',w+'px');el.style.setProperty('--h',h.toFixed(0)+'px');
  tSpace.appendChild(el);
  const side=i%2?1:-1, ang=i*2.39996;
  const rx=(T_MOB?150:420)+((i*3)%5)*(T_MOB?18:60);
  return {el,x:side*rx,y:(T_MOB?320:280)*Math.sin(ang),z:300+i*(T_MOB?360:280),
          ry:-side*(16+(i*13)%22),rx:((i*29)%24)-12,ph:i*1.7};
});
// thought dust
const dctx=tDust.getContext('2d'); let dW=0,dH=0,dDpr=1;
const DCOL=['255,255,255','156,200,226','201,198,255','242,182,227','255,210,176'];
const dust=Array.from({length:T_MOB?170:340},(_,i)=>({x:(Math.random()-.5)*2600,y:(Math.random()-.5)*1700,z:Math.random()*5200,
  a:Math.random()*Math.PI*2,o:.55+Math.random()*.9,sp:.4+Math.random()*1.2,s:.6+Math.random()*1.8,c:DCOL[i%5],k:i%3}));
function sizeTurn(){dDpr=Math.min(devicePixelRatio||1,1.5);dW=innerWidth;dH=innerHeight;tDust.width=dW*dDpr;tDust.height=dH*dDpr}
function renderTurn(p){turn.rp=p}
function tickTurn(now){
  const el=turn.el,top=el.offsetTop,inView=scrollY+VH>top-10&&scrollY<top+el.offsetHeight+10;
  if(!inView){document.body.classList.remove('dark-zone');return}
  const p=turn.p, t=now/1000;
  tm.cx=lerp(tm.cx,tm.x,.06); tm.cy=lerp(tm.cy,tm.y,.06);
  // ---- lens: white → deep space → back to white
  
  const cyP=50-(T_MOB?20:19)*range(p,.6,.86);
  const Rmax=Math.hypot(VW/2,VH*Math.max(cyP,100-cyP)/100)+60;
  const open=eIO(range(p,.07,.25)), close=eIO(range(p,.86,.985));
  const R=Rmax*open*(1-close);
    tDark.style.clipPath=`circle(${R.toFixed(1)}px at 50% ${cyP.toFixed(2)}%)`; tRing.style.top=cyP.toFixed(2)+'%';
  const ringO=R>1&&R<Rmax-8?Math.min(1,R/80)*(1-(open>=1&&close<=0?1:0)):0;
  tRing.style.width=tRing.style.height=(R*2).toFixed(1)+'px'; tRing.style.opacity=ringO.toFixed(3);
  document.body.classList.toggle('dark-zone',R>VH*.55);
  // ---- "하지만," on white, pulled into the dark
  const a=eOut(range(p,0,.075)), up=eIO(range(p,.11,.3)), c=range(p,.09,.2), out=range(p,.45,.55);
  const col=Math.round(29+226*c);
  tPreH.style.color=`rgb(${col},${col},${Math.min(255,col+4)})`;
  tPreH.style.opacity=(a*(1-out)).toFixed(3);
  tPreH.style.transform=`translateY(${((1-a)*30-up*VH*(T_MOB?.16:.235)).toFixed(1)}px) scale(${(1-.4*up).toFixed(4)})`;
  const pw=(1-a)+c*(1-c)*4;          // optical effect only while transitioning
  tPreH.style.setProperty('--ca',(pw*10).toFixed(2)+'px'); tPreH.style.setProperty('--ca-o',Math.min(.85,pw*1.6).toFixed(3));
  if(pw>.01){tDisp2.setAttribute('scale',(60*pw).toFixed(1));tTurb2.setAttribute('baseFrequency',`${(.01+.004*Math.sin(t*.9)).toFixed(4)} ${(.04+.01*Math.cos(t*.7)).toFixed(4)}`);tPreH.style.filter='url(#tWarp2)'}
  else tPreH.style.filter='none';
  // ---- the question: warped → clear → dispersed
  const q=eOut(range(p,.2,.4)), d=eIn(range(p,.46,.6));
  tQ.style.opacity=(q*(1-d)).toFixed(3);
  const qw=(1-q)+d*1.4;
  tQH.style.transform=`translate(${(tm.cx*-8).toFixed(1)}px,${((1-q)*44+tm.cy*-6).toFixed(1)}px) scale(${(.94+.06*q+.14*d).toFixed(4)})`;
  tQH.style.letterSpacing=(-.04+.06*d).toFixed(3)+'em';
  tQH.style.setProperty('--ca',(12*(1-q)+28*d).toFixed(2)+'px'); tQH.style.setProperty('--ca-o',Math.min(.9,qw*3).toFixed(3));
  if(qw>.004){tDisp.setAttribute('scale',(70*(1-q)+140*d).toFixed(1));tTurb.setAttribute('baseFrequency',`${(.012+.003*Math.sin(t*.6)).toFixed(4)} ${(.03+.008*Math.cos(t*.8)).toFixed(4)}`);
    tQH.style.filter=`url(#tWarp) blur(${(d*9+(1-q)*4).toFixed(2)}px)`} else tQH.style.filter='none';
  // ---- camera through the glass thoughts
  const f=T_MOB?560:880;
  const camZ=-1500+3700*eIO(range(p,.06,.42))+2700*eIn(range(p,.44,.64));
  const camX=tm.cx*(T_MOB?60:140), camY=tm.cy*(T_MOB?40:90);
  for(const s of shards){
    const rel=s.z-camZ;
    if(rel<-f*.7||rel>5200){if(s.vis){s.el.style.opacity='0';s.vis=false}continue}
    const sc=f/(f+rel);
    const sx=VW/2+(s.x-camX)*sc, sy=VH/2+(s.y-camY+Math.sin(t*.8+s.ph)*14)*sc;
    const tx2=Math.abs(sx-VW/2)/(VW*(T_MOB?.5:.34)), ty2=Math.abs(sy-VH*.55)/(VH*(T_MOB?.24:.3)), keep=clamp((Math.max(tx2,ty2)-.8)/.35);
    const o=clamp(1+rel/(f*.55))*clamp((4300-rel)/1500)*(1-range(p,.6,.66))*(.04+.96*keep);
    s.el.style.opacity=o.toFixed(3); s.vis=o>0;
    s.el.style.zIndex=Math.round(10000-rel);
    s.el.style.transform=`translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0) translate(-50%,-50%) scale(${sc.toFixed(4)}) perspective(700px) rotateY(${(s.ry+Math.sin(t*.6+s.ph)*6+tm.cx*-16).toFixed(2)}deg) rotateX(${(s.rx+Math.cos(t*.5+s.ph)*5+tm.cy*12).toFixed(2)}deg)`;
    s.el.style.setProperty('--a',((t*40+s.ph*60)%360).toFixed(1)+'deg');
  }
  // ---- aurora drifts, then gathers toward the core
  const g=eIO(range(p,.5,.76));
  const GV=[[24,12],[-26,18],[-4,-26],[-20,-18]];
  tBlobs.forEach((b,i)=>{const dx=Math.sin(t*.13+i*1.9)*6+tm.cx*(8+i*4), dy=Math.cos(t*.11+i*1.3)*5+tm.cy*(8+i*4);
    b.style.transform=`translate(${(dx*(1-g)+GV[i][0]*g).toFixed(2)}vw,${(dy*(1-g)+GV[i][1]*g).toFixed(2)}vh) scale(${(1-.35*g+.06*Math.sin(t*.4+i)).toFixed(3)})`});
  // ---- three glass cores (three products)
  const cOut=eIn(range(p,.86,.98)), CC=[];
  tCores.forEach((e,i)=>{const k=eOut(range(p,.55+i*.03,.7+i*.03));
    e.style.transform=`translate(${(tm.cx*(20+i*8)).toFixed(1)}px,${(tm.cy*16+Math.sin(t*1.1+i*2)*5).toFixed(1)}px) scale(${(k*(1-.92*cOut)).toFixed(4)})`;
    e.style.opacity=(1-range(p,.95,.99)).toFixed(3);
    const r=e.getBoundingClientRect(); CC.push([r.left+r.width/2,r.top+r.height/2,r.width])});
  tLenses.forEach((l,i)=>l.style.setProperty('--a',((t*50+i*120)%360).toFixed(1)+'deg'));
  // ---- answer: warped in, crisp at rest, warped out
  const ak=eOut(range(p,.64,.77)), ao=eIn(range(p,.84,.9)), aw=(1-ak)+ao;
  tA.style.opacity=(ak*(1-ao)).toFixed(3);
  tA.style.transform=`translateY(${((1-ak)*34-ao*24).toFixed(1)}px)`;
  if(aw>.004){tDisp3.setAttribute('scale',(60*aw).toFixed(1));tTurb3.setAttribute('baseFrequency',`${(.012+.003*Math.sin(t*.7)).toFixed(4)} ${(.035+.008*Math.cos(t*.9)).toFixed(4)}`);
    tA.style.filter=`url(#tWarp3) blur(${(aw*8).toFixed(2)}px)`} else tA.style.filter='none';
  // ---- dust: scattered thoughts → orbit around the core
  const conv=eIO(range(p,.46,.72)), shrink=eIn(range(p,.86,.97));
  dctx.setTransform(dDpr,0,0,dDpr,0,0); dctx.clearRect(0,0,dW,dH); dctx.globalCompositeOperation='lighter';
  const lensK=open*(1-close); if(lensK>.01){
  for(const q2 of dust){
    let rz=((q2.z-camZ*.7)%5200+5200)%5200+40; const sc=f/(f+rz-300);
    let x=VW/2+(q2.x-camX*.6)*sc, y=VH/2+(q2.y-camY*.6)*sc, r=q2.s*Math.min(sc,3)*1.4;
    if(conv>0){const C=CC[q2.k]||[VW/2,VH*.3,100],ang=q2.a+t*.35*q2.sp, rad=C[2]*(.42+.5*(q2.o-.55))*(1-shrink*.9)+4;
      const tx=C[0]+Math.cos(ang)*rad, ty=C[1]+Math.sin(ang)*rad*.7;
      x=x+(tx-x)*conv; y=y+(ty-y)*conv; r=r*(1-conv)+q2.s*.9*conv}
    const al=Math.min(1,q2.o*(conv>0?1:clamp(sc*1.4)))*lensK*(1-range(p,.95,.99));
    if(al<.02||x<-20||x>VW+20||y<-20||y>VH+20)continue;
    dctx.fillStyle=`rgba(${q2.c},${al.toFixed(3)})`; dctx.beginPath(); dctx.arc(x,y,Math.max(.4,r),0,6.283); dctx.fill();
  }}
}


/* ======================= SYSTEM v4 · scene demo ======================= */
const s2Main=$('#s2Main'), s2Wrap=$('#s2SceneWrap'), s2Text=$('#s2Text'), s2Steps=$('#s2Steps'), s2Svg=$('#s2Svg');
SYS.forEach((s,i)=>{
  s2Text.insertAdjacentHTML('beforeend',`<div class="s2-t"><small>${s.k} ${s.t}</small><h3>${['감지','판단','대응'][i]}</h3><p>${s.h}</p></div>`);
  s2Steps.insertAdjacentHTML('beforeend',`<span><i></i>${s.k} ${s.t}</span>`);
  s2Wrap.insertAdjacentHTML('beforeend',`<div class="s2-tok" style="left:${[25,60,87][i]}%;top:${[30,13,76][i]}%">${s.ic}</div>`);
});
const s2Lead=$('.s2-lead'), s2Toks=$$('.s2-tok');
const s2Ts=$$('.s2-t:not(.s2-lead)'), s2Pills=$$('#s2Steps span'), s2Fill=$$('#s2Steps span i');
(function buildScene(){
  let rnd=7; const R=()=>{rnd=(rnd*16807)%2147483647;return rnd/2147483647};
  const crowd=[]; for(let i=0;i<30;i++){const a=R()*6.283,r=Math.sqrt(R());crowd.push([250+Math.cos(a)*r*130,370+Math.sin(a)*r*68])}
  const calm=[[730,385],[812,372],[790,418],[700,352]];
  const PUCK=[[250,290],[770,290],[510,430]];
  s2Svg.innerHTML=`<defs>
<radialGradient id="s2Heat"><stop offset="0" stop-color="#F08CC4" stop-opacity=".55"/><stop offset="1" stop-color="#F08CC4" stop-opacity="0"/></radialGradient>
<radialGradient id="s2Calm"><stop offset="0" stop-color="#8CC6EC" stop-opacity=".5"/><stop offset="1" stop-color="#8CC6EC" stop-opacity="0"/></radialGradient>
<radialGradient id="s2Orb" cx=".35" cy=".3"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#C9C6FF"/><stop offset="1" stop-color="#9D97DD"/></radialGradient>
<linearGradient id="s2G" x1="0" x2="1"><stop offset="0" stop-color="#9CC8E2"/><stop offset=".5" stop-color="#B8B6E5"/><stop offset="1" stop-color="#E8B0DD"/></linearGradient>
<pattern id="awnA" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#F6C9E4"/><rect x="12" width="12" height="12" fill="#fff"/></pattern>
<pattern id="awnB" width="24" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#CFE4F3"/><rect x="12" width="12" height="12" fill="#fff"/></pattern>
<filter id="s2Blur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="7"/></filter>
</defs>
<rect x="10" y="10" width="980" height="600" rx="40" fill="#FBFAFF" stroke="#E2DEF3" stroke-width="2"/>
${Array.from({length:9},(_,i)=>`<line x1="${110+i*100}" y1="30" x2="${110+i*100}" y2="590" stroke="#ECE8F7"/>`).join('')}
${Array.from({length:5},(_,i)=>`<line x1="30" y1="${110+i*100}" x2="970" y2="${110+i*100}" stroke="#EFEDF8"/>`).join('')}
<circle id="s2HeatC" cx="250" cy="360" r="200" fill="url(#s2Heat)" opacity="0"/>
<circle id="s2CalmC" cx="770" cy="370" r="170" fill="url(#s2Calm)" opacity="0"/>
<g><rect x="150" y="170" width="200" height="104" rx="14" fill="#fff" stroke="#E9E6F5" stroke-width="2"/><rect x="138" y="148" width="224" height="36" rx="12" fill="url(#awnA)" stroke="#F1D6E8"/></g>
<g id="s2BoothB"><rect x="670" y="170" width="200" height="104" rx="14" fill="#fff" stroke="#E9E6F5" stroke-width="2"/><rect x="658" y="148" width="224" height="36" rx="12" fill="url(#awnB)" stroke="#D6E6F2"/></g>
<rect id="s2BGlow" x="660" y="160" width="220" height="124" rx="20" fill="none" stroke="#8CC6EC" stroke-width="5" filter="url(#s2Blur)" opacity="0"/>
<g id="s2Lines">${PUCK.map(([x,y])=>`<line x1="${x}" y1="${y}" x2="510" y2="92" stroke="url(#s2G)" stroke-width="2.5" stroke-linecap="round"/>`).join('')}</g>
<g id="s2Rip">${PUCK.map(([x,y])=>[0,1,2].map(()=>`<circle cx="${x}" cy="${y}" r="10" fill="none" stroke="#9D97DD" stroke-width="2" opacity="0"/>`).join('')).join('')}</g>
${PUCK.map(([x,y])=>`<g><circle cx="${x}" cy="${y}" r="12" fill="#fff" stroke="url(#s2G)" stroke-width="3"/><circle cx="${x}" cy="${y}" r="4" fill="#9D97DD"/></g>`).join('')}
<g id="s2Crowd">${crowd.map(([x,y])=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="8" fill="#C9C7D9"/>`).join('')}${calm.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="#C9C7D9"/>`).join('')}</g>
<path id="s2RouteGlow" d="M510,548 C600,540 760,480 770,392" fill="none" stroke="url(#s2G)" stroke-width="14" stroke-linecap="round" filter="url(#s2Blur)" opacity="0"/>
<path id="s2Route" d="M510,548 C600,540 760,480 770,392" fill="none" stroke="url(#s2G)" stroke-width="6" stroke-linecap="round"/>
<g id="s2Core" opacity="0"><circle cx="510" cy="92" r="40" fill="#B8B6E5" opacity=".35" filter="url(#s2Blur)"/><circle cx="510" cy="92" r="26" fill="url(#s2Orb)" stroke="#fff" stroke-width="2"/></g>
<g id="s2User"><circle id="s2Pulse" r="18" fill="none" stroke="#9D97DD" stroke-width="2.5" opacity="0"/><circle r="13" fill="#1D1D1F" stroke="#fff" stroke-width="3"/><circle r="5" cy="-1" fill="url(#s2G)"/></g>`;
})();
const s2={el:$('#system')};
const s2HeatC=$('#s2HeatC'),s2CalmC=$('#s2CalmC'),s2BGlow=$('#s2BGlow'),s2Lines=$$('#s2Lines line'),s2Rips=$$('#s2Rip circle'),s2Crowd=$$('#s2Crowd circle'),
      s2Route=$('#s2Route'),s2RouteGlow=$('#s2RouteGlow'),s2Core=$('#s2Core'),s2User=$('#s2User'),s2Pulse=$('#s2Pulse');
const s2Len=s2Route.getTotalLength(); s2Route.style.strokeDasharray=s2Len; s2Lines.forEach(l=>{const L=Math.hypot(l.x2.baseVal.value-l.x1.baseVal.value,l.y2.baseVal.value-l.y1.baseVal.value);l.dataset.l=L;l.style.strokeDasharray=L});
const S2_T=[[.14,.37],[.37,.6],[.6,1.01]];
function tickSystem2(now){
  const el=s2.el,top=el.offsetTop; if(scrollY+VH<top-10||scrollY>top+el.offsetHeight)return;
  const p=system.p, t=now/1000;
  const mob=VW<700, e=eIO(range(p,.08,.2));
  const lo=1-eIn(range(p,.1,.15)); s2Lead.style.opacity=lo.toFixed(3);
  s2Lead.style.transform=`translateY(calc(-50% + ${(-(1-lo)*30).toFixed(1)}px))`; s2Lead.style.filter=lo<.998&&lo>.002?`blur(${((1-lo)*10).toFixed(2)}px)`:'none';
  const RX=lerp(mob?40:52,mob?10:16,e)-tilt.y*6, RY=lerp(0,mob?-6:-14,e)+tilt.x*9, RZ=lerp(mob?-16:-26,-2,e), SC=lerp(.9,1,e);
  s2Wrap.style.transform=`perspective(1600px) rotateX(${RX.toFixed(2)}deg) rotateY(${RY.toFixed(2)}deg) rotateZ(${RZ.toFixed(2)}deg) scale(${SC.toFixed(4)})`;
  s2Steps.classList.toggle('show',p>.16);
  // copy per step: crisp at rest, blurred only while crossing
  s2Ts.forEach((e,i)=>{const [a,b]=S2_T[i];const ti=eOut(range(p,a,a+.05)),to=eIn(range(p,b-.03,b+.02)),w=(1-ti)+to;
    e.style.opacity=(ti*(1-to)).toFixed(3); e.style.transform=`translateY(calc(-50% + ${((1-ti)*30-to*30).toFixed(1)}px))`;
    e.style.filter=w>.004?`blur(${(w*10).toFixed(2)}px)`:'none'});
  const act=p<S2_T[1][0]?0:p<S2_T[2][0]?1:2;
  s2Pills.forEach((x,i)=>x.classList.toggle('on',i===act));
  s2Toks.forEach((k,i)=>{const on=p>.14&&i===act, base=p<.14?.92:on?1:.38;k.classList.toggle('on',on);
    k.style.opacity=base.toFixed(3); k.style.transform=`translateZ(${(on?110:60).toFixed(0)}px) translateY(${(Math.sin(t*1.4+i*2)*6).toFixed(1)}px) rotateZ(${(-RZ).toFixed(2)}deg) rotateX(${(-RX).toFixed(2)}deg) scale(${on?1.15:.95})`});
  s2Fill.forEach((x,i)=>x.style.width=(range(p,S2_T[i][0],Math.min(1,S2_T[i][1]))*100).toFixed(1)+'%');
  // scene
  const S=eOut(range(p,.16,.3)), D=eIO(range(p,.4,.52)), Rt=eIO(range(p,.46,.55)), A=eIO(range(p,.62,.8));
  const sense=S*(1-.45*D);
  s2HeatC.setAttribute('opacity',(S*(1-.55*A)).toFixed(3));
  s2Rips.forEach((c,k)=>{const ph=((t*.7+(k%3)/3)%1);c.setAttribute('r',(12+ph*90).toFixed(1));c.setAttribute('opacity',((1-ph)*.8*sense).toFixed(3))});
  const hot=Math.round(201+(240-201)*S),hg=Math.round(199+(140-199)*S),hb=Math.round(217+(196-217)*S);
  s2Crowd.forEach((c,k)=>c.setAttribute('fill',k<30?`rgb(${hot},${hg},${hb})`:`rgb(${Math.round(201-61*S)},${Math.round(199+(198-199)*S)},${Math.round(217+(236-217)*S)})`));
  s2Core.setAttribute('opacity',D.toFixed(3));
  s2Lines.forEach(l=>l.style.strokeDashoffset=(+l.dataset.l*(1-D)).toFixed(1));
  s2Route.style.strokeDashoffset=(s2Len*(1-Rt)).toFixed(1); s2Route.setAttribute('opacity',(.35+.65*Rt).toFixed(3));
  s2RouteGlow.setAttribute('opacity',(A*(.55+.25*Math.sin(t*3))).toFixed(3));
  s2CalmC.setAttribute('opacity',(Rt*.6+A*.4).toFixed(3));
  s2BGlow.setAttribute('opacity',(Math.max(Rt*.5,A)*(.7+.3*Math.sin(t*2.4))).toFixed(3));
  const pt=s2Route.getPointAtLength(s2Len*A*.94);
  s2User.setAttribute('transform',`translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);
  const ph=(t*1.2)%1; s2Pulse.setAttribute('r',(16+ph*22).toFixed(1)); s2Pulse.setAttribute('opacity',(A>0?(1-ph)*Math.min(1,A*3):0).toFixed(3));
}

/* ======================= PROJECTS v4 · orbs land → guided tour → free ======================= */
const pj={el:$('#projects'),p:0,t:0,stop:-2};
const pjSticky=$('.pj-sticky'), pjHead=$('.pj-head'), pjOrbs=$$('.pj-orb'), pjTour=$('#pjTour'), ptK=$('#ptK'), ptN=$('#ptN'), ptO=$('#ptO'), ptGo=$('#ptGo');
const PJ_CATS=['personal','space','operator'];
const TOUR=PJ_CATS.flatMap(c=>PRODUCTS.filter(q=>q.cat===c).map(q=>q.n));
const PJ_T0=.17, PJ_T1=.91, PJ_TW=(PJ_T1-PJ_T0)/TOUR.length;
let pjTourActive=false;
function zoneCenter(cat){let x=0,y=0,n=0;pins.forEach(pn=>{if(PRODUCTS[pn.dataset.n-1].cat===cat){const r=pn.querySelector('.head').getBoundingClientRect();if(r.width){x+=r.left+r.width/2;y+=r.top+r.height/2;n++}}});return n?[x/n,y/n]:[VW*.57,VH*.57]}
function renderProjects(p){
  // three orbs (from the question) land on their zones
  const land=eIO(range(p,.05,.14)), gone=range(p,.13,.16);
  if(p<.17){const box=pjSticky.getBoundingClientRect();
    pjOrbs.forEach((o,i)=>{const gap=Math.min(VW*.26,260), sx=VW/2+(i-1)*gap, sy=VH*.34;
      const z=land>0?zoneCenter(PJ_CATS[i]):[sx,sy], x=lerp(sx,z[0],land), y=lerp(sy,z[1]-box.top,land)-Math.sin(land*Math.PI)*60;
      o.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) translate(-50%,-50%) scale(${(1-.78*land).toFixed(4)})`;
      o.style.opacity=(1-gone).toFixed(3);
      o.querySelector('span').style.opacity=(1-range(p,.05,.08)).toFixed(3);
      const rp=o.querySelector('.ripple'), rk=range(p,.12,.16);
      rp.style.transform=`translate(-50%,-50%) scale(${(rk*4).toFixed(3)})`; rp.style.opacity=(rk>0?(1-rk):0).toFixed(3)});
  } else pjOrbs.forEach(o=>o.style.opacity='0');
  // tour stops
  let st=p<PJ_T0?-1:p<PJ_T1?Math.min(TOUR.length-1,Math.floor((p-PJ_T0)/PJ_TW)):99;
  if(st!==pj.stop){pj.stop=st;
    if(st>=0&&st<99){const n=TOUR[st],pr=PRODUCTS[n-1],[x,y,w,d]=pr.b;
      if(map.sel)closeCard();
      map.tx=-(x+w/2-500);map.ty=-(y+d/2-500);map.zoom=VW<700?1.45:1.7;map.rot=-38+(st-2.5)*12;map.tilt=52;setHL(n);
      ptK.textContent=`0${n} · ${CAT[pr.cat]} · ${pr.place}`;ptN.textContent=pr.name;ptO.textContent=pr.one;ptGo.dataset.n=n;
    } else {if(!map.sel){map.tx=0;map.ty=0;map.zoom=1;map.rot=-38;map.tilt=56;setHL(0)}}
  }
  if(st>=0&&st<99){const local=(p-PJ_T0)/PJ_TW-st, ti=eOut(clamp(local/.28)), to=eIn(clamp((local-.84)/.16)), w=(1-ti)+to;
    pjTour.style.opacity=(ti*(1-to)).toFixed(3);
    pjTour.style.transform=`translateY(${VW<700?0:-50}%) translateY(${((1-ti)*36-to*30).toFixed(1)}px)`;
    pjTour.style.filter=w>.004?`blur(${(w*10).toFixed(2)}px)`:'none';
    pjTour.classList.toggle('live',ti*(1-to)>.6);
  } else {pjTour.style.opacity='0';pjTour.classList.remove('live')}
  pjTourActive=p>=PJ_T0-.01&&p<PJ_T1;
  const free=p>=PJ_T1+.01; pjSticky.classList.toggle('free',free);
  pjHead.style.opacity=free?eOut(range(p,PJ_T1,PJ_T1+.05)).toFixed(3):'0';
  pjHead.style.pointerEvents=free?'':'none';
}
ptGo.addEventListener('click',()=>openDetail(+ptGo.dataset.n));

/* ======================= shared pointer tilt + epilogue card ======================= */
const tilt={x:0,y:0}, wcImgBox=$('#world-c .wc-img');
function tickTilt(){tilt.x=lerp(tilt.x,tm.x,.06);tilt.y=lerp(tilt.y,tm.y,.06)}
function tickWorldC(){const el=worldC.el,top=el.offsetTop; if(scrollY+VH<top-10||scrollY>top+el.offsetHeight)return;
  const mob=VW<700, p=worldC.p, k=eOut(range(p,0,.25));
  wcImgBox.style.transform=mob?`translateY(${((1-k)*30).toFixed(1)}px)`:`perspective(1600px) rotateY(${(-10+tilt.x*7-(1-k)*14).toFixed(2)}deg) rotateX(${(3-tilt.y*5).toFixed(2)}deg) translateX(${((1-k)*60).toFixed(1)}px)`;}
/* ======================= SCROLL PAUSES + SNAP ======================= */
// mapped progress values where the scene should rest (content fully shown)
const HOLDS={'intro':[0,.27,.62,1],'world-a':[.04,.24,.4467,.6533,.86],'world-c':[.3,.8],'system':[.05,.31,.53,.8],'turn':[.42,.8],'projects':[.02,...Array.from({length:6},(_,i)=>.17+(.74/6)*(i+.5)),.975]};
const HOLD_W={'intro':.05,'world-a':.05,'world-c':.08,'system':.05,'turn':.07,'projects':.035};   // raw share of the section each pause takes
const KNOTS={};
for(const id in HOLDS){const H=HOLDS[id],w=HOLD_W[id],mv=1-H.length*w,k=[[0,0]];let pr=0,pm=0;
  H.forEach(h=>{const r0=pr+(h-pm)*mv;k.push([r0,h],[r0+w,h]);pr=r0+w;pm=h});k.push([1,1]);KNOTS[id]=k}
function remap(id,t){const k=KNOTS[id];if(!k)return t;for(let i=1;i<k.length;i++){const [r0,m0]=k[i-1],[r1,m1]=k[i];if(t<=r1)return r1>r0?m0+(m1-m0)*(.5-.5*Math.cos(Math.PI*(t-r0)/(r1-r0))):m1}return 1}
function holdRaw(id,i){const k=KNOTS[id];return (k[1+i*2][0]+k[2+i*2][0])/2}
function holdY(id,i){const el=$('#'+id);return Math.round(el.offsetTop+holdRaw(id,i)*(el.offsetHeight-VH))}
function snapPoints(){const pts=[];for(const id in HOLDS){const hw=HOLD_W[id]*($('#'+id).offsetHeight-VH)/2;HOLDS[id].forEach((_,i)=>pts.push({y:holdY(id,i),id,i,hw}))}return pts.sort((a,b)=>a.y-b.y)}
/* ---- smooth scrolling: wheel inertia + gentle magnet (no hard stops) ---- */
let snapT=0,touching=false,lastSY=scrollY,dir=1;
const SS={cur:scrollY,tgt:scrollY,on:false,k:.085,set:scrollY};
const maxY=()=>document.documentElement.scrollHeight-innerHeight;
function smoothTo(y,k){if(reduce){window.scrollTo(0,y);return}SS.cur=SS.on?SS.cur:scrollY;SS.tgt=clamp(Math.round(y),0,maxY());SS.k=k||.075;SS.on=true}
function tickSS(){if(!SS.on)return;SS.cur=lerp(SS.cur,SS.tgt,SS.k);if(Math.abs(SS.tgt-SS.cur)<.5){SS.cur=SS.tgt;SS.on=false}SS.set=Math.round(SS.cur);window.scrollTo(0,SS.cur)}
const ownScroller=t=>t&&t.closest&&t.closest('#detail,.lightbox,.pcard');
addEventListener('wheel',e=>{
  if(e.ctrlKey||reduce||detail.classList.contains('open')||ownScroller(e.target))return;
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  e.preventDefault();
  const d=e.deltaY*(e.deltaMode===1?32:e.deltaMode===2?VH:1);
  if(!SS.on){SS.cur=scrollY;SS.tgt=scrollY}
  SS.tgt=clamp(SS.tgt+d,0,maxY());SS.k=.085;SS.on=true;if(d)dir=d>0?1:-1;queueMagnet();
},{passive:false});
addEventListener('touchstart',()=>{touching=true;SS.on=false},{passive:true});
addEventListener('touchend',()=>{touching=false;queueMagnet()},{passive:true});
function queueMagnet(){clearTimeout(snapT);snapT=setTimeout(magnet,300)}
function magnet(){
  if(touching||detail.classList.contains('open'))return;
  if(SS.on&&Math.abs(SS.tgt-SS.cur)>24){queueMagnet();return}
  const pts=snapPoints(),y=SS.on?SS.tgt:scrollY,last=pts[pts.length-1]; if(y>last.y+VH*.25)return;
  let best=null,bd=1e9;for(const p of pts){const dd=Math.abs(p.y-y);if(dd<bd){bd=dd;best=p}}
  if(!best||bd<=2)return;
  const ahead=(best.y-y)*dir>0;                  // settle forward generously, never drag back far
  const reach=ahead?best.hw+VH*.18:best.hw*.9;
  if(bd<reach)smoothTo(best.y,.055);
}
addEventListener('scroll',()=>{const d=scrollY-lastSY;if(Math.abs(d)>.5)dir=d>0?1:-1;lastSY=scrollY;
  if(SS.on&&Math.abs(scrollY-SS.set)>3){SS.on=false}      // scrollbar / external scroll takes over
  if(!SS.on){SS.cur=SS.tgt=scrollY;queueMagnet()}},{passive:true});
addEventListener('keydown',e=>{
  if(detail.classList.contains('open')||e.target.closest('input,textarea'))return;
  const down=['ArrowDown','PageDown',' '].includes(e.key),up=['ArrowUp','PageUp'].includes(e.key); if(!down&&!up)return;
  const pts=snapPoints(),y=SS.on?SS.tgt:scrollY; if(y>pts[pts.length-1].y+4&&down)return;
  const t=down?pts.find(p=>p.y>y+4):[...pts].reverse().find(p=>p.y<y-4); if(!t)return;
  e.preventDefault(); smoothTo(t.y,.07);
});
// small step indicator for the pinned scene in view
const holdbar=document.createElement('div');holdbar.className='holdbar';holdbar.setAttribute('aria-hidden','true');document.body.appendChild(holdbar);
let hbKey='';
function tickHoldbar(){
  let cur=null;for(const id in HOLDS){const el=$('#'+id);if(scrollY>=el.offsetTop-2&&scrollY<=el.offsetTop+el.offsetHeight-VH+2)cur=id}
  const show=!!cur&&HOLDS[cur].length>1&&!['intro','world-a','system'].includes(cur); holdbar.classList.toggle('show',show); if(!show)return;
  const pts=HOLDS[cur].map((_,i)=>holdY(cur,i)); let a=0;pts.forEach((y,i)=>{if(scrollY>=y-VH*.35)a=i});
  const key=cur+pts.length; if(key!==hbKey){hbKey=key;holdbar.innerHTML=pts.map(()=>'<i></i>').join('')}
  [...holdbar.children].forEach((x,i)=>x.classList.toggle('on',i===a));
}
const scenes=[[intro,renderIntro],[worldA,renderWorldA],[worldC,renderWorldC],[system,renderSystem],[turn,renderTurn],[pj,renderProjects]];
function progressOf(el){const top=el.offsetTop, h=el.offsetHeight-VH;return remap(el.id,clamp((scrollY-top)/h))}
function updateChrome(){
  const y=scrollY+VH*.45; let cur=0;
  secOrder.forEach((id,i)=>{const el=$('#'+id);if(el.offsetTop<=y)cur=i});
  if($('#world-c').offsetTop<=y && $('#system').offsetTop>y) cur=1;
  const show=intro.t>.8||scrollY>intro.el.offsetHeight-VH;
  nav.classList.toggle('show',show); dots.classList.toggle('show',show);
  nav.classList.toggle('glass',scrollY>intro.el.offsetHeight-VH*1.05);
  $$('.dots button').forEach((b,i)=>b.classList.toggle('on',i===cur));
  $$('.nav a[data-sec]').forEach(a=>a.classList.toggle('on',a.dataset.sec===secOrder[cur].replace('-a','')));
}
// mouse parallax on intro orbs
const iorbs=$$('#intro .orb'); let mx=0,my=0,cmx=0,cmy=0;
addEventListener('pointermove',e=>{mx=e.clientX/VW-.5;my=e.clientY/VH-.5},{passive:true});

function loop(){
  tickSS();
  scrollVel=lerp(scrollVel,Math.abs(scrollY-lastScrollY),.2); lastScrollY=scrollY;
  if(!detail.classList.contains('ready')){
    for(const [s,fn] of scenes){
      s.t=progressOf(s.el);
      const near=Math.abs(s.t-s.p)>.0004;
      if(near){s.p=reduce?s.t:lerp(s.p,s.t,.2);fn(s.p)}
      else if(s.p!==s.t){s.p=s.t;fn(s.p)}
    }
    cmx=lerp(cmx,mx,.05);cmy=lerp(cmy,my,.05);
    if(!reduce)iorbs.forEach((o,i)=>o.style.transform=`translate(${(cmx*(30+i*14)).toFixed(1)}px,${(cmy*(30+i*14)).toFixed(1)}px)`);
    if(intro.p<.95||particles.list.length)tickParticles();
    tickMap(); updateChrome(); tickHoldbar(); tickTilt(); tickWorld(performance.now()); tickWorldC(); tickTurn(performance.now()); tickSystem2(performance.now());
  }
  requestAnimationFrame(loop);
}
function onResize(){VW=innerWidth;VH=innerHeight;sizeTurn();sizeCanvas();layoutLink();fitMap();map.dirty=true;scenes.forEach(([s,fn])=>fn(s.p))}
addEventListener('resize',onResize);
onResize(); scenes.forEach(([s,fn])=>{s.t=s.p=progressOf(s.el);fn(s.p)}); applyMap();
requestAnimationFrame(loop);

/* ======================= ENHANCED MOTION LAYER ======================= */
const FINE=matchMedia('(pointer:fine)').matches;
let PX=VW/2, PY=VH*.45, pIn=false, pDown=false;
const fxm={x:0,y:0};            // smoothed pointer, -0.5..0.5
addEventListener('pointermove',e=>{PX=e.clientX;PY=e.clientY;pIn=true},{passive:true});
document.addEventListener('pointerleave',()=>{pIn=false});
addEventListener('blur',()=>{pIn=false});

/* ---------- 1. Hero live background (WebGL aurora) ---------- */
const heroBg=$('#heroBg');
let GL=null;
(function initGL(){
  if(reduce||!heroBg)return;
  const g=heroBg.getContext('webgl',{antialias:false,alpha:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
  if(!g)return;
  const vs=`attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
  const fs=`precision mediump float;
uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uScroll;uniform vec3 uClick;uniform float uVel;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<5;i++){v+=a*n(p);p=m*p;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 float asp=uRes.x/uRes.y;
 vec2 p=(gl_FragCoord.xy-.5*uRes)/uRes.y;
 vec2 m=(uMouse-.5)*vec2(asp,1.);
 float md=length(p-m);
 p+=(p-m)*.22*exp(-md*md*5.);
 p*=1.-uScroll*.35;
 float t=uTime*(.055+uVel*.02)+uScroll*1.6;
 vec2 q=vec2(fbm(p*1.35+vec2(0.,t)),fbm(p*1.35+vec2(5.2,1.3)-t));
 vec2 r=vec2(fbm(p*1.5+2.2*q+vec2(1.7,9.2)+t*1.2),fbm(p*1.5+2.2*q+vec2(8.3,2.8)-t*.9));
 float f=fbm(p*1.2+2.6*r);
 vec3 sky=vec3(.612,.784,.886),lav=vec3(.722,.714,.898),pink=vec3(.910,.690,.867),peach=vec3(.973,.792,.655);
 vec3 col=mix(sky,lav,smoothstep(.25,.65,f));
 col=mix(col,pink,smoothstep(.40,.80,r.x)*.9);
 col=mix(col,peach,smoothstep(.55,.90,q.y)*.75);
 float band=pow(.5+.5*sin((p.x*1.2+p.y)*3.2+t*5.+f*5.),14.);
 col+=band*.07;
 float c=length((uv-.5)*vec2(asp,1.));
 float wash=.70-.36*smoothstep(.12,.85,c);
 col=mix(col,vec3(1.),wash);
 col=mix(col,mix(lav,pink,.5+.5*sin(uTime*.4)),.16*exp(-md*md*7.));
 col+=.06*exp(-md*md*18.);
 float ct=uTime-uClick.z;
 if(ct<3.){vec2 cp=uClick.xy;float d=length(p-cp);
  float ring=exp(-pow((d-ct*.55)*10.,2.))*(1.-ct/3.);
  float ring2=exp(-pow((d-ct*.38)*14.,2.))*(1.-ct/3.)*.6;
  col=mix(col,mix(sky,pink,.5+.5*sin(d*8.)),clamp(ring+ring2,0.,1.)*.55);}
 col+=(h(gl_FragCoord.xy+fract(uTime*7.))-.5)*.03;
 gl_FragColor=vec4(col,1.);
}`;
  const sh=(type,src)=>{const s=g.createShader(type);g.shaderSource(s,src);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS)){console.warn(g.getShaderInfoLog(s));return null}return s};
  const v=sh(g.VERTEX_SHADER,vs), f=sh(g.FRAGMENT_SHADER,fs); if(!v||!f)return;
  const pr=g.createProgram();g.attachShader(pr,v);g.attachShader(pr,f);g.linkProgram(pr);
  if(!g.getProgramParameter(pr,g.LINK_STATUS))return;
  g.useProgram(pr);
  const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);
  const loc=g.getAttribLocation(pr,'a');g.enableVertexAttribArray(loc);g.vertexAttribPointer(loc,2,g.FLOAT,false,0,0);
  const U=k=>g.getUniformLocation(pr,k);
  GL={g,uRes:U('uRes'),uTime:U('uTime'),uMouse:U('uMouse'),uScroll:U('uScroll'),uClick:U('uClick'),uVel:U('uVel'),mx:.5,my:.55,click:[0,0,-99],vel:0};
  heroBg.closest('.stage').classList.add('has-gl');
})();
function sizeGL(){if(!GL)return;const s=VW<700?.6:.5;heroBg.width=Math.max(2,Math.round(VW*s));heroBg.height=Math.max(2,Math.round(VH*s));GL.g.viewport(0,0,heroBg.width,heroBg.height)}
function drawGL(now){
  if(!GL)return;
  if(intro.p>.84||scrollY>intro.el.offsetHeight)return;
  const g=GL.g, tx=pIn?PX/VW:.5+.18*Math.sin(now/2600), ty=pIn?1-PY/VH:.55+.12*Math.cos(now/3100);
  GL.mx=lerp(GL.mx,tx,.05); GL.my=lerp(GL.my,ty,.05); GL.vel=lerp(GL.vel,Math.min(scrollVel,40)/40,.08);
  g.uniform2f(GL.uRes,heroBg.width,heroBg.height); g.uniform1f(GL.uTime,now/1000);
  g.uniform2f(GL.uMouse,GL.mx,GL.my); g.uniform1f(GL.uScroll,intro.p); g.uniform1f(GL.uVel,GL.vel);
  g.uniform3f(GL.uClick,...GL.click);
  g.drawArrays(g.TRIANGLES,0,3);
}
// click / tap on hero → shock-wave + particle burst
$('#intro .stage').addEventListener('pointerdown',e=>{
  if(intro.p>.25||reduce)return;
  const now=performance.now()/1000;
  if(GL)GL.click=[(e.clientX-VW/2)/VH,(VH/2-e.clientY)/VH,now];
  for(let i=0;i<46;i++){const a=Math.random()*Math.PI*2,sp=1.2+Math.random()*3.4;
    particles.list.push({x:e.clientX,y:e.clientY,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,s:1.4+Math.random()*3.6,life:1,d:.012+Math.random()*.014,c:PCOL[(Math.random()*4)|0],rect:Math.random()<.4,rot:Math.random()*6})}
});
// cursor sparkle trail in hero
let lastTrail=0;
addEventListener('pointermove',e=>{
  if(reduce||intro.p>.18||e.pointerType!=='mouse')return;
  const now=performance.now(); if(now-lastTrail<28)return; lastTrail=now;
  particles.list.push({x:e.clientX,y:e.clientY,vx:(Math.random()-.5)*.8,vy:-.3-Math.random()*.6,s:1.2+Math.random()*2.4,life:.9,d:.018+Math.random()*.012,c:PCOL[(Math.random()*4)|0],rect:Math.random()<.3,rot:Math.random()*6});
},{passive:true});

/* ---------- 2. Hero title: magnetic letters + 3D tilt ---------- */
const heroChs=$$('#heroTitle .ch'); let chPos=[]; const chCur=heroChs.map(()=>({x:0,y:0}));
function measureChs(){heroChs.forEach(c=>c.style.translate='');const s=iTitle.style.transform;iTitle.style.transform='';
  chPos=heroChs.map(c=>{const r=c.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}});iTitle.style.transform=s}
setTimeout(measureChs,2100);
function tickTitle(now){
  if(reduce||!chPos.length)return;
  const on=1-range(intro.p,0,.06); if(on<=0&&!chCur.some(c=>Math.abs(c.x)+Math.abs(c.y)>.1))return;
  heroChs.forEach((c,i)=>{const q=chPos[i];let tx=0,ty=Math.sin(now/650+i*.45)*2.2*on;
    if(pIn&&FINE){const dx=q.x-PX,dy=q.y-PY,d=Math.hypot(dx,dy)||1,f=Math.exp(-(d*d)/(2*110*110))*on;tx+=dx/d*26*f;ty+=dy/d*26*f-10*f}
    const k=chCur[i];k.x=lerp(k.x,tx,.14);k.y=lerp(k.y,ty,.14);c.style.translate=`${k.x.toFixed(2)}px ${k.y.toFixed(2)}px`});
  h1.style.transform=`perspective(1000px) rotateX(${(-fxm.y*9*on).toFixed(2)}deg) rotateY(${(fxm.x*12*on).toFixed(2)}deg)`;
}

/* ---------- 3. Cursor follower ---------- */
const cur=document.createElement('div');cur.id='cur';cur.innerHTML='<span></span>';
const curDot=document.createElement('div');curDot.id='curDot';
const sprog=document.createElement('div');sprog.id='sprog';
document.body.append(sprog,cur,curDot);
const curSpan=cur.firstChild; const cc={x:PX,y:PY};
const CLICKABLE='a,button,[role="button"],.pin';
addEventListener('pointerdown',()=>{pDown=true;cur.classList.add('down')});
addEventListener('pointerup',()=>{pDown=false;cur.classList.remove('down')});
function cursorState(t){
  if(!t||!t.closest)return['',''];
  if(t.closest('.pin'))return['lbl','OPEN'];
  if(t.closest('.gallery button'))return['lbl','VIEW'];
  if(t.closest(CLICKABLE))return['big',''];
  if(t.closest('.map-stage'))return['lbl',drag?'·  ·':'DRAG'];
  if(t.closest('.steps'))return['lbl','SWIPE'];
  return['',''];
}
let curTarget=null;
addEventListener('pointerover',e=>{curTarget=e.target},{passive:true});
function tickCursor(){
  if(reduce||!FINE)return;
  cur.classList.toggle('on',pIn); curDot.classList.toggle('on',pIn);
  cc.x=lerp(cc.x,PX,.2); cc.y=lerp(cc.y,PY,.2);
  cur.style.transform=`translate3d(${cc.x.toFixed(1)}px,${cc.y.toFixed(1)}px,0)`;
  curDot.style.transform=`translate3d(${PX}px,${PY}px,0)`;
  const [cls,txt]=cursorState(curTarget);
  cur.classList.toggle('big',cls==='big'); cur.classList.toggle('lbl',cls==='lbl');
  if(curSpan.textContent!==txt)curSpan.textContent=txt;
}

/* ---------- 4. Magnetic buttons ---------- */
const MAG='.btn,.nav ul a,.logo,.map-ctrl button,.dots button,.to-system .row button';
const mags=new Map(); let magEl=null;
addEventListener('pointermove',e=>{magEl=FINE&&e.target.closest?e.target.closest(MAG):null},{passive:true});
function tickMag(){
  if(reduce)return;
  if(magEl&&!mags.has(magEl))mags.set(magEl,{x:0,y:0});
  mags.forEach((m,el)=>{let tx=0,ty=0;
    if(el===magEl&&pIn){const r=el.getBoundingClientRect();const k=el.matches('.dots button')?.5:el.matches('.btn')?.3:.22;
      tx=(PX-(r.left+r.width/2-m.x))*k; ty=(PY-(r.top+r.height/2-m.y))*k; const lim=el.matches('.btn')?14:8; tx=clamp(tx,-lim,lim); ty=clamp(ty,-lim,lim)}
    m.x=lerp(m.x,tx,.18); m.y=lerp(m.y,ty,.18);
    if(el!==magEl&&Math.abs(m.x)+Math.abs(m.y)<.05){el.style.translate='';mags.delete(el);return}
    el.style.translate=`${m.x.toFixed(2)}px ${m.y.toFixed(2)}px`});
}

/* ---------- 5. Ripple on press ---------- */
addEventListener('pointerdown',e=>{
  if(reduce)return; const b=e.target.closest&&e.target.closest('.btn,.filters button,.map-ctrl button'); if(!b)return;
  const r=b.getBoundingClientRect(), s=document.createElement('span'); s.className='rpl';
  s.style.left=(e.clientX-r.left)+'px'; s.style.top=(e.clientY-r.top)+'px'; s.style.setProperty('--s',(Math.hypot(r.width,r.height)/6).toFixed(1));
  b.appendChild(s); s.addEventListener('animationend',()=>s.remove());
});

/* ---------- 6. 3D tilt + glare ---------- */
const TILT='.stack,.step,.gallery button,.ov .img,.design-vis,.pcard .vis';
let tiltEl=null;
function resetTilt(el){el.classList.remove('tilting');el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')}
addEventListener('pointermove',e=>{
  if(reduce||!FINE)return; const el=e.target.closest?e.target.closest(TILT):null;
  if(el!==tiltEl){if(tiltEl)resetTilt(tiltEl);tiltEl=el}
  if(!el)return; el.classList.add('glare','tilting');
  const r=el.getBoundingClientRect(), x=clamp((e.clientX-r.left)/r.width), y=clamp((e.clientY-r.top)/r.height);
  const amt=el.matches('.stack')?7:el.matches('.design-vis')?6:9;
  el.style.setProperty('--rx',((.5-y)*amt).toFixed(2)+'deg'); el.style.setProperty('--ry',((x-.5)*amt*1.25).toFixed(2)+'deg');
  el.style.setProperty('--mx',(x*100).toFixed(1)+'%'); el.style.setProperty('--my',(y*100).toFixed(1)+'%');
},{passive:true});
document.addEventListener('pointerleave',()=>{if(tiltEl){resetTilt(tiltEl);tiltEl=null}});

/* ---------- 7. Staggered reveals + label decode ---------- */
function stagger(el){
  const sib=[...el.parentNode.children].filter(x=>x.classList.contains('reveal')); const i=sib.indexOf(el);
  if(i>0&&!reduce){el.style.transitionDelay=(i*.09).toFixed(2)+'s';
    el.addEventListener('transitionend',function clr(ev){if(ev.target===el&&ev.propertyName==='opacity'){el.style.transitionDelay='';el.removeEventListener('transitionend',clr)}})}
}
$$('main .reveal').forEach(stagger);
const GLY='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/*+';
function scramble(el){
  if(reduce)return; const o=el.dataset.txt??(el.dataset.txt=el.textContent); const tok=(el._tok||0)+1; el._tok=tok; let f=0;
  (function step(){if(el._tok!==tok)return; f++; const rev=f/20*o.length;
    el.textContent=[...o].map((c,i)=>i<rev||!/[A-Z0-9]/.test(c)?c:GLY[(Math.random()*GLY.length)|0]).join('');
    if(rev<o.length)requestAnimationFrame(step); else el.textContent=o})();
}
const lio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){setTimeout(()=>scramble(e.target),180);lio.unobserve(e.target)}}),{threshold:.6});
$$('main .label').forEach(el=>{if(/[A-Z]/.test(el.textContent)&&!el.children.length)lio.observe(el)});
$$('.nav ul a').forEach(a=>a.addEventListener('pointerenter',()=>scramble(a)));

/* ---------- 8. World A: card depth + image drift ---------- */
const wImgs=wcards.map(c=>c.querySelector('.world-art'));
function tickWorldImgs(){
  if(reduce)return; const s=clamp((worldA.p-.06)/.82)*3;
  wImgs.forEach((im,k)=>{if(!im)return;const d=k-s;
    im.style.transform=`scale(${(1.04+.12*clamp(Math.abs(d))).toFixed(4)}) translate(${(fxm.x*-10).toFixed(1)}px,${(d*4+fxm.y*-8).toFixed(1)}px)`});
}
const wcImg=$('#wcScene .world-art');

/* ---------- 9. System: comet along the link + pulses ---------- */
const linkSvg=$('#linkSvg');
linkSvg.insertAdjacentHTML('beforeend','<circle id="linkDot" r="7" fill="#fff" stroke="url(#lg)" stroke-width="3" opacity="0"/>');
const linkDot=$('#linkDot'); let sysAct=-1;
function tickSystem(){
  const lp=range(system.p,.12,.78), len=+lf.dataset.len||0, x1=+lf.getAttribute('x1')||0;
  linkDot.setAttribute('cx',(x1+len*lp).toFixed(1)); linkDot.setAttribute('cy',lf.getAttribute('y1')||0);
  linkDot.setAttribute('opacity',(lp>0&&lp<1?1:0)*(1-range(system.p,.9,1)));
  const a=nodes.findIndex(n=>n.classList.contains('on'));
  if(a!==sysAct){sysAct=a; descs.forEach((d,i)=>d.classList.toggle('act',i===a));
    if(a>=0&&system.p>.05&&system.p<.95&&!reduce){const n=nodes[a];n.classList.remove('pulse');void n.offsetWidth;n.classList.add('pulse')}}
}

/* ---------- 10. Velocity skew on scrolling copy ---------- */
const skewEls=$$('.wa-left,.wc-right,.sys-inner .h-main'); let sv=0, lastY=scrollY;
function tickSkew(){
  if(reduce)return; sv=lerp(sv,scrollY-lastY,.12); lastY=scrollY;
  const k=clamp(sv*.045,-2.2,2.2); skewEls.forEach(el=>el.style.transform=Math.abs(k)<.01?'':`skewY(${(-k).toFixed(3)}deg)`);
}

/* ---------- 11. Map: fly-in entrance, idle orbit, filter indicator ---------- */
world.classList.add('pre'); pins.forEach((p,i)=>p.style.setProperty('--i',i));
let mapEntered=false, lastMapInt=performance.now();
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!mapEntered){mapEntered=true;
  if(!reduce){map.cur.rot=-150;map.cur.tilt=80;map.cur.zoom=.45;map.dirty=true}
  world.classList.remove('pre');world.classList.add('enter');lastMapInt=performance.now()}}),{threshold:.02}).observe($('#projects'));
['pointerdown','wheel'].forEach(t=>mstage.addEventListener(t,()=>lastMapInt=performance.now(),{passive:true}));
function tickMapIdle(now){
  if(reduce||!mapEntered||map.sel||drag||pjTourActive||!pjSticky.classList.contains('free')||detail.classList.contains('open'))return;
  const r=$('#projects').getBoundingClientRect(); if(r.bottom<0||r.top>VH)return;
  if(now-lastMapInt>4500&&!pins.some(p=>p.classList.contains('hl')))map.rot+=.035;
}
const filt=$('#filters'); const ind=document.createElement('span'); ind.className='ind'; filt.prepend(ind);
function moveInd(){const b=$('#filters button.on');if(!b)return;ind.style.width=b.offsetWidth+'px';ind.style.transform=`translateX(${b.offsetLeft}px)`}
$$('#filters button').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(moveInd)));
addEventListener('resize',moveInd); (document.fonts?document.fonts.ready:Promise.resolve()).then(moveInd); moveInd();

/* ---------- 12. Detail hero: product follows pointer ---------- */
function tickDetail(now){
  if(!dState||reduce)return; const s=dState.prod&&dState.prod.firstElementChild; if(!s)return;
  s.style.transform=`perspective(900px) rotateX(${(-fxm.y*16).toFixed(2)}deg) rotateY(${(fxm.x*22).toFixed(2)}deg) translate(${(fxm.x*24).toFixed(1)}px,${(Math.sin(now/900)*10+fxm.y*16).toFixed(1)}px)`;
}

/* ---------- master fx loop ---------- */
function fxLoop(now){
  const tx=pIn?PX/VW-.5:0, ty=pIn?PY/VH-.5:0; fxm.x=lerp(fxm.x,tx,.07); fxm.y=lerp(fxm.y,ty,.07);
  tickCursor(); tickMag();
  if(!detail.classList.contains('ready')){
    drawGL(now); tickTitle(now); tickWorldImgs(); tickSystem(); tickSkew(); tickMapIdle(now);
    if(wcImg&&!reduce)wcImg.style.translate=`${(fxm.x*-22).toFixed(1)}px ${(fxm.y*-14).toFixed(1)}px`;
    const H=document.documentElement.scrollHeight-VH; sprog.style.transform=`scaleX(${(H>0?scrollY/H:0).toFixed(4)})`;
  } else tickDetail(now);
  requestAnimationFrame(fxLoop);
}
addEventListener('resize',()=>{sizeGL();if(chPos.length)measureChs()});
sizeGL(); requestAnimationFrame(fxLoop);

window.__site={map,openCard,openDetail,closeDetail,holdY};
})();
