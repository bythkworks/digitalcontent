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
  {k:'CH.01',t:'AI가 공간으로 들어옵니다',d:'2031년, 소형 MCU가 탑재된 AI는 개인 기기와 일상 공간 곳곳에서 작동하기 시작했습니다.',m:'orb',pal:'dusk'},
  {k:'CH.02',t:'공간이 상황을 읽습니다',d:'벤치와 조명, 길과 무대가 스스로 주변의 소리와 붐빔을 느끼고 지금의 분위기를 이해합니다.',m:'waves',pal:'day'},
  {k:'CH.03',t:'AI가 나를 이해합니다',d:'AI는 나의 취향과 컨디션을 기억해, 필요한 순간에만 조용히 말을 겁니다.',m:'person',pal:'lav'},
  {k:'CH.04',t:'일상을 함께 만들어 갑니다',d:'개인과 공간, 운영자가 연결되어 모두에게 조금 더 편안한 하루를 함께 만들어 갑니다.',m:'network',pal:'peach'},
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
// ▼ 조원 3명의 제품 — 이름·장소·설명이 정해지면 이 배열만 고치면 됩니다.
//   at: 지도 좌표 [x, y, 지면 높이] — 제품 아이템이 떠 있을 위치 (입구 → 운동장 동선 위)
const TBD='내용 입력 필요';
const PRODUCTS=[
 {n:1,name:'KNOBLE',model:'KNOBLE',place:'입구',cat:'personal',kind:'band',at:[766,572,-4],one:'지금의 나를, 손끝으로',
  url:'PRODUCT01/index.html'},   // 개인 제품 페이지 (PRODUCT01/ 폴더)
 {n:2,name:'PATH GUARD',model:'PATHGUARD',place:'광장',cat:'space',kind:'light',at:[520,471,4],url:'PRODUCT02/index.html'},
 {n:3,name:'FLOWAY',model:'FLOWAY',place:'운동장',cat:'operator',kind:'pod',at:[646,338,0],url:'PRODUCT03/index.html'}
].map(p=>Object.assign({one:'한 줄 소개 — '+TBD,problem:TBD,points:[TBD,TBD,TBD],
  steps:[['단계 1',TBD],['단계 2',TBD],['단계 3',TBD],['단계 4',TBD]],sda:[TBD,TBD,TBD],
  feat:[['기능 1',TBD],['기능 2',TBD],['기능 3',TBD],['기능 4',TBD]],b:[p.at[0]-10,p.at[1]-10,20,20,p.at[2]]},p));
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


const intro={el:$('#intro'),p:0,t:0};
const iTitle=$('#introTitle'),veil=$('#veil'),hint=$('#scrollHint'),introStage=$('#intro .stage');
hint.addEventListener('animationend',()=>{hint.classList.remove('fade-up');hint.style.opacity=(1-range(intro.p,0,.05)).toFixed(3)});
const copyEls=[...$('#introCopy > div').children];
const FLY_DIR=-1;     // 타이틀이 빠져나가는 방향 (비행 선회 방향과 같게: 화면이 오른쪽으로 넘어간다)

/* 첫 화면 → 비행 전환. 하늘·구름·축제 공간은 window.__flight (아래 별도 스크립트) 가 그린다 */
function renderIntro(p){
  const flat=reduce||!(window.__flight&&window.__flight.gl);
  const tOut=range(p,.015,.15);
  iTitle.style.transform=flat?`scale(${1+.15*eOut(tOut)})`:`translateX(${(FLY_DIR*VW*.05*eIn(tOut)).toFixed(1)}px) scale(${(1+1.25*eIn(tOut)).toFixed(4)})`;
  iTitle.style.opacity=(1-tOut).toFixed(3);
  iTitle.style.filter=tOut>0?`blur(${(10*tOut).toFixed(2)}px)`:'none';
  iTitle.style.visibility=p>.16?'hidden':'visible';
  hint.style.opacity=(1-range(p,0,.05)).toFixed(3);
  const ob=(introStage.classList.contains('has-gl')?.18:.45)*(1-range(p,.03,.22));
  $$('#intro .orb').forEach(o=>o.style.opacity=ob.toFixed(3));
  veil.style.opacity=range(p,.84,.94).toFixed(3);
  copyEls.forEach((el,i)=>{const c=eOut(range(p,.86+i*.03,.95+i*.03));el.style.opacity=c.toFixed(3);el.style.transform=`translateY(${(24*(1-c)).toFixed(1)}px)`;el.style.filter=c<1?`blur(${(6*(1-c)).toFixed(2)}px)`:'none'});
  particles.level=0; particles.r=0; particles.burst=0;     // 원형 포털 주변 입자는 쓰지 않는다 (커서·클릭 입자는 그대로)
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
const waHead=$('#waHead'), waCopy=$('#waCopy'), waDeck=$('#waDeck'), waProg=$('#waProg'); const waBg=$('#waBg');

const SYS_LEAD='MCUAI는 상황을 감지하고 맥락을 판단해 필요한 안내와 대응을 제공합니다.';
function waSys(i){const a=i-1, st=SYS.map((s,k)=>`<span class="${a<0||k===a?'on':''}">${s.k} ${s.t}</span>`).join('<em></em>');
  return `<div class="wa-sys"><div class="wa-steps">${st}</div>${a<0?`<h4>${SYS_LEAD}</h4>`:`<h4>${SYS[a].h}</h4><div class="wa-chips">${SYS[a].c.map(x=>`<span>${x}</span>`).join('')}</div>`}</div>`}
CHAPTERS.forEach((c,i)=>{
  waCopy.insertAdjacentHTML('beforeend',`<div class="wa-c" aria-hidden="${i?'true':'false'}"><b class="wa-num" aria-hidden="true">0${i+1}</b><small>${c.k}</small><h3>${c.t}</h3><p>${c.d}</p></div>`);
  waDeck.insertAdjacentHTML('beforeend',`<div class="wa-card">${WORLD_ART[i+1]}<span class="wa-chip">${c.k}</span></div>`);
  waBg.insertAdjacentHTML('beforeend',`<div class="wa-bi">${WORLD_ART[i+1]}</div>`);
  waProg.insertAdjacentHTML('beforeend',`<button data-wch="${i}" aria-label="${c.k} ${c.t}">${WORLD_ART[i+1]}<span>${c.k}</span></button>`);
});
$$('#waProg .world-art').forEach(im=>im.remove());
// Apple-style feature list: pills on the left, the active one opens into a card
$('#wfList').innerHTML=CHAPTERS.map((c,i)=>`<button type="button" class="wf-pill" data-i="${i}" aria-expanded="false"><span class="wf-hw"><span class="wf-clip"><span class="wf-head"><i class="wf-ic" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></i>${c.t}</span></span></span><span class="wf-bw"><span class="wf-clip"><span class="wf-body"><b>${c.t}.</b> ${c.d}</span></span></span></button>`).join('');$$('#waBg .world-art').forEach(im=>{im.alt=''});
const waCs=$$('.wa-c'), waCards=$$('.wa-card'), waBtns=$$('#waProg button');
const waFeat=$('#waFeat'), wfPills=$$('.wf-pill');
function wfMeasure(){wfPills.forEach(p=>{const h=p.querySelector('.wf-head');p.style.setProperty('--pw',(Math.ceil(h.getBoundingClientRect().width)+2)+'px')})}
wfMeasure();addEventListener('resize',wfMeasure);(document.fonts?document.fonts.ready:Promise.resolve()).then(wfMeasure);
wfPills.forEach(p=>p.addEventListener('click',()=>scrollToY(holdY('world-a',+p.dataset.i+1))));
const waBis=$$('.wa-bi'), waBimg=waBis.map(b=>b.firstElementChild);
// scattered (intro) poses: [x%, y%, zpx, rotY, rotZ, scale]
const WA_SC=[[-34,-40,-300,22,-8,.6],[40,-50,-560,-12,7,.5],[-52,44,-420,16,9,.52],[44,42,-180,-18,-6,.62]];
const WA_SCM=[[-26,-20,-260,16,-6,.6],[30,-26,-420,-10,6,.52],[-30,30,-360,12,7,.52],[28,26,-160,-12,-5,.62]];
function renderWorldA(p){
  const s=clamp((p-.24)/.62)*3, act=Math.min(3,Math.round(s));
  if(act!==worldA.act){worldA.act=act;waBtns.forEach((b,i)=>b.classList.toggle('on',i===act));waCs.forEach((c,i)=>c.setAttribute('aria-hidden',i===act?'false':'true'));chBtns.forEach((b,i)=>b.classList.toggle('on',i===act));wfPills.forEach((b,i)=>{b.classList.toggle('on',i===act);b.setAttribute('aria-expanded',String(i===act))})}
  waProg.classList.toggle('show',p>.2&&p<.93);
}
function tickWorld(now){
  const el=worldA.el,top=el.offsetTop; if(scrollY+VH<top-10||scrollY>top+el.offsetHeight)return;
  const p=worldA.p, t=now/1000, mob=VW<700, g=eIO(range(p,.1,.22)), sT=clamp((p-.24)/.62)*3;
  const dt=Math.min(3,(now-(worldA.lt||now))/16.7)||1; worldA.lt=now;
  if(worldA.ss===undefined||Math.abs(sT-worldA.ss)>2.5){worldA.ss=sT;worldA.sv=0}
  {const prev=worldA.ss;worldA.ss+=(sT-worldA.ss)*(1-Math.pow(1-.13,dt));if(Math.abs(sT-worldA.ss)<.0015)worldA.ss=sT;worldA.sv=(worldA.ss-prev)/dt}
  const s=reduce?sT:worldA.ss, sv=reduce?0:worldA.sv, jel=clamp(sv*9,-1,1);
  // heading: big statement → small header (desktop) / fades (mobile)
  const SC=mob?WA_SCM:WA_SC, tx=tilt.x, ty=tilt.y;
  const H=waHead.offsetHeight;
  const ex=eIO(range(contextVision.getBoundingClientRect().top/VH,.72,.20)), hg=eIO(range(p,.1,.17));
  waHead.style.opacity=(1-hg).toFixed(3);waHead.style.transform=`translateY(${(-H/2-hg*60).toFixed(1)}px) scale(${(1-hg*.06).toFixed(4)})`;waHead.style.filter=hg>.01?`blur(${(hg*8).toFixed(2)}px)`:'none';
  // full-bleed cinematic background: grows out of the front card, then wipes chapter to chapter
  {const r=waDeck.getBoundingClientRect(), gi=1-g, rad=30*gi;
   const ins=`inset(${(r.top*gi).toFixed(1)}px ${((VW-r.right)*gi).toFixed(1)}px ${((VH-r.bottom)*gi).toFixed(1)}px ${(r.left*gi).toFixed(1)}px round ${rad.toFixed(1)}px)`;
   waBg.style.clipPath=g>=1?'none':ins; waBg.style.opacity=(g>0?1:0)*(1-ex);
   worldA.el.classList.toggle('wa-cine',g>.35);
   waBis.forEach((b,k)=>{const d=s-k, ad=Math.abs(d), o=k===0&&d<0?1:eIO(clamp(1-(ad-.18)*1.9));
     if(o<=.002){b.style.visibility='hidden';return} b.style.visibility='visible';
     const sc=1.04+.06*Math.min(1,ad), ty=-d*2.5, br=1;
     b.style.clipPath='none'; b.style.opacity=o.toFixed(3); b.style.zIndex=10+Math.round((1-ad)*10);
     waBimg[k].style.transform=`translate(${(-tx*14).toFixed(1)}px,calc(${ty.toFixed(2)}% + ${(-tilt.y*10).toFixed(1)}px)) scale(${(sc+Math.sin(t*.25+k)*.01).toFixed(4)})`;
     b.style.filter=br<.995?`brightness(${br.toFixed(3)})`:'none'});}
  // copy per chapter
  {const fo=eIO(range(p,.17,.25))*(1-ex);waFeat.style.opacity=fo.toFixed(3);waFeat.style.visibility=fo>.01?'visible':'hidden';waFeat.style.pointerEvents=fo>.5?'auto':'none';
   waFeat.style.transform=`translateY(calc(${mob?'0px':'-50%'} + ${((1-fo)*30).toFixed(1)}px))`}
  waCs.forEach((c,k)=>{const d=s-k,ad=Math.abs(d),o=clamp(1-ad*2.4)*eIO(range(p,.17,.25))*(1-ex);
    c.style.opacity=o.toFixed(3);
    c.style.transform=`translateY(calc(${mob?'0%':'-50%'} + ${(-d*50).toFixed(1)}px)) skewY(${(-jel*2.2).toFixed(2)}deg)`;
    const nm=c.firstElementChild; if(nm)nm.style.transform=`translateY(${(-d*36).toFixed(1)}px) scale(${(1+Math.abs(jel)*.06).toFixed(3)},${(1-Math.abs(jel)*.08).toFixed(3)})`;
    c.style.filter=ad>.004?`blur(${Math.min(10,ad*16).toFixed(2)}px)`:'none'});
  // deck

  waDeck.style.transform=`rotateX(${(-ty*6).toFixed(2)}deg) rotateY(${(tx*8).toFixed(2)}deg)`;
  waCards.forEach((c,k)=>{
    const d=k-s; let x,y,z,rx=0,ry,rz,sc,o,br;
    if(d<0){const a=clamp(-d);x=a*28;y=-a*42;z=-a*120;rx=a*22;ry=-a*18;rz=a*9;sc=1-.08*a;o=1-a;br=1}
    else{x=d*7;y=-d*6.5;z=-d*150;ry=-d*4;rz=d*2.4;sc=1;o=d<=2.2?1:clamp(3.2-d);br=1-.1*Math.min(d,3)}
    if(g<1){const q=SC[k],w=1-g,wob=Math.sin(t*.9+k*1.7)*2.2*w;
      x=lerp(q[0],x,g);y=lerp(q[1],y,g)+wob;z=lerp(q[2],z,g);ry=lerp(q[3],ry,g);rz=lerp(q[4],rz,g)+Math.cos(t*.7+k)*1.4*w;sc=lerp(q[5],sc,g);o=lerp(1,o,g);br=lerp(1,br,g)}
    c.style.transform=`translate(${x.toFixed(2)}%,${y.toFixed(2)}%) translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    if(g>=1&&Math.abs(d)<1){const q=1-Math.abs(d);rz+=jel*4*q;sc*=1+Math.abs(jel)*.03*q;y+=jel*3*q}
    c.style.transform=`translate(${x.toFixed(2)}%,${y.toFixed(2)}%) translateZ(${z.toFixed(1)}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${sc.toFixed(4)})`;
    c.style.opacity=(o*(1-g)).toFixed(3); c.style.visibility=g>=1?'hidden':'visible'; c.style.filter=br<.995?`brightness(${br.toFixed(3)})`:'none';
    c.style.zIndex=d<0&&g>=1?(d>-1?40:20):Math.round(30+z/40);
  });
}
waBtns.forEach(b=>b.addEventListener('click',()=>scrollToY(holdY('world-a',+b.dataset.wch+1))));
/* ---- nav dropdowns: jump straight to a WORLD chapter or a product on the map ---- */
{const PCOL=['#9CC8E2','#B8B6E5','#E8B0DD'];
 const WW=['ENTER','SENSE','UNDERSTAND','TOGETHER'];
 $('#ddWorld').innerHTML='<div class="dd-in">'+CHAPTERS.map((c,i)=>`<button type="button" data-jw="${i}" title="${c.t}"><b>0${i+1}</b><span>${WW[i]}</span></button>`).join('')
   +'<hr><button type="button" data-jx="context-vision"><b>05</b><span>EPILOGUE</span></button><button type="button" data-jx="turn"><b>06</b><span>QUESTION</span></button></div>';
 $('#ddProj').innerHTML='<div class="dd-in">'+PRODUCTS.map((p,i)=>`<button type="button" data-jp="${p.n}"><i style="--c:${PCOL[i]}"></i><span>${p.name}</span></button>`).join('')
   +'<hr><button type="button" data-jp="0"><i class="all"></i><span>FULL MAP</span></button></div>';
 $$('.nav-dd').forEach(dd=>dd.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.preventDefault();
   const x=b.dataset.jx, y=b.dataset.jw!=null?holdY('world-a',+b.dataset.jw+1):x==='turn'?holdY('turn',1):x?holdY(x,0):holdY('projects',+b.dataset.jp);
   jumpTo(y);
   const li=dd.closest('li');li.classList.add('dd-off');b.blur();setTimeout(()=>li.classList.remove('dd-off'),600)}));}
chBtns.forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.ch;const el=worldA.el;const top=el.offsetTop, h=el.offsetHeight-VH;scrollToY(holdY('world-a',i+1))}));

/* ======================= WORLD C · CONNECTED VISION ======================= */
// 화면은 context-vision 스크립트(메인 스크립트 끝)가 그린다. 이전 AI 대화 장면: _modules/ai-chat-epilogue
const contextVision=$('#context-vision');

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
const MAP_ROT=70;
const map={rot:MAP_ROT,tilt:56,zoom:1,base:1,tx:0,ty:0, cur:{rot:MAP_ROT,tilt:56,zoom:1,tx:0,ty:0}, sel:null, hover:null};
function box(x,y,w,d,h,cls=''){
  return `<div class="shadow" style="left:${x+8}px;top:${y+10}px;width:${w+h*.35}px;height:${d+h*.25}px"></div>
<div class="bx ${cls}" style="left:${x}px;top:${y}px;width:${w}px;height:${d}px">
<div class="face n" style="width:${w}px;height:${h}px;transform:translate3d(0,0,${h}px) rotateX(-90deg)"></div>
<div class="face w" style="width:${h}px;height:${d}px;transform:translate3d(0,0,${h}px) rotateY(90deg)"></div>
<div class="face s" style="width:${w}px;height:${h}px;transform:translate3d(0,${d}px,${h}px) rotateX(-90deg)">${cls.includes('prod')?`<div class="win" style="left:${w*.18}px;top:${h*.3}px;width:${w*.64}px;height:${Math.max(8,h*.22)}px"></div>`:''}</div>
<div class="face e" style="width:${h}px;height:${d}px;transform:translate3d(${w}px,0,${h}px) rotateY(90deg)">${cls.includes('prod')?`<div class="win" style="left:${h*.3}px;top:${d*.2}px;width:${Math.max(8,h*.22)}px;height:${d*.6}px"></div>`:''}</div>
<div class="face t" style="width:${w}px;height:${d}px;transform:translateZ(${h}px)"></div></div>`;
}
let mh='';
PRODUCTS.forEach(p=>{const [x,y,w,d,h]=p.b;mh+=`<div class="pin" data-n="${p.n}" style="left:${x+w/2}px;top:${y+d/2}px;--h:${h}" tabindex="0" role="button" aria-label="${p.n}번 ${p.name}, ${p.place}"><div class="pi"><span class="tip">${p.place} · ${p.name}</span><span class="head">${p.n}</span><span class="stem"></span></div></div>`});
world.innerHTML=mh;
/* ---- WebGL campus model, toon-shaded (two-tone light, lavender shade, crisp sun shadows) ---- */
let MGL=null;
const TOON_SUN=(()=>{const v=[-.5,-.36,.8],l=Math.hypot(...v);return v.map(c=>c/l)})();   // toward the sun (map x east, y south, z up)
(function initMapGL(){
  if(typeof MAP_B64==='undefined')return;
  const cv=document.createElement('canvas');cv.className='map-gl';cv.setAttribute('aria-hidden','true');mstage.insertBefore(cv,world);
  const g=cv.getContext('webgl',{antialias:true,alpha:true,premultipliedAlpha:true}); if(!g){cv.remove();return}
  const der=g.getExtension('OES_standard_derivatives');
  const L=TOON_SUN, U=(()=>{const c=[L[1]*0-0*L[2],0*L[0]-L[0]*1,L[0]*0-L[1]*0];const u=[-L[1],L[0],0],n=Math.hypot(...u);return u.map(x=>x/n)})();
  const V=[L[1]*U[2]-L[2]*U[1],L[2]*U[0]-L[0]*U[2],L[0]*U[1]-L[1]*U[0]];
  const LS=`uniform vec3 uL,uU,uV;
vec3 lsp(vec3 p){p-=vec3(500.,500.,0.);return vec3(dot(p,uU)/1150.,dot(p,uV)/1150.,.5-dot(p,uL)/4000.);}`;
  // shadow pass
  const svs=`attribute vec4 a;${LS}varying float vD;void main(){vec3 s=lsp(a.xyz/16.);vD=s.z;gl_Position=vec4(s.xy,s.z*2.-1.,1.);}`;
  const sfs=`precision highp float;varying float vD;void main(){vec4 e=fract(vD*vec4(1.,255.,65025.,16581375.));e-=e.yzww*vec4(1./255.,1./255.,1./255.,0.);gl_FragColor=e;}`;
  // main pass
  const vs=`attribute vec4 a;uniform mat4 uM;varying vec3 vP;varying float vCat;void main(){vec3 p=a.xyz/16.;vP=p;vCat=a.w;gl_Position=uM*vec4(p,1.);}`;
  const fs=`${der?'#extension GL_OES_standard_derivatives : enable\n':''}precision highp float;
varying vec3 vP;varying float vCat;uniform vec3 uView,uHL,uCam;uniform float uFog,uTime,uMaskOn,uNight,uLed;uniform sampler2D uMask;uniform sampler2D uSh;uniform float uTx;${LS}
float unpack(vec4 c){return dot(c,vec4(1.,1./255.,1./65025.,1./16581375.));}
float shadowAt(vec3 s,float bias){float lit=0.;
  for(int i=0;i<4;i++){vec2 o=vec2(mod(float(i),2.)-.5,floor(float(i)/2.)-.5)*uTx*1.2;lit+=step(s.z-bias,unpack(texture2D(uSh,s.xy*.5+.5+o)));}
  return lit*.25;}
void main(){
${der?'vec3 n=normalize(cross(dFdx(vP),dFdy(vP)));if(dot(n,uCam-vP)<0.)n=-n;':'vec3 n=vec3(0.,0.,1.);'}
  float ndl=dot(n,uL);
  vec3 s=lsp(vP);
  float sh=ndl>0.?shadowAt(s,.00035+.0012*(1.-ndl)):0.;
  float lit=smoothstep(.04,.1,ndl)*smoothstep(.35,.65,sh);
  float hi=smoothstep(.62,.7,ndl)*lit;
  vec3 cL,cS; float emi=0.; vec3 ecol=vec3(0.);
  if(vCat<.5){
    float hill=smoothstep(2.,16.,vP.z);
    cL=mix(vec3(.985,.955,.955),vec3(.90,.96,.91),hill);cS=mix(vec3(.86,.84,.955),vec3(.70,.80,.90),hill);
    vec2 mu=(vP.xy+100.)/1200.; vec4 mk=uMaskOn>.5&&mu.x>0.&&mu.y>0.&&mu.x<1.&&mu.y<1.?texture2D(uMask,mu):vec4(0.,0.,0.,1.);
    // paving: soft tile grid
    vec2 tf=fract(vP.xy/7.),te=min(tf,1.-tf);float grout=(1.-smoothstep(0.,.05,min(te.x,te.y)))*(1.-mk.r)*(1.-mk.g);
    float tv=fract(sin(dot(floor(vP.xy/7.),vec2(12.9898,78.233)))*43758.5453);
    cL*=1.-.025*tv;cS*=1.-.02*tv;cL=mix(cL,cL*.93,grout*.6);cS=mix(cS,cS*.95,grout*.5);
    // asphalt
    float asp=smoothstep(.3,.7,mk.r);
    cL=mix(cL,vec3(.80,.78,.89),asp);cS=mix(cS,vec3(.63,.61,.80),asp);
    // grass / turf (striped inside the playground)
    float gr=smoothstep(.35,.65,mk.g);
    float field=step(550.,vP.x)*step(vP.x,702.)*step(186.,vP.y)*step(vP.y,438.);
    float stripe=step(.5,fract(vP.x/12.));
    float court=step(580.,vP.x)*step(vP.x,676.)*step(269.,vP.y)*step(vP.y,339.);
    float grain=fract(sin(dot(floor(vP.xy*1.3),vec2(12.9898,78.233)))*43758.5453);
    vec3 sandL=vec3(.995,.915,.82)*(1.-.03*grain), sandS=vec3(.87,.78,.84)*(1.-.025*grain);
    vec3 tfL=mix(vec3(.78,.93,.82),vec3(.84,.96,.86),stripe), tfS=mix(vec3(.58,.77,.79),vec3(.64,.81,.82),stripe);
    vec3 gL=mix(vec3(.83,.95,.83),sandL,field), gS=mix(vec3(.62,.80,.80),sandS,field);
    cL=mix(cL,gL,gr);cS=mix(cS,gS,gr);
    // walkway + white paint
    float paint=smoothstep(.78,.95,mk.b), walk=smoothstep(.3,.45,mk.b)*(1.-paint);
    cL=mix(cL,vec3(1.,.95,.90),walk);cS=mix(cS,vec3(.90,.84,.93),walk);
    cL=mix(cL,vec3(1.),paint*.9);cS=mix(cS,vec3(.92,.91,1.),paint*.85);
    // ambient occlusion near buildings
    float ao=mix(.80,1.,mk.a);cL*=ao;cS*=mix(.86,1.,mk.a);
  }else if(vCat<1.5||vCat>14.5){
    float h=clamp(vP.z/140.,0.,1.);
    cL=mix(vec3(1.,.968,.955),vec3(1.,.94,.95),h);cS=mix(vec3(.79,.775,.94),vec3(.84,.78,.94),h);
    if(n.z>.7){cL=vec3(1.,.985,.975);cS=vec3(.86,.84,.965);}
  }else if(vCat<2.5){cL=vec3(1.,1.,1.);cS=vec3(.90,.90,.99);}
  else if(vCat<3.5){
    float tv=fract(sin(dot(floor(vP.xy/5.),vec2(12.9898,78.233)))*43758.5453);
    float top=smoothstep(10.,40.,vP.z);
    cL=mix(vec3(.74,.92,.80),vec3(.84,.96,.84),tv*.6+top*.4);cS=mix(vec3(.54,.76,.78),vec3(.62,.82,.80),tv*.6);
    if(vP.z<8.){cL=vec3(.86,.78,.86);cS=vec3(.70,.64,.84);}
  }
  else if(vCat<5.5){float st=step(.5,fract((vP.x+vP.y)/6.));cL=mix(vec3(1.,.99,.99),vec3(.99,.84,.92),st*step(.7,n.z));cS=mix(vec3(.86,.85,.97),vec3(.85,.74,.92),st*step(.7,n.z));}
  else if(vCat<6.5){cL=vec3(.93,.86,1.);cS=vec3(.74,.68,.92);}
  else if(vCat<7.5){cL=vec3(1.,.88,.78);cS=vec3(.88,.74,.86);}
  else if(vCat<8.5){ // audience chairs: rows alternate lavender / peach
    float row=step(.5,fract(vP.y/4.4));cL=mix(vec3(.80,.78,1.),vec3(1.,.84,.80),row);cS=mix(vec3(.60,.58,.88),vec3(.84,.66,.80),row);}
  else if(vCat<9.5){cL=vec3(.78,.77,.88);cS=vec3(.52,.51,.68);}          // truss
  else if(vCat<10.5){cL=vec3(.42,.40,.56);cS=vec3(.30,.28,.44);}         // speakers / fixtures
  else if(vCat<11.5||(vCat>12.5&&vCat<13.5)){                           // LED screens
    float u=(vP.x-603.)/46., v=(vP.z-9.)/24.;
    float w=sin(u*7.+uTime*1.3)*.5+.5, w2=sin(v*5.-uTime*.9+u*3.)*.5+.5;
    vec3 a=mix(vec3(.55,.75,1.),vec3(1.,.55,.85),w), b=mix(vec3(.75,.6,1.),vec3(1.,.85,.6),w2);
    ecol=mix(a,b,.5+.5*sin(uTime*.4));
    float bars=step(fract(u*24.),.72)*step(v,.18+.5*abs(sin(floor(u*24.)*1.7+uTime*2.6)));
    ecol=mix(ecol,vec3(1.),bars*.55*step(vCat,11.5));
    float px=step(.12,fract(u*120.))*step(.12,fract(v*60.));ecol*=.82+.18*px;
    emi=1.;cL=cS=ecol;}
  else if(vCat<12.5){cL=vec3(.52,.48,.66);cS=vec3(.38,.35,.52);}         // stage deck
  else {cL=vec3(1.,.99,1.);cS=vec3(.88,.87,.98);}                        // canopy membrane
  vec3 col=mix(cS,cL,lit);
  col=mix(col,vec3(1.,.93,.86),hi*.35*(1.-emi));
  float gold=sin(3.1416*clamp(uNight*1.6,0.,1.))*(1.-uNight);
  col*=mix(vec3(1.),vec3(1.06,.93,.90),gold*.8);
  col=mix(col,col*vec3(.34,.32,.56)+vec3(.015,.01,.05),uNight*.88);
  float sd=length(vP.xy-vec2(626.,268.));col+=vec3(.55,.30,.62)*exp(-sd/38.)*uNight*.55*step(vP.z,20.);
  col=mix(col,ecol*uLed,emi);
  float hl=uHL.z*(1.-smoothstep(36.,100.,length(vP.xy-uHL.xy)));
  col=mix(col,mix(vec3(.74,.84,.97),vec3(.95,.76,.91),clamp(vP.z/80.,0.,1.)),hl*(vCat<.5?.5:.62));
  col=mix(col,mix(vec3(.975,.935,.955),vec3(.24,.20,.40),uNight),smoothstep(240.,1100.,length(uCam-vP))*.8*uFog);
  float r=length(vP.xy-500.);
  col=mix(col,vec3(.975,.91,.94),smoothstep(380.,700.,r)*.55);
  float al=1.-smoothstep(560.,780.,r);gl_FragColor=vec4(col*al,al);}`;
  const mk=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS)){console.warn(g.getShaderInfoLog(o));return null}return o};
  const link=(a,b)=>{const v=mk(g.VERTEX_SHADER,a),f=mk(g.FRAGMENT_SHADER,b);if(!v||!f)return null;const p=g.createProgram();g.attachShader(p,v);g.attachShader(p,f);g.linkProgram(p);return g.getProgramParameter(p,g.LINK_STATUS)?p:null};
  const pr=link(vs,fs), sp=link(svs,sfs); if(!pr||!sp){cv.remove();return}
  const dec=s=>{const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u.buffer};
  const vb=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,vb);g.bufferData(g.ARRAY_BUFFER,new Int16Array(dec(MAP_B64.v)),g.STATIC_DRAW);
  const idx=new Uint16Array(dec(MAP_B64.i));const ib=g.createBuffer();g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,ib);g.bufferData(g.ELEMENT_ARRAY_BUFFER,idx,g.STATIC_DRAW);
  // bake the sun's shadow map once (the scene and sun never move)
  const SZ=Math.min(2048,g.getParameter(g.MAX_TEXTURE_SIZE));
  const tex=g.createTexture();g.bindTexture(g.TEXTURE_2D,tex);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,SZ,SZ,0,g.RGBA,g.UNSIGNED_BYTE,null);
  [g.TEXTURE_MIN_FILTER,g.TEXTURE_MAG_FILTER].forEach(k=>g.texParameteri(g.TEXTURE_2D,k,g.NEAREST));
  [g.TEXTURE_WRAP_S,g.TEXTURE_WRAP_T].forEach(k=>g.texParameteri(g.TEXTURE_2D,k,g.CLAMP_TO_EDGE));
  const fb=g.createFramebuffer(),rb=g.createRenderbuffer();g.bindRenderbuffer(g.RENDERBUFFER,rb);g.renderbufferStorage(g.RENDERBUFFER,g.DEPTH_COMPONENT16,SZ,SZ);
  g.bindFramebuffer(g.FRAMEBUFFER,fb);g.framebufferTexture2D(g.FRAMEBUFFER,g.COLOR_ATTACHMENT0,g.TEXTURE_2D,tex,0);g.framebufferRenderbuffer(g.FRAMEBUFFER,g.DEPTH_ATTACHMENT,g.RENDERBUFFER,rb);
  g.viewport(0,0,SZ,SZ);g.clearColor(1,1,1,1);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.enable(g.DEPTH_TEST);g.disable(g.CULL_FACE);
  g.useProgram(sp);const sl=g.getAttribLocation(sp,'a');g.enableVertexAttribArray(sl);g.vertexAttribPointer(sl,4,g.SHORT,false,0,0);
  g.uniform3fv(g.getUniformLocation(sp,'uL'),L);g.uniform3fv(g.getUniformLocation(sp,'uU'),U);g.uniform3fv(g.getUniformLocation(sp,'uV'),V);
  g.drawElements(g.TRIANGLES,idx.length,g.UNSIGNED_SHORT,0);g.bindFramebuffer(g.FRAMEBUFFER,null);
  const u={};['uM','uCam','uFog','uTime','uMaskOn','uMask','uNight','uLed','uView','uHL','uSh','uTx','uL','uU','uV'].forEach(k=>u[k]=g.getUniformLocation(pr,k));
  g.useProgram(pr);g.uniform3fv(u.uL,L);g.uniform3fv(u.uU,U);g.uniform3fv(u.uV,V);g.uniform1i(u.uSh,0);g.uniform1f(u.uTx,1/SZ);
  MGL={g,cv,pr,vb,ib,tex,n:idx.length,u,loc:g.getAttribLocation(pr,'a'),hl:0,hx:500,hy:500,w:1,h:1,mask:null};
  g.uniform1i(u.uMask,1);
  if(typeof MAP_MASK!=='undefined'){const im=new Image();im.onload=()=>{const t=g.createTexture();g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,t);
    g.pixelStorei(g.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,im);
    [g.TEXTURE_MIN_FILTER,g.TEXTURE_MAG_FILTER].forEach(k=>g.texParameteri(g.TEXTURE_2D,k,g.LINEAR));[g.TEXTURE_WRAP_S,g.TEXTURE_WRAP_T].forEach(k=>g.texParameteri(g.TEXTURE_2D,k,g.CLAMP_TO_EDGE));
    g.activeTexture(g.TEXTURE0);MGL.mask=t;map.dirty=true};im.src=MAP_MASK}
})();
function sizeMapGL(w,h){if(!MGL)return;const d=Math.min(devicePixelRatio||1,1.5);MGL.w=w;MGL.h=h;MGL.cv.width=Math.round(w*d);MGL.cv.height=Math.round(h*d)}
/* ======================= FIRST-PERSON WALK · entrance → 운동장 ======================= */
// walk path (map px; x east, y south, z up), sampled every 4 units with ground height
const FP_PATH=[[787.0,501.0,-1.1],[786.4,505.0,-1.2],[785.8,508.9,-1.4],[785.1,512.9,-1.5],[784.5,516.8,-1.6],[783.9,520.8,-1.8],[783.3,524.7,-1.9],[782.7,528.7,-2.1],[782.1,532.6,-2.3],[781.4,536.6,-2.4],[780.2,540.4,-2.6],[778.8,544.1,-2.8],[776.8,547.6,-2.9],[774.7,551.0,-3.0],[772.0,553.9,-3.1],[769.3,556.9,-3.2],[766.2,559.4,-3.3],[763.0,561.8,-3.4],[759.6,563.8,-3.4],[756.1,565.8,-3.4],[752.5,567.5,-3.4],[748.8,569.0,-3.4],[745.1,570.5,-3.3],[741.2,571.7,-3.2],[737.4,572.8,-3.0],[733.6,573.9,-2.9],[729.6,574.7,-2.7],[725.7,575.5,-2.5],[721.8,576.3,-2.2],[717.9,576.9,-1.9],[713.9,577.6,-1.6],[710.0,578.3,-1.3],[706.0,578.8,-0.9],[702.0,579.4,-0.5],[698.1,579.9,-0.1],[694.1,580.4,0.3],[690.1,580.8,0.7],[686.1,581.2,1.1],[682.2,581.5,1.6],[678.2,581.8,2.0],[674.2,582.1,2.5],[670.2,582.3,3.0],[666.2,582.4,3.4],[662.2,582.6,3.9],[658.2,582.7,4.4],[654.2,582.7,4.8],[650.2,582.7,5.3],[646.2,582.7,5.7],[642.2,582.6,6.2],[638.2,582.5,6.6],[634.2,582.3,7.0],[630.2,582.1,7.4],[626.2,581.8,7.8],[622.2,581.6,8.2],[618.2,581.3,8.6],[614.2,581.1,8.9],[610.2,580.8,9.2],[606.3,580.5,9.5],[602.3,580.3,9.8],[598.3,580.0,10.0],[594.3,579.7,10.2],[590.3,579.4,10.4],[586.3,579.1,10.5],[582.3,578.8,10.7],[578.3,578.5,10.8],[574.3,578.1,10.9],[570.4,577.8,10.9],[566.4,577.4,11.0],[562.4,577.1,11.0],[558.4,576.7,11.0],[554.4,576.4,11.0],[550.4,576.0,11.1],[546.5,575.6,11.1],[542.5,575.2,11.1],[538.5,574.7,11.1],[534.6,574.0,11.1],[530.7,572.9,11.1],[527.0,571.6,11.1],[523.4,569.7,11.1],[520.0,567.7,11.1],[517.0,565.1,11.1],[514.0,562.5,11.1],[511.6,559.3,11.1],[509.2,556.1,11.1],[507.4,552.5,11.2],[505.6,548.9,11.2],[504.3,545.1,11.1],[503.1,541.3,11.1],[502.1,537.5,11.0],[501.4,533.5,10.9],[500.8,529.6,10.7],[500.3,525.6,10.5],[500.0,521.6,10.2],[499.8,517.6,10.0],[499.7,513.6,9.7],[499.9,509.6,9.3],[500.1,505.6,8.9],[500.4,501.7,8.5],[501.1,497.7,8.1],[501.7,493.8,7.6],[502.5,489.8,7.2],[503.6,486.0,6.7],[504.7,482.2,6.2],[505.9,478.4,5.8],[507.5,474.7,5.4],[509.1,471.0,5.0],[510.7,467.3,4.6],[512.6,463.8,4.3],[514.6,460.4,4.0],[516.5,456.9,3.8],[518.9,453.6,3.5],[521.2,450.3,3.3],[523.5,447.1,3.1],[526.0,444.0,3.0],[528.6,440.9,2.8],[531.2,437.9,2.8],[533.9,435.0,2.7],[536.8,432.2,2.5],[539.7,429.4,2.4],[542.5,426.6,2.2],[545.4,423.8,2.1],[548.2,420.9,1.9],[551.0,418.1,1.7],[553.8,415.3,1.6],[556.6,412.4,1.4],[559.4,409.5,1.2],[562.2,406.6,1.0],[564.9,403.7,0.9],[567.6,400.8,0.7],[570.3,397.8,0.6],[573.0,394.9,0.5],[575.6,391.8,0.4],[578.2,388.8,0.3],[580.8,385.7,0.2],[583.2,382.6,0.2],[585.7,379.4,0.1],[588.0,376.1,0.1],[590.1,372.8,0.1],[592.2,369.4,0.0],[594.3,365.9,0.0],[596.4,362.5,0.0],[598.5,359.1,0.0],[600.6,355.7,0.0],[601.0,355.0,0.0]];
const FP_STAGE=[626,226,20];                    // stage at the north edge of the playground
const FP_EYE=7, FP_ITEM_Z=14;
// PATH GUARD: two robots on the plaza floor either side of the walkway, which becomes a temporary vehicle lane
// the truck's route (marked by the team): from the near walkway, between the two robots, on toward the stage
const TRUCK_ROUTE=[[498,494],[497.5,486],[499,476],[503,469],[507.5,454.5],[512,424],[515,380],[517,350]];
// smooth route: Catmull-Rom through the marked points, resampled by length; heading looks a little ahead so turns ease in
const TRUCK_PATH=(()=>{const R=TRUCK_ROUTE,P=[],cr=(a,b,c,d,t)=>.5*(2*b+(-a+c)*t+(2*a-5*b+4*c-d)*t*t+(-a+3*b-3*c+d)*t*t*t);
  for(let i=0;i<R.length-1;i++){const p0=R[Math.max(0,i-1)],p1=R[i],p2=R[i+1],p3=R[Math.min(R.length-1,i+2)];
    for(let k=0;k<24;k++){const t=k/24;P.push([cr(p0[0],p1[0],p2[0],p3[0],t),cr(p0[1],p1[1],p2[1],p3[1],t)])}}
  P.push(R[R.length-1]);const L=[0];for(let i=1;i<P.length;i++)L.push(L[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]));return {P,L,T:L[L.length-1]}})();
function pathPt(d){const {P,L,T}=TRUCK_PATH;d=Math.max(0,Math.min(T,d));let i=1;while(i<P.length-1&&L[i]<d)i++;const f=(d-L[i-1])/((L[i]-L[i-1])||1);return [P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f]}
function routeAt(R,u){const T=TRUCK_PATH.T,d=Math.max(0,Math.min(1,u))*T,p=pathPt(d),a=pathPt(d+9),b=pathPt(d-9),dx=a[0]-b[0],dy=a[1]-b[1],l=Math.hypot(dx,dy)||1;return [p[0],p[1],dx/l,dy/l]}
const PG_AIM_DEF=[499,475,4]; window.PG_AIM=window.PG_AIM||PG_AIM_DEF;   // PATH GUARD stop: aim so the two robots + truck sit right of the title
const PG_LANE=(()=>{const a=[493,444],b=[524,462],g=4,c=[(a[0]+b[0])/2,(a[1]+b[1])/2],w=[b[0]-a[0],b[1]-a[1]],L=Math.hypot(w[0],w[1]);
  let d=[-w[1]/L,w[0]/L]; if(d[1]>0)d=[-d[0],-d[1]];   // forward = toward the stage
  return {slots:[a,b],g,c,d,rz:Math.atan2(w[0],-w[1])}})();
const FP={yaw:0,pitch:0,yawT:0,pitchT:0,cam:[0,0,0],look:[0,0,0],fov:40,act:0,hover:0,s:0,items:[],ready:false,last:0};
(function(){let L=0;FP_PATH.forEach((q,i)=>{if(i)L+=Math.hypot(q[0]-FP_PATH[i-1][0],q[1]-FP_PATH[i-1][1]);q[3]=L});FP.L=L})();
function fpAt(s){s=clamp(s,0,FP.L);let i=1;while(i<FP_PATH.length-1&&FP_PATH[i][3]<s)i++;
  const a=FP_PATH[i-1],b=FP_PATH[i],k=(s-a[3])/Math.max(1e-6,b[3]-a[3]);return [lerp(a[0],b[0],k),lerp(a[1],b[1],k),lerp(a[2],b[2],k)]}
// stops: the walk pauses where each product floats ahead, then at the playground
function fpStops(){return PRODUCTS.map(p=>{const [x,y]=p.at;let bs=0,bd=1e9;
  for(let s=0;s<=FP.L;s+=4){const q=fpAt(s),d=Math.hypot(q[0]-x,q[1]-y);if(d<bd){bd=d;bs=s}}
  return clamp(bs-(bd<25?46:28),0,FP.L-30)})}
/* ---- tiny mat4 helpers (column-major) ---- */
const M4={
  persp(f,a,n,fa){const t=1/Math.tan(f/2);return [t/a,0,0,0, 0,t,0,0, 0,0,(fa+n)/(n-fa),-1, 0,0,2*fa*n/(n-fa),0]},
  look(e,c,u){const z=norm3(sub3(e,c)),x=norm3(cross3(u,z)),y=cross3(z,x);
    return [x[0],y[0],z[0],0, x[1],y[1],z[1],0, x[2],y[2],z[2],0, -dot3(x,e),-dot3(y,e),-dot3(z,e),1]},
  mul(a,b){const o=new Array(16);for(let i=0;i<4;i++)for(let j=0;j<4;j++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+j]*b[i*4+k];o[i*4+j]=s}return o},
  tr(x,y,z){return [1,0,0,0,0,1,0,0,0,0,1,0,x,y,z,1]},
  rz(a){const c=Math.cos(a),s=Math.sin(a);return [c,s,0,0,-s,c,0,0,0,0,1,0,0,0,0,1]},
  rx(a){const c=Math.cos(a),s=Math.sin(a);return [1,0,0,0,0,c,s,0,0,-s,c,0,0,0,0,1]},
  sc(k){return [k,0,0,0,0,k,0,0,0,0,k,0,0,0,0,1]}};
function sub3(a,b){return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]}function dot3(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function cross3(a,b){return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]]}function norm3(a){const l=Math.hypot(...a)||1;return a.map(v=>v/l)}
const FLIP=[1,0,0,0, 0,-1,0,0, 0,0,1,0, 0,0,0,1];  // map y points south: mirror so the street view matches the map
/* ---- floating product items: simple placeholder shapes (swap for real models later) ---- */
function meshTorus(R,r,a,b){const v=[];const P=(i,j)=>{const u=i/a*Math.PI*2,w=j/b*Math.PI*2;return [[(R+r*Math.cos(w))*Math.cos(u),(R+r*Math.cos(w))*Math.sin(u),r*Math.sin(w)],[Math.cos(w)*Math.cos(u),Math.cos(w)*Math.sin(u),Math.sin(w)]]};
  for(let i=0;i<a;i++)for(let j=0;j<b;j++){const q=[P(i,j),P(i+1,j),P(i+1,j+1),P(i,j+1)];[q[0],q[1],q[2],q[0],q[2],q[3]].forEach(([p,n])=>v.push(...p,...n))}return v}
function meshFlat(V,F){const v=[];F.forEach(f=>{const a=V[f[0]],b=V[f[1]],c=V[f[2]],n=norm3(cross3(sub3(b,a),sub3(c,a)));for(let k=1;k<f.length-1;k++)[f[0],f[k],f[k+1]].forEach(i=>v.push(...V[i],...n))});return v}
const MESH=[
  ()=>meshTorus(1,.36,40,16),
  ()=>meshFlat([[0,0,1.45],[1,0,0],[0,1,0],[-1,0,0],[0,-1,0],[0,0,-1.45]],[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]]),
  ()=>{const s=.85,V=[];for(const z of[-s,s])for(const y of[-s,s])for(const x of[-s,s])V.push([x,y,z]);
    return meshFlat(V,[[0,2,3,1],[4,5,7,6],[0,1,5,4],[2,6,7,3],[0,4,6,2],[1,3,7,5]])}];
const STAGE_SLOTS=[[606,246,30],[626,246,36],[646,246,30]];
const ITEM_CFG={KNOBLE:{s:4.6,tilt:1.0},PATHGUARD:{s:6.2,tilt:.12},FLOWAY:{s:6.2,tilt:.25}};
const ITEM_COL=[[[.61,.78,.89],[.86,.71,.88]],[[.72,.71,.93],[.98,.76,.86]],[[.98,.82,.70],[.76,.74,.95]]];
(function initFP(){
  if(!MGL)return; const g=MGL.g;
  const ivs=`attribute vec3 aP,aN;attribute vec4 aC;uniform mat4 uM,uW;varying vec3 vN,vW;varying vec4 vC;void main(){vec4 w=uW*vec4(aP,1.);vW=w.xyz;vN=mat3(uW)*aN;vC=aC;gl_Position=uM*w;}`;
  const ifs=`precision mediump float;varying vec3 vN,vW;varying vec4 vC;uniform vec3 uCam,uL;uniform float uGlow;
void main(){vec3 n=normalize(vN),v=normalize(uCam-vW);if(dot(n,v)<0.)n=-n;float d=dot(n,uL);float lit=smoothstep(-.05,.12,d);
vec3 base=vC.rgb;vec3 c=mix(base*vec3(.80,.78,.92),base,lit);float rim=pow(1.-abs(dot(n,v)),2.4);c+=rim*vec3(1.,.97,1.)*(.25+.35*uGlow);
c=mix(c,min(base*1.25+.12,vec3(1.)),vC.a);c+=uGlow*.06;
gl_FragColor=vec4(min(c,1.),1.);}`;
  const mk=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);return g.getShaderParameter(o,g.COMPILE_STATUS)?o:(console.warn(g.getShaderInfoLog(o)),null)};
  const p=g.createProgram();g.attachShader(p,mk(g.VERTEX_SHADER,ivs));g.attachShader(p,mk(g.FRAGMENT_SHADER,ifs));g.linkProgram(p);
  if(!g.getProgramParameter(p,g.LINK_STATUS))return;
  FP.ip=p;FP.iu={};['uM','uW','uCam','uL','uGlow'].forEach(k=>FP.iu[k]=g.getUniformLocation(p,k));FP.ia=[g.getAttribLocation(p,'aP'),g.getAttribLocation(p,'aN'),g.getAttribLocation(p,'aC')];
  const b64=t=>{const s=atob(t),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
  FP.items=PRODUCTS.map((pr,i)=>{const m=PROD_MESH[pr.model];const vb=g.createBuffer(),ib=g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER,vb);g.bufferData(g.ARRAY_BUFFER,b64(m.v),g.STATIC_DRAW);const ix=b64(m.i);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,ib);g.bufferData(g.ELEMENT_ARRAY_BUFFER,ix,g.STATIC_DRAW);
    return {vb,ib,n:ix.length/2,glow:0,scr:[-999,-999,0],z:pr.at[2]??0}});
  g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,MGL.ib);
  FP.ready=true;
  if(window.Prod3D&&window.PROD_GLB)setTimeout(()=>{try{Prod3D.init({stage:mstage,flyHost:fpStars,models:PRODUCTS.map(pr=>({key:pr.model,b64:PROD_GLB[pr.model]})),props:PROD_GLB.TRUCK?[{key:'TRUCK',b64:PROD_GLB.TRUCK,color:'#F3F1FA'}]:[]})}catch(e){console.warn('prod3d',e)}},0);
})();
/* ---- crowd in the fenced pit in front of the stage (fills up as night falls) ---- */
const PIT={x0:574,x1:662,y0:271,y1:335};
(function initCrowd(){
  if(!MGL)return;const g=MGL.g;
  const vs=`attribute vec3 aB,aO;attribute vec4 aI;uniform mat4 uM;uniform float uT,uC,uN,uH;varying vec3 vW;varying vec4 vI;
void main(){vI=aI;if(aI.z>uC){gl_Position=vec4(2.,2.,2.,1.);return;}
float ex=.25+.75*uN+uH*.9, ph=aI.x*6.2831;
float jump=max(0.,sin(uT*5.2+ph))*1.1*ex*step(.45,fract(aI.x*7.3));
float sway=sin(uT*2.1+ph)*.35*ex;
vec3 o=aO; if(aI.w>1.5){o.z+=sin(uT*3.+ph)*.5*ex;o.x+=sin(uT*3.+ph)*.4*ex;}
vec3 p=aB+o+vec3(sway*(o.z/7.),0.,jump);vW=p;gl_Position=uM*vec4(p,1.);}`;
  const fs=`#extension GL_OES_standard_derivatives : enable
precision highp float;varying vec3 vW;varying vec4 vI;uniform vec3 uL;uniform float uN;
void main(){vec3 n=normalize(cross(dFdx(vW),dFdy(vW)));if(n.z<0.&&abs(n.z)>.9)n=-n;
float k=floor(vI.y*8.+.5);
vec3 c=k<1.?vec3(.80,.78,1.):k<2.?vec3(1.,.80,.86):k<3.?vec3(.78,.92,.98):k<4.?vec3(1.,.90,.74):k<5.?vec3(.80,.94,.84):k<6.?vec3(.94,.80,.98):k<7.?vec3(.98,.97,1.):vec3(.62,.60,.82);
if(vI.w>.5&&vI.w<1.5)c=vec3(.40,.34,.50);
float lit=smoothstep(-.05,.15,dot(n,uL));c=mix(c*vec3(.78,.76,.92),c,lit);
c=mix(c,c*vec3(.36,.33,.58),uN*.85);
float rim=clamp(-n.y,0.,1.)*uN;c+=rim*vec3(.85,.45,.85)*.55;
if(vI.w>2.5){c=mix(vec3(.9,.92,1.),vec3(1.,1.,1.2),uN);}
gl_FragColor=vec4(min(c,1.),1.);}`;
  const mk=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS))console.warn(g.getShaderInfoLog(o));return o};
  const p=g.createProgram();g.attachShader(p,mk(g.VERTEX_SHADER,vs));g.attachShader(p,mk(g.FRAGMENT_SHADER,fs));g.linkProgram(p);
  if(!g.getProgramParameter(p,g.LINK_STATUS))return;
  let seed=7;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const D=[];
  const push=(b,o,inf)=>D.push(b[0],b[1],b[2],o[0],o[1],o[2],inf[0],inf[1],inf[2],inf[3]);
  const prism=(b,inf,r0,r1,z0,z1,sides,part)=>{const P=[];for(let i=0;i<sides;i++){const a=i/sides*Math.PI*2;P.push([Math.cos(a),Math.sin(a)*.72])}
    for(let i=0;i<sides;i++){const a=P[i],c=P[(i+1)%sides];const q=[[a[0]*r0,a[1]*r0,z0],[c[0]*r0,c[1]*r0,z0],[c[0]*r1,c[1]*r1,z1],[a[0]*r1,a[1]*r1,z1]];
      [q[0],q[1],q[2],q[0],q[2],q[3]].forEach(o=>push(b,o,[inf[0],inf[1],inf[2],part]))}
    for(let i=1;i<sides-1;i++)[[P[0][0]*r1,P[0][1]*r1,z1],[P[i][0]*r1,P[i][1]*r1,z1],[P[i+1][0]*r1,P[i+1][1]*r1,z1]].forEach(o=>push(b,o,[inf[0],inf[1],inf[2],part]))};
  const head=(b,inf,z,r)=>{const V=[[0,0,z+r*1.15],[r,0,z],[0,r,z],[-r,0,z],[0,-r,z],[0,0,z-r*.9]];
    [[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]].forEach(f=>f.forEach(i=>push(b,V[i],[inf[0],inf[1],inf[2],1])))};
  for(let y=PIT.y0;y<=PIT.y1;y+=2.7)for(let x=PIT.x0;x<=PIT.x1;x+=2.5){
    const front=(y-PIT.y0)/(PIT.y1-PIT.y0); if(R()>.92-front*.35)continue;
    const b=[x+(R()-.5)*1.8,y+(R()-.5)*1.8,0], hgt=.88+R()*.24, inf=[R(),Math.floor(R()*8)/8+.01,R()*.75+front*.25];
    prism(b,inf,.78*hgt,.9*hgt,0,4.9*hgt,6,0); head(b,inf,5.75*hgt,.72*hgt);
    if(R()<.32){const side=R()<.5?-1:1;prism([b[0]+side*.95*hgt,b[1],b[2]],inf,.28,.24,4.2*hgt,7.6*hgt,4,2);
      if(R()<.6){const z=7.7*hgt;[[-.35,0,z],[.35,0,z],[.35,0,z+.75],[-.35,0,z],[.35,0,z+.75],[-.35,0,z+.75]].forEach(o=>push([b[0]+side*.95*hgt,b[1]-.3,b[2]],o,[inf[0],inf[1],inf[2],3]))}}
  }
  // a few visitors around KNOBLE (entrance) and FLOWAY (playground): shows the products are for people. inf.z=-1 → always shown
  const person=(x,y,z,k)=>{const b=[x,y,z],hgt=.95+R()*.15,inf=[R(),k/8+.01,-1,0];prism(b,inf,.78*hgt,.9*hgt,0,4.9*hgt,6,0);head(b,inf,5.75*hgt,.72*hgt)};
  [['KNOBLE',[[-7,4],[8,6],[-3,-8],[11,-5],[2,12]]],['FLOWAY',[[-8,3],[7,7],[-2,-9],[10,-4],[-12,-6],[4,13]]]].forEach(([m,offs])=>{
    const pr=PRODUCTS.find(p=>p.model===m); if(!pr)return; offs.forEach(([dx,dy],i)=>person(pr.at[0]+dx,pr.at[1]+dy,pr.at[2],(i*3)%8))});
  const buf=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,buf);g.bufferData(g.ARRAY_BUFFER,new Float32Array(D),g.STATIC_DRAW);
  FP.crowd={p,buf,n:D.length/10,u:Object.fromEntries(['uM','uT','uC','uN','uL','uH'].map(k=>[k,g.getUniformLocation(p,k)])),a:['aB','aO','aI'].map(k=>g.getAttribLocation(p,k))};
})();
function drawCrowd(M,t){const C=FP.crowd;if(!C)return;const g=MGL.g;
  g.useProgram(C.p);g.uniformMatrix4fv(C.u.uM,false,new Float32Array(M));g.uniform1f(C.u.uT,t);g.uniform1f(C.u.uC,FP.crowdK);g.uniform1f(C.u.uN,FP.night||0);g.uniform1f(C.u.uH,FP.hype||0);g.uniform3fv(C.u.uL,TOON_SUN);
  g.bindBuffer(g.ARRAY_BUFFER,C.buf);C.a.forEach(a=>g.enableVertexAttribArray(a));
  g.vertexAttribPointer(C.a[0],3,g.FLOAT,false,40,0);g.vertexAttribPointer(C.a[1],3,g.FLOAT,false,40,12);g.vertexAttribPointer(C.a[2],4,g.FLOAT,false,40,24);
  g.drawArrays(g.TRIANGLES,0,C.n);C.a.forEach(a=>g.disableVertexAttribArray(a));}

/* ---- festival dressing: string lights along the walk and the playground, sky lanterns, fireworks at night ---- */
(function initFestLights(){
  if(!MGL)return;const g=MGL.g;
  const vs=`attribute vec3 aP;attribute vec2 aD;uniform mat4 uM;uniform float uT,uN,uS;varying vec3 vC;varying float vA;
void main(){vec3 p=aP;float k=aD.x,ph=aD.y;vec3 c;
 if(k>9.5){float H=70.;p.z+=mod(uT*(2.2+fract(ph*7.)*1.6)+ph*H,H);p.x+=sin(uT*.4+ph*6.)*3.;c=vec3(1.,.78,.55);vA=uN*smoothstep(0.,6.,mod(uT*(2.2+fract(ph*7.)*1.6)+ph*H,H))*(1.-smoothstep(56.,70.,mod(uT*(2.2+fract(ph*7.)*1.6)+ph*H,H)));}
 else{c=k<1.?vec3(.62,.82,1.):k<2.?vec3(.85,.74,1.):k<3.?vec3(1.,.70,.88):k<4.?vec3(1.,.88,.62):vec3(.72,1.,.86);
  float tw=.75+.25*sin(uT*2.3+ph*40.);vA=mix(.55,1.,uN)*tw;}
 vC=c;gl_Position=uM*vec4(p,1.);gl_PointSize=clamp(uS*(k>9.5?2.6:1.25)/gl_Position.w,2.2,k>9.5?30.:20.)*(1.+uN*.5);}`;
  const fs=`precision mediump float;varying vec3 vC;varying float vA;
void main(){vec2 d=gl_PointCoord-.5;float r=length(d)*2.;if(r>1.)discard;float core=smoothstep(.55,0.,r),glow=pow(1.-r,2.);
 gl_FragColor=vec4(vC*(core*1.2+glow*.8)+core*.35,(core+glow*.6)*vA);}`;
  const mk=(t,s)=>{const o=g.createShader(t);g.shaderSource(o,s);g.compileShader(o);if(!g.getShaderParameter(o,g.COMPILE_STATUS))console.warn(g.getShaderInfoLog(o));return o};
  const p=g.createProgram();g.attachShader(p,mk(g.VERTEX_SHADER,vs));g.attachShader(p,mk(g.FRAGMENT_SHADER,fs));g.linkProgram(p);
  if(!g.getProgramParameter(p,g.LINK_STATUS))return;
  let seed=11;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const D=[];const bulb=(x,y,z,k)=>D.push(x,y,z,k,R());
  const garland=(a,b,sag,col0)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(3,Math.round(L/2.2));
    for(let i=0;i<=n;i++){const t=i/n;bulb(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t-sag*4*t*(1-t),(col0+i)%5)}};
  // along the walk: poles every ~24 units on both sides
  const P=FP_PATH,poles=[[],[]];let acc=1e9;
  for(let i=1;i<P.length;i++){acc+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);if(acc<24)continue;acc=0;
    const j=Math.min(P.length-1,i+1),dx=P[j][0]-P[i-1][0],dy=P[j][1]-P[i-1][1],l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;
    [1,-1].forEach((s,k)=>poles[k].push([P[i][0]+nx*10*s,P[i][1]+ny*10*s,P[i][2]+11]))}
  poles.forEach((row,k)=>{for(let i=1;i<row.length;i++)garland(row[i-1],row[i],2.4,k*2+i)});
  // criss-cross over the walk every other pole
  for(let i=1;i<Math.min(poles[0].length,poles[1].length);i+=2)garland(poles[0][i],poles[1][i],3,i);
  // playground: a ring around the pit + rays from the stage
  const pc=[[PIT.x0-8,PIT.y0-6],[PIT.x1+8,PIT.y0-6],[PIT.x1+8,PIT.y1+8],[PIT.x0-8,PIT.y1+8]];
  for(let i=0;i<4;i++){const a=pc[i],b=pc[(i+1)%4];garland([a[0],a[1],12],[b[0],b[1],12],2.5,i)}
  const st=[FP_STAGE[0],FP_STAGE[1]+14,22];
  for(let i=0;i<7;i++){const x=PIT.x0-30+(PIT.x1-PIT.x0+60)*i/6;garland(st,[x,PIT.y1+40,10],4,i)}
  // sky lanterns over the playground (night only)
  for(let i=0;i<90;i++){D.push(PIT.x0-60+R()*(PIT.x1-PIT.x0+120),PIT.y0-30+R()*(PIT.y1-PIT.y0+170),18+R()*6,10,R())}
  const buf=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,buf);g.bufferData(g.ARRAY_BUFFER,new Float32Array(D),g.STATIC_DRAW);
  FP.lights={p,buf,n:D.length/5,u:Object.fromEntries(['uM','uT','uN','uS'].map(k=>[k,g.getUniformLocation(p,k)])),a:['aP','aD'].map(k=>g.getAttribLocation(p,k))};
})();
function drawFestLights(M,t){const C=FP.lights;if(!C)return;const g=MGL.g;
  g.useProgram(C.p);g.uniformMatrix4fv(C.u.uM,false,new Float32Array(M));g.uniform1f(C.u.uT,t);g.uniform1f(C.u.uN,FP.night||0);
  g.uniform1f(C.u.uS,MGL.h*(window.devicePixelRatio>1?1.4:1)*1.2*(1+3.2*(1-(FP.kw??1))));   // overview is far away: bigger bulbs
  g.bindBuffer(g.ARRAY_BUFFER,C.buf);C.a.forEach(a=>g.enableVertexAttribArray(a));
  g.vertexAttribPointer(C.a[0],3,g.FLOAT,false,20,0);g.vertexAttribPointer(C.a[1],2,g.FLOAT,false,20,12);
  g.enable(g.BLEND);g.blendFunc(g.SRC_ALPHA,g.ONE);g.depthMask(false);
  g.drawArrays(g.POINTS,0,C.n);
  g.depthMask(true);g.blendFunc(g.SRC_ALPHA,g.ONE_MINUS_SRC_ALPHA);C.a.forEach(a=>g.disableVertexAttribArray(a));}
/* fireworks: behind the map (inside the sky layer), so buildings cover them */
const FW={cv:null,c:null,ps:[],next:0};
function tickFireworks(now,on){
  if(!FW.cv){FW.cv=document.createElement('canvas');FW.cv.className='pj-fw';pjSky.appendChild(FW.cv);FW.c=FW.cv.getContext('2d')}
  const W=pjSky.clientWidth,H=pjSky.clientHeight;if(FW.cv.width!==W||FW.cv.height!==H){FW.cv.width=W;FW.cv.height=H}
  const c=FW.c;c.clearRect(0,0,W,H);if(!on&&!FW.ps.length)return;
  if(on&&now>FW.next){FW.next=now+500+Math.random()*900;const x=W*(.15+Math.random()*.7),y=H*(.08+Math.random()*.3),cols=['#9CC8E2','#C9C6FF','#F2B6E3','#F8CAA7','#B5F0D4'],col=cols[Math.random()*5|0],n=46;
    for(let i=0;i<n;i++){const a=i/n*6.283,s=1.2+Math.random()*1.6;FW.ps.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1,col})}}
  c.globalCompositeOperation='lighter';
  FW.ps=FW.ps.filter(q=>{q.x+=q.vx;q.y+=q.vy;q.vy+=.025;q.vx*=.985;q.vy*=.985;q.l-=.012;if(q.l<=0)return false;
    c.globalAlpha=q.l*q.l;c.fillStyle=q.col;c.beginPath();c.arc(q.x,q.y,1.8+q.l*1.4,0,6.283);c.fill();return true});
  c.globalAlpha=1;c.globalCompositeOperation='source-over'}

function drawMapGL(){
  if(!MGL)return;const {g,u}=MGL;
  const a=MGL.w/Math.max(1,MGL.h), P=M4.persp(FP.fov*Math.PI/180,a,FP.near||1.5,FP.far||3200);
  const e=FP.cam, c=FP.look, V=M4.look([e[0],-e[1],e[2]],[c[0],-c[1],c[2]],[0,0,1]);
  const M=M4.mul(M4.mul(P,V),FLIP); FP.M=M;
  const tg=FP.act?1:0; MGL.hl+=(tg-MGL.hl)*.1; if(FP.act){const q=PRODUCTS[FP.act-1].at;MGL.hx=q[0];MGL.hy=q[1]}
  g.viewport(0,0,MGL.cv.width,MGL.cv.height);g.clearColor(0,0,0,0);g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);g.enable(g.DEPTH_TEST);g.disable(g.CULL_FACE);
  g.useProgram(MGL.pr);g.activeTexture(g.TEXTURE0);g.bindTexture(g.TEXTURE_2D,MGL.tex);
  g.bindBuffer(g.ARRAY_BUFFER,MGL.vb);g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,MGL.ib);g.enableVertexAttribArray(MGL.loc);g.vertexAttribPointer(MGL.loc,4,g.SHORT,false,0,0);
  g.uniformMatrix4fv(u.uM,false,new Float32Array(M));g.uniform3f(u.uCam,e[0],e[1],e[2]);g.uniform1f(u.uFog,FP.fog??1);g.uniform1f(u.uNight,FP.night||0);g.uniform1f(u.uLed,FP.led??1);g.uniform1f(u.uTime,performance.now()/1000);g.uniform1f(u.uMaskOn,MGL.mask?1:0);if(MGL.mask){g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,MGL.mask);g.activeTexture(g.TEXTURE0)}g.uniform3f(u.uHL,MGL.hx,MGL.hy,MGL.hl);
  g.drawElements(g.TRIANGLES,MGL.n,g.UNSIGNED_SHORT,0);
  g.disableVertexAttribArray(MGL.loc);
  const t=performance.now()/1000;
  drawCrowd(M,t); drawFestLights(M,t);
  drawBeams(M,e,t);
  if(!FP.ready)return;
  g.useProgram(FP.ip);g.uniformMatrix4fv(FP.iu.uM,false,new Float32Array(M));g.uniform3f(FP.iu.uCam,e[0],e[1],e[2]);g.uniform3fv(FP.iu.uL,TOON_SUN);
  FP.items.forEach((it,i)=>{const pr=PRODUCTS[i],lf=FP.lift||0,S=STAGE_SLOTS[i],q=[lerp(pr.at[0],S[0],lf),lerp(pr.at[1],S[1],lf),lerp(pr.at[2],S[2],lf)],cf=ITEM_CFG[pr.model]||{s:4,tilt:.4}, ob=lerp(3.4,1,(FP.fo||0)>0?1-Math.pow(FP.fo,2.5):(FP.kw??1))*((FP.fo||0)>0?Math.max(.02,Math.min(1,Math.abs(FP.fo-.33)/.33)):1), z=q[2]+(FP_ITEM_Z+cf.s*(ob-1)*.8)*(1-lf)+Math.sin(t*1.6+i*2)*1.2, sc=cf.s*ob*(1+(it.stopK||0)*(pr.model==='PATHGUARD'?.3:.95))*(1+(it.hov||0)*.2);
    const L=it.land??1; it.pose={pos:[q[0],q[1],z],rz:t*.8+i*2.1+(1-Math.min(1,L))*4,tilt:cf.tilt+Math.sin(t*.7+i)*.08,scale:sc,land:L};
    if(pr.model==='PATHGUARD'){const S=PG_LANE.slots, az=PG_LANE.rz;   // standing on the plaza either side of the vehicle lane
      it.pose={pos:[S[0][0],S[0][1],PG_LANE.g+sc],rz:az+(1-Math.min(1,L))*4,tilt:0,scale:sc,land:L,extra:[{pos:[S[1][0],S[1][1],PG_LANE.g+sc],rz:az+Math.PI,tilt:0}]};
      if(L<.003||(window.Prod3D&&Prod3D.ready)){const cl=fpProject(it.pose.pos);it.scr=cl?[cl[0],cl[1],sc*cl[2]]:[-999,-999,0];return}}
    if(L<.003||(window.Prod3D&&Prod3D.ready)){const cl=fpProject([q[0],q[1],z]);it.scr=cl?[cl[0],cl[1],sc*cl[2]]:[-999,-999,0];return}
    const W=M4.mul(M4.tr(q[0],q[1],z),M4.mul(M4.rz(t*.8+i*2.1+(1-Math.min(1,L))*4),M4.mul(M4.rx(cf.tilt+Math.sin(t*.7+i)*.08),M4.mul(M4.sc(sc*L),[1,0,0,0,0,-1,0,0,0,0,1,0,0,0,0,1]))));
    g.uniformMatrix4fv(FP.iu.uW,false,new Float32Array(W));g.uniform1f(FP.iu.uGlow,it.glow);
    g.bindBuffer(g.ARRAY_BUFFER,it.vb);g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,it.ib);FP.ia.forEach(a=>g.enableVertexAttribArray(a));
    g.vertexAttribPointer(FP.ia[0],3,g.SHORT,true,14,0);g.vertexAttribPointer(FP.ia[1],3,g.BYTE,true,14,6);g.vertexAttribPointer(FP.ia[2],4,g.UNSIGNED_BYTE,true,14,9);
    g.drawElements(g.TRIANGLES,it.n,g.UNSIGNED_SHORT,0);
    // where it lands on screen (labels, clicks)
    const cl=fpProject([q[0],q[1],z]); it.scr=cl?[cl[0],cl[1],sc*cl[2]]:[-999,-999,0];
    FP.ia.forEach(a=>g.disableVertexAttribArray(a));
  });
  g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,MGL.ib);
}
function drawBeams(M,e,t){
  const g=MGL.g;
  if(!FP.bp){const vs=`attribute vec2 aT;uniform mat4 uM;uniform vec3 uA,uD,uU,uV;uniform float uL,uR;varying float vT;varying vec3 vW;
void main(){float a=aT.y*6.2831853;vec3 p=uA+uD*aT.x*uL+(uU*cos(a)+uV*sin(a))*aT.x*uR;vT=aT.x;vW=p;gl_Position=uM*vec4(p,1.);}`;
    const fs=`precision mediump float;varying float vT;varying vec3 vW;uniform vec3 uC;uniform float uK;void main(){float a=(1.-vT)*(.25+.75*smoothstep(0.,.08,vT))*uK;gl_FragColor=vec4(uC*a,a);}`;
    const mk=(ty,src)=>{const o=g.createShader(ty);g.shaderSource(o,src);g.compileShader(o);return o};
    const p=g.createProgram();g.attachShader(p,mk(g.VERTEX_SHADER,vs));g.attachShader(p,mk(g.FRAGMENT_SHADER,fs));g.linkProgram(p);
    if(!g.getProgramParameter(p,g.LINK_STATUS)){FP.bp=-1;return}
    const d=[];const S=24;for(let i=0;i<S;i++){const a0=i/S,a1=(i+1)/S;d.push(0,a0,1,a0,1,a1)}
    const b=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,b);g.bufferData(g.ARRAY_BUFFER,new Float32Array(d),g.STATIC_DRAW);
    FP.bp={p,b,n:d.length/2,u:Object.fromEntries(['uM','uA','uD','uU','uV','uL','uR','uC','uK'].map(k=>[k,g.getUniformLocation(p,k)])),a:g.getAttribLocation(p,'aT')}}
  const B=FP.bp;if(B===-1||typeof STAGE_FIX==='undefined')return;
  g.useProgram(B.p);g.uniformMatrix4fv(B.u.uM,false,new Float32Array(M));
  g.bindBuffer(g.ARRAY_BUFFER,B.b);g.enableVertexAttribArray(B.a);g.vertexAttribPointer(B.a,2,g.FLOAT,false,0,0);
  g.enable(g.BLEND);g.blendFunc(g.ONE,g.ONE);g.depthMask(false);
  const COL=[[.55,.7,1],[1,.55,.85],[.7,.6,1],[1,.8,.55]];
  STAGE_FIX.forEach((f,i)=>{const sw=Math.sin(t*.7+i*1.3),sw2=Math.cos(t*.5+i*.9);
    const tg=[f[0]+sw*(FP.hype?44:26)+(i-3.5)*4,f[1]+60+sw2*30,0];const d=sub3(tg,f),L=Math.hypot(...d),D=d.map(v=>v/L);
    const U=norm3(cross3(D,[0,0,1])),V=cross3(U,D);
    g.uniform3fv(B.u.uA,f);g.uniform3fv(B.u.uD,D);g.uniform3fv(B.u.uU,U);g.uniform3fv(B.u.uV,V);g.uniform1f(B.u.uL,L);g.uniform1f(B.u.uR,L*.09);
    g.uniform3fv(B.u.uC,COL[i%4]);g.uniform1f(B.u.uK,(.12+.3*(FP.night||0))*(FP.beamK??1)*(.75+.25*Math.sin(t*(FP.hype?4.2:2.1)+i)));g.drawArrays(g.TRIANGLES,0,B.n)});
  g.disableVertexAttribArray(B.a);g.depthMask(true);g.disable(g.BLEND);
}
function fpProject(p){const M=FP.M;if(!M)return null;const x=p[0],y=p[1],z=p[2];
  const cx=M[0]*x+M[4]*y+M[8]*z+M[12],cy=M[1]*x+M[5]*y+M[9]*z+M[13],cw=M[3]*x+M[7]*y+M[11]*z+M[15];
  if(cw<=1)return null;return [(cx/cw*.5+.5)*MGL.w,(1-(cy/cw*.5+.5))*MGL.h,MGL.h/2/Math.tan(FP.fov*Math.PI/360)/cw]}

const pins=$$('.pin'), trees=$$('.tree');
function fitMap(){const w=mstage.clientWidth,h=mstage.clientHeight;map.base=Math.min(w/1350,h/950)*(w<700?1.3:1);sizeMapGL(w,h);map.dirty=true}
function applyMap(){
  const c=map.cur, s=map.base*c.zoom;
  world.style.transform=`scale(${s.toFixed(4)}) rotateX(${c.tilt.toFixed(2)}deg) rotateZ(${c.rot.toFixed(2)}deg) translate3d(${c.tx.toFixed(1)}px,${c.ty.toFixed(1)}px,0)`;
  const bb=`rotateZ(${(-c.rot).toFixed(2)}deg) rotateX(${(-c.tilt).toFixed(2)}deg)`;
  pins.forEach(p=>p.style.transform=`translate3d(0,0,${(+p.style.getPropertyValue('--h')+4)}px) ${bb} translate(-50%,-100%)`);
  drawMapGL();
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
$('#zReset').onclick=()=>{map.rot=MAP_ROT;map.tilt=56;map.zoom=1;map.tx=0;map.ty=0;closeCard()};
// hover + select
function setHL(n){map.hover=n;map.dirty=true;$$('.bx.prod').forEach(b=>b.classList.toggle('hl',b.classList.contains('p'+n)));pins.forEach(p=>p.classList.toggle('hl',+p.dataset.n===n));world.classList.toggle('focus',!!n)}
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
<div class="d-foot"><button class="btn back" data-back><span class="arr">←</span> 3D 지도로 돌아가기</button><button class="btn dark" data-next>다음 제품 · ${PRODUCTS[p.n%PRODUCTS.length].name} <span class="arr">→</span></button></div>`;
  dState={p,tabs:$$('#dTabs a'),secs:['d-hero','d-ov','d-ex','d-ai','d-ds','d-ga'].map(id=>$('#'+id)),prod:$('#dProd'),prod2:$('#dProd2'),design:$('#dDesign'),feats:$$('#dFeat li'),fi:-1,story:$('#dStory'),slides:$$('#dStory .story-slide')};
  dState.tabs.forEach(a=>a.onclick=e=>{e.preventDefault();const t=$('#'+a.dataset.t);detail.scrollTo({top:a.dataset.t==='d-hero'?0:t.offsetTop-64,behavior:reduce?'auto':'smooth'})});
  $$('[data-next]',dBody).forEach(b=>b.onclick=()=>switchProduct(PRODUCTS[p.n%PRODUCTS.length].n));
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
  const r=pcard.getBoundingClientRect(); const from=FP.from||[r.top,VW-r.right,VH-r.bottom,r.left]; FP.from=null;
  detail.classList.add('open'); document.body.style.overflow='hidden'; warp(60,1000);
  if(reduce){detail.style.clipPath='none';detail.classList.add('ready');return}
  tween(1000,k=>{const e=eIO(k);detail.style.clipPath=`inset(${from.map(v=>(v*(1-e)).toFixed(1)+'px').join(' ')} round ${(28*(1-e)).toFixed(1)}px)`;dBody.style.transform=`scale(${(1.08-.08*eOut(k)).toFixed(4)})`;dBody.style.filter=`blur(${(10*(1-eOut(k))).toFixed(2)}px)`},()=>{dBody.style.transform='';dBody.style.filter='';detail.style.clipPath='none';detail.classList.add('ready');$('#dBack').focus({preventScroll:true})});
}
function closeDetail(){
  if(!dState)return; const n=dState.p.n; detail.classList.remove('ready');
  const finish=()=>{detail.classList.remove('open');detail.style.clipPath='';document.body.style.overflow='';dState=null;};
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
const secOrder=['intro','world-a','projects'];
function scrollToY(y){smoothTo(y)}
// far jumps from the nav: a soft veil instead of scrolling through every scene on the way
function jumpTo(y){if(Math.abs(y-scrollY)<VH*1.6||reduce){smoothTo(y);return}
  const v=$('#jumpVeil');v.classList.add('on');
  setTimeout(()=>{window.scrollTo(0,y);SS.on=false;SS.cur=SS.tgt=y;lastSY=y;
    scenes.forEach(([s,fn])=>{s.t=s.p=progressOf(s.el);fn(s.p)});
    requestAnimationFrame(()=>requestAnimationFrame(()=>v.classList.remove('on')))},320)}
function goTo(id){const el=$('#'+id); let y=HOLDS[id]?holdY(id,0):el.offsetTop; if(id==='intro')y=0; scrollToY(y)}
$$('[data-go]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();goTo(a.dataset.go)}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('main .reveal').forEach(el=>io.observe(el));



/* ======================= 03.5 INTERLUDE (dark turn) ======================= */
const turn={el:$('#turn'),p:0,t:0};
const tVig=$('#tVig');
// concave lens on the question: each glyph is pulled toward the centre and shrinks with distance (p' = p·(1−a·r²))
const qLC=[];let qLv=-1;
(()=>{const h=document.querySelector('#tQ .t-h');h.innerHTML=h.innerHTML.split(/<br\s*\/?>/i).map(line=>line.split(' ').map(w=>`<span class="lw">${[...w].map(ch=>`<span class="lc">${ch}</span>`).join('')}</span>`).join(' ')).join('<br>');
  h.querySelectorAll('.lc').forEach(e=>qLC.push({e,nx:0,ny:0}))})();
function qMeasure(){const h=document.querySelector('#tQ .t-h');qLC.forEach(c=>c.e.style.transform='');const R=h.getBoundingClientRect();if(!R.width)return;
  const cx=R.left+R.width/2,cy=R.top+R.height/2,hw=R.width/2,hh=R.height/2;
  qLC.forEach(c=>{const r=c.e.getBoundingClientRect();c.nx=(r.left+r.width/2-cx)/hw;c.ny=(r.top+r.height/2-cy)/hw;c.w=hw});qLv=-1}
function qLens(lv){if(reduce)lv=0;lv=Math.round(lv*100)/100;if(lv===qLv)return;qLv=lv;const a=.16*lv;
  qLC.forEach(c=>{const r2=c.nx*c.nx+c.ny*c.ny*1.6,k=a*r2;
    c.e.style.transform=k>.0005?`translate(${(-c.nx*c.w*k*.55).toFixed(1)}px,${(-c.ny*c.w*k*.55).toFixed(1)}px) scale(${(1-k*1.1).toFixed(4)})`:''})}
addEventListener('resize',()=>requestAnimationFrame(qMeasure));(document.fonts?document.fonts.ready:Promise.resolve()).then(()=>setTimeout(qMeasure,60));setTimeout(qMeasure,400);


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
/* ---- the answer crumbles to dust, left to right, as the orbs take off ---- */
const DUST={ps:null,cv:null,ctx:null,start:0,x0:0,x1:0,done:false};
function dustBuild(){
  const cv=DUST.cv||(DUST.cv=document.createElement('canvas')); if(!cv.parentNode){cv.className='t-dust';cv.setAttribute('aria-hidden','true');document.body.appendChild(cv)}
  const dpr=1; cv.width=VW*dpr; cv.height=VH*dpr; DUST.ctx=cv.getContext('2d');
  const off=document.createElement('canvas'); off.width=VW; off.height=VH; const o=off.getContext('2d');
  const em=tA.querySelector('em'), er=em?em.getBoundingClientRect():null, G=['#9CC8E2','#B8B6E5','#E8B0DD'];
  const gcol=x=>{if(!er)return'#fff';const f=Math.max(0,Math.min(1,(x-er.left)/Math.max(1,er.width)));return f<.5?G[0]:G[f<.75?1:2]};
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9; const w=document.createTreeWalker(tA,NodeFilter.SHOW_TEXT); let n;
  while((n=w.nextNode())){const el=n.parentElement, cs=getComputedStyle(el), fs=parseFloat(cs.fontSize), inEm=!!el.closest('em');
    o.font=`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`; o.textBaseline='alphabetic';
    for(let i=0;i<n.length;i++){const ch=n.data[i]; if(!ch.trim())continue; const r=document.createRange(); r.setStart(n,i); r.setEnd(n,i+1); const b=r.getBoundingClientRect(); if(!b.width)continue;
      x0=Math.min(x0,b.left);x1=Math.max(x1,b.right);y0=Math.min(y0,b.top);y1=Math.max(y1,b.bottom);
      o.fillStyle=inEm?gcol(b.left+b.width/2):'#fff'; o.fillText(ch,b.left,b.top+(b.height+fs*.72)/2)}}
  if(x1<x0){DUST.ps=[];return}
  const X=Math.max(0,x0|0),Y=Math.max(0,y0|0),W=Math.min(VW,x1+2|0)-X,H=Math.min(VH,y1+2|0)-Y, d=o.getImageData(X,Y,W,H).data, st=VW<700?3:4, ps=[];
  for(let yy=0;yy<H;yy+=st)for(let xx=0;xx<W;xx+=st){const k=(yy*W+xx)*4; if(d[k+3]>120){const r=Math.random();
    ps.push({x:X+xx,y:Y+yy,c:`rgb(${d[k]},${d[k+1]},${d[k+2]})`,vx:.03+r*.13,vy:-(.02+Math.random()*.07),w:Math.random()*6.28,s:st*(.45+Math.random()*.45),j:Math.random()*.25})}}
  DUST.ps=ps; DUST.x0=x0; DUST.x1=x1}
function dustTick(t0){
  if(!t0){if(DUST.ps){DUST.ps=null;DUST.done=false;tA.style.webkitMaskImage=tA.style.maskImage='';if(DUST.cv){DUST.ctx.clearRect(0,0,DUST.cv.width,DUST.cv.height);DUST.cv.style.display='none'}}return}
  const now=performance.now(), T=now-t0-120, SW=1150, LIFE=1250;
  if(T<0)return;
  if(!DUST.ps){dustBuild();DUST.done=false;DUST.cv.style.display='block'}
  const span=Math.max(1,DUST.x1-DUST.x0), front=DUST.x0+span*Math.min(1,T/SW), ar=tA.getBoundingClientRect(), fx=front-ar.left;
  tA.style.webkitMaskImage=tA.style.maskImage=T>=SW?'linear-gradient(transparent,transparent)':`linear-gradient(90deg,transparent ${(fx-24).toFixed(0)}px,#000 ${(fx+36).toFixed(0)}px)`;
  if(DUST.done)return;
  const c=DUST.ctx; c.clearRect(0,0,DUST.cv.width,DUST.cv.height); let alive=0;
  for(const p of DUST.ps){const born=(p.x-DUST.x0)/span*SW+p.j*240, a=T-born; if(a<0){continue} if(a>LIFE)continue; alive++;
    const q=a/LIFE, x=p.x+p.vx*a+Math.sin(p.w+a*.006)*6*q, y=p.y+p.vy*a-.00006*a*a+Math.cos(p.w+a*.005)*4*q;
    c.globalAlpha=(1-q)*(1-q); c.fillStyle=p.c; c.fillRect(x,y,p.s*(1-q*.5),p.s*(1-q*.5))}
  c.globalAlpha=1; if(T>SW+LIFE+300&&!alive){DUST.done=true;c.clearRect(0,0,DUST.cv.width,DUST.cv.height)}}
function renderTurn(p){turn.rp=p}
function tickTurn(now){
  const el=turn.el,top=el.offsetTop,inView=scrollY+VH>top-10&&scrollY<top+el.offsetHeight+10;
  if(!inView){document.body.classList.remove('dark-zone');return}
  const p=turn.p, t=now/1000;
  tm.cx=lerp(tm.cx,tm.x,.06); tm.cy=lerp(tm.cy,tm.y,.06);
  // ---- lens: white → deep space → back to white
  
  const cyP=50-(T_MOB?20:19)*range(p,.6,.86);
  const Rmax=Math.hypot(VW/2,VH*Math.max(cyP,100-cyP)/100)+60;
  const open=eIO(range(p,.07,.25)), close=eIO(range(p,.84,.935));
  const R=Rmax*open*(1-close);
    tDark.style.clipPath=`circle(${R.toFixed(1)}px at 50% ${cyP.toFixed(2)}%)`; tRing.style.top=cyP.toFixed(2)+'%';
  const ringO=R>1&&R<Rmax-8?Math.min(1,R/80)*(1-(open>=1&&close<=0?1:0)):0;
  tRing.style.width=tRing.style.height=(R*2).toFixed(1)+'px'; tRing.style.opacity=ringO.toFixed(3);
  document.body.classList.toggle('dark-zone',R>VH*.55);
  // ---- "하지만," on white, pulled into the dark
  const a=eOut(range(p,0,.075)), up=eIO(range(p,.11,.3)), c=range(p,.09,.2), out=range(p,.13,.21);
  if(p>=.03&&!turn.hit){turn.hit=true;el.classList.remove('t-glitch');void el.offsetWidth;el.classList.add('t-glitch')} if(p<.01)turn.hit=false;
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
  {const lv=q*(1-d);tVig.style.opacity=(lv*.95).toFixed(3);qLens(lv)}
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
  const cOut=eIn(range(p,.84,.93)), CC=[];
  tCores.forEach((e,i)=>{const k=eOut(range(p,.55+i*.03,.7+i*.03));const TL=tCores.TL||(tCores.TL={t:0});
    if(i===0){if(p>=.795&&!TL.t)TL.t=performance.now();if(p<.76)TL.t=0}
    const fo=TL.t?eIn(clamp((performance.now()-TL.t-i*180)/850)):0;   // launch upward on a clock, one after another
    e.style.transform=`translate(${(tm.cx*(20+i*8)+(i-1)*fo*VW*.12).toFixed(1)}px,${(tm.cy*16+Math.sin(t*1.1+i*2)*5-fo*VH*.95).toFixed(1)}px) scale(${(k*(1-.35*fo)).toFixed(4)},${(k*(1-.35*fo)*(1+fo*.9)).toFixed(4)})`;
    e.style.opacity=(1-range(p,.93,.95)).toFixed(3);
    if(window.Prod3D&&Prod3D.ready&&k>.01&&fo<.999){Prod3D.coreFrame(i,e,t);e.classList.add('has-model')}
    const r=e.getBoundingClientRect(); CC.push([r.left+r.width/2,r.top+r.height/2,r.width])});
  tLenses.forEach((l,i)=>l.style.setProperty('--a',((t*50+i*120)%360).toFixed(1)+'deg'));
  dustTick(tCores.TL&&tCores.TL.t);
  // ---- answer: warped in, crisp at rest, warped out
  const ak=eOut(range(p,.64,.77)), ao=eIn(range(p,.825,.86)), aw=(1-ak)+ao;
  tA.style.opacity=(ak*(1-ao)).toFixed(3);
  tA.style.transform=`translateY(${((1-ak)*34-ao*24).toFixed(1)}px)`;
  if(aw>.004){tDisp3.setAttribute('scale',(60*aw).toFixed(1));tTurb3.setAttribute('baseFrequency',`${(.012+.003*Math.sin(t*.7)).toFixed(4)} ${(.035+.008*Math.cos(t*.9)).toFixed(4)}`);
    tA.style.filter=`url(#tWarp3) blur(${(aw*8).toFixed(2)}px)`} else tA.style.filter='none';
  // ---- dust: scattered thoughts → orbit around the core
  const conv=eIO(range(p,.46,.72)), shrink=eIn(range(p,.84,.93));
  dctx.setTransform(dDpr,0,0,dDpr,0,0); dctx.clearRect(0,0,dW,dH); dctx.globalCompositeOperation='lighter';
  const lensK=open*(1-close); if(lensK>.01){
  for(const q2 of dust){
    let rz=((q2.z-camZ*.7)%5200+5200)%5200+40; const sc=f/(f+rz-300);
    let x=VW/2+(q2.x-camX*.6)*sc, y=VH/2+(q2.y-camY*.6)*sc, r=q2.s*Math.min(sc,3)*1.4;
    if(conv>0){const C=CC[q2.k]||[VW/2,VH*.3,100],ang=q2.a+t*.35*q2.sp, rad=C[2]*(.42+.5*(q2.o-.55))*(1-shrink*.9)+4;
      const tx=C[0]+Math.cos(ang)*rad, ty=C[1]+Math.sin(ang)*rad*.7;
      x=x+(tx-x)*conv; y=y+(ty-y)*conv; r=r*(1-conv)+q2.s*.9*conv}
    const al=Math.min(1,q2.o*(conv>0?1:clamp(sc*1.4)))*lensK*(1-range(p,.92,.945));
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

/* ======================= PROJECTS · first-person walk (scroll) ======================= */
const pj={el:$('#projects'),p:0,t:0,stop:-2}; const pjNight=$('#pjNight');
const pjSticky=$('.pj-sticky'), pjHead=$('.pj-head'), pjTour=$('#pjTour'), ptK=$('#ptK'), ptN=$('#ptN'), ptO=$('#ptO'), ptGo=$('#ptGo'), fpHint=$('.map-hint');
const PJ_KN=[.2,.36,.57,.77,.94]; let pjTourActive=false;                      // scroll progress: start of walk, each product, playground
let FP_SK=null; const fpSK=()=>FP_SK||(FP_SK=[0,...fpStops(),FP.L]);
function fpS(p){const S=fpSK();if(p<=PJ_KN[0])return 0;for(let i=1;i<PJ_KN.length;i++)if(p<=PJ_KN[i])return lerp(S[i-1],S[i],eIO((p-PJ_KN[i-1])/(PJ_KN[i]-PJ_KN[i-1])));return FP.L}
mstage.insertAdjacentHTML('beforeend','<svg class="fp-route" aria-hidden="true"><path/></svg>');
const fpRouteSvg=$('.fp-route',mstage), fpRoute=$('.fp-route path',mstage);
mstage.insertAdjacentHTML('beforeend',PRODUCTS.map(p=>`<button class="fp-tag" data-n="${p.n}" aria-label="${p.n}번 ${p.name} 소개 열기"><b>0${p.n}</b><span>${p.name}</span></button>`).join(''));
const fpTags=$$('.fp-tag',mstage);
const pjMapHead=document.createElement('div');pjMapHead.className='pj-maphead';pjMapHead.innerHTML='<span>MAP · 한눈에 보기</span><b>축제 곳곳의 세 가지 제품</b><em>제품에 마우스를 올려 보세요</em>';mstage.appendChild(pjMapHead);
const pCard=document.createElement('div');pCard.className='p-card';pCard.setAttribute('aria-hidden','true');
pCard.innerHTML='<div class="pc-txt"><span class="pc-k"></span><b class="pc-n"></b><p class="pc-o"></p></div><div class="pc-stage"></div><i class="pc-click">CLICK</i>';mstage.appendChild(pCard);
const pcStage=pCard.querySelector('.pc-stage'), pcClick=pCard.querySelector('.pc-click');
// the CLICK ring follows the pointer (eased) so it reads as "press here"
{let tx=0,ty=0,cx=0,cy=0,raf=0;const step=()=>{cx+=(tx-cx)*.25;cy+=(ty-cy)*.25;pcClick.style.transform=`translate(${cx.toFixed(1)}px,${cy.toFixed(1)}px)`;raf=Math.abs(tx-cx)+Math.abs(ty-cy)>.3?requestAnimationFrame(step):0};
 mstage.addEventListener('pointermove',e=>{const r=mstage.getBoundingClientRect();tx=e.clientX-r.left;ty=e.clientY-r.top;if(!pCard.classList.contains('on')){cx=tx;cy=ty}if(!raf)raf=requestAnimationFrame(step)})}
// shooting stars: the three orbs from "3가지 제품" fall into the map and become the products
const fpStars=document.createElement('div');fpStars.className='fp-stars';fpStars.setAttribute('aria-hidden','true');
fpStars.innerHTML=[0,1,2].map(i=>`<div class="fp-star s${i}"><i class="tail"></i><i class="head"></i></div><div class="fp-burst s${i}"><i></i><i></i></div>`).join('');mstage.appendChild(fpStars);
const fpStarEl=$$('.fp-star',fpStars), fpBurstEl=$$('.fp-burst',fpStars), FS={t0:0};
const backOut=x=>{const c=1.9;return 1+(c+1)*Math.pow(x-1,3)+c*Math.pow(x-1,2)};
function tickStars(now,top,p){
  if(top>VH*.4){if(FS.t0){FS.t0=0;FP.items.forEach((it,i)=>{it.land=0;it.lt=0;it.fell=0;it.wind=0;if(window.Prod3D&&Prod3D.ready)Prod3D.flyFrame(i,{on:false})});FP.shake=0;fpStarEl.forEach(e=>e.style.opacity=0)}return}
  if(!FS.t0){FS.t0=(p>.12||reduce)?now-1e5:now+200;FP.items.forEach(it=>{it.land=0;it.lt=0;it.fell=0})}
  FP.items.forEach((it,i)=>{const el=fpStarEl[i],DUR=2.4,u=((now-FS.t0)/1000-i*.28)/DUR;
    const P3=window.Prod3D&&Prod3D.ready;
    if(it.lt){it.land=Math.min(1.05,backOut(clamp((now-it.lt)/700)));if(now-it.lt>700)it.land=1;el.style.opacity=0;
      if(P3){const fo=1-clamp((now-it.lt)/260);Prod3D.flyFrame(i,fo>0?Object.assign({},it.fs,{op:fo}):{on:false})}it.wind=0;return}
    if(u<0){it.land=0;el.style.opacity=0;it.pv=null;it.wind=0;if(P3)Prod3D.flyFrame(i,{on:false});return}
    const [tx,ty]=it.scr; if(u>=1||tx<-900){it.lt=now-(u>3?1e4:0);el.style.opacity=0;
      if(P3&&u>=3)Prod3D.flyFrame(i,{on:false});
      if(u<3){const b=fpBurstEl[i];b.style.transform=`translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px)`;b.classList.remove('go');void b.offsetWidth;b.classList.add('go');if(typeof Sound!=='undefined')Sound.play('star',i)}return}
    if(!it.fell){it.fell=1;if(typeof Sound!=='undefined')Sound.play('fall',i)}
    // enters from beside the camera (huge, out of focus), spirals close to the lens, then recedes into the map to its spot
    const cx=VW/2, cy=VH*.52, e=eIO(u), d=Math.pow(u,1.6);
    const R=Math.max(VW,VH)*.62*Math.pow(1-u,1.35), th=(i*2.094)+Math.PI*.25+u*Math.PI*3.2;
    const ox=lerp(cx,tx,e), oy=lerp(cy,ty,e);
    const x=ox+Math.cos(th)*R, y=oy+Math.sin(th)*R*.72;
    const sc=lerp(7,1,1-Math.pow(1-d,2.2));          // perspective: near → far
    const pv=it.pv||[x,y]; const vx=x-pv[0], vy=y-pv[1]; it.pv=[x,y];
    const ang=Math.atan2(vy,vx)*180/Math.PI, sp=Math.min(1,Math.hypot(vx,vy)/40);
    el.style.opacity=(Math.min(1,u*8)*(P3?.55:1)).toFixed(3); el.classList.toggle('p3',!!P3);
    el.style.transform=`translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${ang.toFixed(1)}deg) scale(${(P3?1:sc).toFixed(3)})`;
    el.style.filter=!P3&&sc>1.6?`blur(${((sc-1.6)*.9).toFixed(2)}px)`:'none';
    el.style.setProperty('--tl',(40+180*sp).toFixed(0)+'px');
    // the real product shape: huge and soft near the lens, sharp and small as it reaches its spot
    const Dn=Math.min(VW,VH)*1.05, Df=Math.max(8,(it.scr[2]||8)*2.1), px=Math.exp(lerp(Math.log(Dn),Math.log(Df),1-Math.pow(1-d,2.2)));
    const near=clamp((px-Math.min(VW,VH)*.28)/(Math.min(VW,VH)*.7));
    it.wind=near*Math.min(1,sp*1.4);
    if(it.wind>.5&&!it.gust){it.gust=1;if(typeof Sound!=='undefined')Sound.play('gust',i)} if(it.wind<.2)it.gust=0;
    if(P3){it.fs={on:true,x,y,px,op:Math.min(1,u*10),blur:near*near*16,rx:.5+u*5.5+i,ry:Math.sin(u*6+i)*.6,rz:u*7+i*2};Prod3D.flyFrame(i,it.fs)}});
  FP.shake=Math.max(0,...FP.items.map(it=>it.wind||0));
}
fpTags.forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();fpOpen(+b.dataset.n)}));
function fpOpen(n){Sound.play('open');const pu=PRODUCTS[n-1]&&PRODUCTS[n-1].url;if(pu){if(!/^https?:/.test(pu)){location.href=pu;return}let w=null;try{w=window.open(pu,'_blank')}catch(e){}if(w)return;const a=document.createElement('a');a.href=pu;a.target='_blank';a.rel='noopener';document.body.appendChild(a);a.click();a.remove();return}const it=FP.items[n-1];if(it){const r=it.scr[2]*2.2;FP.from=[it.scr[1]-r,VW-(it.scr[0]+r),VH-(it.scr[1]+r),it.scr[0]-r].map(v=>Math.max(0,v))}openDetail(n)}
function renderProjects(p){
  pj.p=p;
  const S=fpSK(); FP.s=fpS(p);
  let act=0; PJ_KN.slice(1,4).forEach((k,i)=>{if(Math.abs(p-k)<.05)act=i+1}); FP.act=act;
  const fin=p>PJ_KN[4]-.04;
  const st=act?act:fin?9:-1;
  if(st!==pj.stop){pj.stop=st;
    if(act){const pr=PRODUCTS[act-1];ptK.textContent=`0${act} · ${pr.place}`;ptN.textContent=pr.name;ptO.textContent=pr.one;ptGo.dataset.n=act;ptGo.style.display=''}
    else if(fin){ptK.textContent='도착';ptN.textContent='공연이 열리는 운동장';ptO.textContent='';ptGo.style.display='none'}}
  let vis=0; if(act)vis=1-clamp((Math.abs(p-PJ_KN[act]-(act===2?.025:0))-.02)/.03); else if(fin)vis=eOut(range(p,PJ_KN[4]-.04,PJ_KN[4]));
  vis*=1-range(p,.958,.975); pjTour.style.opacity=vis.toFixed(3); pjTour.style.transform=`translateY(${VW<700?0:-50}%) translateY(${((1-vis)*30).toFixed(1)}px)`;
  pjTour.style.filter='none'; pjTour.classList.toggle('live',vis>.6); pjTourActive=vis>.3;
  pjHead.style.opacity=(1-eIO(range(p,.05,.12))).toFixed(3); pjHead.style.pointerEvents='none';
  fpHint.style.opacity=(eOut(range(p,.18,.24))*(1-range(p,.95,.97))).toFixed(3);
  pjMapHead.style.opacity=eIO(range(FP.fo||0,.65,1)).toFixed(3);
}
ptGo.addEventListener('click',()=>fpOpen(+ptGo.dataset.n));
// look around: drag sideways (touch keeps vertical scrolling)
let fpDrag=null;
mstage.addEventListener('pointerdown',e=>{if(e.target.closest('.fp-tag'))return;fpDrag={x:e.clientX,y:e.clientY,yw:FP.yawT,pt:FP.pitchT,moved:false}});
mstage.addEventListener('pointermove',e=>{
  if(fpDrag){const dx=e.clientX-fpDrag.x,dy=e.clientY-fpDrag.y;if(Math.abs(dx)+Math.abs(dy)>5)fpDrag.moved=true;
    FP.yawT=fpDrag.yw-dx*.22;if(e.pointerType!=='touch')FP.pitchT=clamp(fpDrag.pt+dy*.14,-28,30);FP.lastDrag=performance.now();return}
  FP.hover=fpHit(e.clientX,e.clientY); mstage.style.cursor=FP.hover?'pointer':'';
});
const fpEnd=e=>{if(!fpDrag)return;const mv=fpDrag.moved;fpDrag=null;if(!mv&&e.type==='pointerup'){const n=fpHit(e.clientX,e.clientY);if(n)fpOpen(n)}};
mstage.addEventListener('pointerup',fpEnd);mstage.addEventListener('pointercancel',fpEnd);
function fpHit(cx,cy){const r=mstage.getBoundingClientRect();let best=0,bd=1e9;
  FP.items.forEach((it,i)=>{const d=Math.hypot(cx-r.left-it.scr[0],cy-r.top-it.scr[1]);if(it.scr[2]>2&&d<Math.max(it.scr[2]*1.7,26)&&d<bd){bd=d;best=i+1}});return best}
// camera
function fpOverview(){const a=MGL.w/Math.max(1,MGL.h), mob=a<.9, fv=mob?30:16, th=Math.tan(fv*Math.PI/360), tw=th*a;
  const D=Math.max((mob?420:620)/(2*tw),(mob?520:470)/(2*th)), r=MAP_ROT*Math.PI/180, el=34*Math.PI/180, sh=mob?-110:0, c=[640+Math.sin(r)*sh,462+Math.cos(r)*sh,0];   // framed on the three products
  return {c,fv,e:[c[0]+Math.sin(r)*Math.cos(el)*D,c[1]+Math.cos(r)*Math.cos(el)*D,Math.sin(el)*D]}}
function tickFP(now){
  const r=pjSticky.getBoundingClientRect(); if(r.bottom<0||r.top>VH||!MGL)return;
  const p=pj.p, mob=VW<700, k0=eIO(range(p,.07,PJ_KN[0])), fo=(()=>{const dt=Math.min(.05,(now-(FP.foTs||now))/1000);FP.foTs=now;const tg=p>.963?1:0;   // fly-up to the final map plays on a clock (~2.6s), not on scroll
      FP.foL=Math.max(0,Math.min(1,(FP.foL||0)+(tg?1:-1)*dt/2.6));const x=FP.foL;return x*x*x*(x*(x*6-15)+10)})(), k=k0*(1-fo); FP.kw=k; FP.fo=fo;
  const s=FP.s, here=fpAt(s), eye=[here[0],here[1],here[2]+FP_EYE];
  let tgt=fpAt(s+46); tgt=[tgt[0],tgt[1],here[2]+FP_EYE-1.5];
  // turn toward the product at each stop, and toward the stage at the end
  PJ_KN.slice(1,4).forEach((kn,i)=>{const w=eIO(clamp(1-Math.abs(p-kn)/.075));if(w>0){const q=PRODUCTS[i].model==='PATHGUARD'?window.PG_AIM:PRODUCTS[i].at;tgt=[lerp(tgt[0],q[0],w),lerp(tgt[1],q[1],w),lerp(tgt[2],q[2]+FP_ITEM_Z-1,w)]}});
  const we=eIO(range(p,PJ_KN[3]+.05,PJ_KN[4])); eye[2]+=8*we; tgt=[lerp(tgt[0],FP_STAGE[0],we),lerp(tgt[1],FP_STAGE[1],we),lerp(tgt[2],FP_STAGE[2]+6,we)];
  // drag offsets ease back when the walk moves on
  if(Math.abs(s-(FP.ls??s))>.5&&now-(FP.lastDrag||0)>900){FP.yawT*=.9;FP.pitchT*=.9} FP.ls=s;
  FP.yaw=lerp(FP.yaw,FP.yawT,.12);FP.pitch=lerp(FP.pitch,FP.pitchT,.12);
  let dv=sub3(tgt,eye);const yr=FP.yaw*Math.PI/180,cy=Math.cos(yr),sy=Math.sin(yr);dv=[dv[0]*cy-dv[1]*sy,dv[0]*sy+dv[1]*cy,dv[2]];
  const hl=Math.hypot(dv[0],dv[1]);dv[2]+=Math.tan(-FP.pitch*Math.PI/180)*hl; tgt=[eye[0]+dv[0],eye[1]+dv[1],eye[2]+dv[2]];
  // fly in from above, then walk
  const O=fpOverview(), kd=eIO(k), kx=fo>0?k:eOut(Math.min(1,k*1.1)), kz=fo>0?Math.pow(k,1.6):eIn(k);
  FP.cam=[lerp(O.e[0],eye[0],kx),lerp(O.e[1],eye[1],kx),lerp(O.e[2],eye[2],kz)];
  FP.look=[lerp(O.c[0],tgt[0],kx),lerp(O.c[1],tgt[1],kx),lerp(O.c[2],tgt[2],kz)];
  FP.fov=lerp(O.fv,mob?74:62,kd); FP.near=lerp(40,1.5,kd); FP.far=lerp(Math.hypot(...sub3(O.e,O.c))*2.2,3200,kd); FP.fog=eIn(range(k,.55,1));
  FP.night=eIO(clamp((p-.26)/(.9-.26))); FP.crowdK=eIO(clamp((p-.3)/(.82-.3)));
  pjNight.style.opacity=FP.night.toFixed(3); pjSky.style.setProperty('--dusk',(Math.sin(Math.PI*clamp(FP.night*1.6))*(1-FP.night)).toFixed(3));
  pjSticky.classList.toggle('fp-dark',FP.night>.55);
  FP.items.forEach((it,i)=>{const tg=FP.act===i+1||FP.hover===i+1?1:0;it.glow=lerp(it.glow,tg,.08);
    it.hov=lerp(it.hov||0,FP.hover===i+1?1:0,.18);                                   // hover: +20%, clearly
    it.stopK=lerp(it.stopK||0,eIO(clamp(1-Math.abs(p-PJ_KN[i+1]-(i===1?.025:0))/.05)),.12)});   // at its stop: bigger
  FP.focus=Math.max(0,...FP.items.map(it=>it.stopK||0))*(1-fo);   // product close-up: background goes soft
  drawMapGL(); tickStars(now,r.top,p); tickFireworks(now,FP.night>.45);
  let truck=null;
  if(window.Prod3D&&Prod3D.ready&&FP.kw>.9&&p>.525&&p<.69){   // delivery truck drives the marked route between the PATH GUARD robots as you scroll
    const ul=range(p,.535,.67), u=eIO(ul), TS=15, q=routeAt(TRUCK_ROUTE,u);
    const op=clamp((p-.525)/.03)*(1-eIO(range(ul,.45,.9)));                 // fades in, and fades out once past the robots
    if(op>.005)truck={key:'TRUCK',vis:true,op,pos:[q[0],q[1],PG_LANE.g+TS*.52],rz:Math.atan2(-q[3],q[2])+Math.PI,scale:TS}}
  if(window.Prod3D&&Prod3D.ready)Prod3D.frame({cam:FP.cam,look:FP.look,fov:FP.fov,w:MGL.w,h:MGL.h,t:now/1000,items:FP.items.map(it=>it.pose||{land:0}),props:truck?[truck]:[]});
  if(k<1){let d='';for(let i=0;i<FP_PATH.length;i+=2){const q=fpProject([FP_PATH[i][0],FP_PATH[i][1],FP_PATH[i][2]+1]);if(q)d+=(d?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1)}
    fpRoute.setAttribute('d',d);} fpRouteSvg.style.opacity=(1-eIO(range(k,0,.35))).toFixed(3);
  fpTags.forEach((b,i)=>{const it=FP.items[i],[x,y,rr]=it.scr,ov=1-eIO(range(k,0,.3)),o=Math.max(ov,k>.85&&rr>2.5?clamp((rr-2.5)/4):0)*clamp(((it.land??1)-.4)*2.5);
    b.style.opacity=o.toFixed(3);b.style.pointerEvents=o>.4?'auto':'none';
    b.style.transform=`translate(${x.toFixed(1)}px,${(y-rr*1.15-10).toFixed(1)}px) translate(-50%,-100%) scale(${(.85+.15*it.glow).toFixed(3)})`;
    b.classList.toggle('on',it.glow>.5)});
  // final overview: hover a product → card with its model + summary
  const hv=FP.fo>.85?FP.hover:0;
  if(hv){const i=hv-1,pr=PRODUCTS[i],[x,y,rr]=FP.items[i].scr;
    if(pCard.dataset.i!==String(i)){pCard.dataset.i=i;pCard.querySelector('.pc-k').textContent=`0${pr.n} · ${CAT[pr.cat]} · ${pr.place}`;pCard.querySelector('.pc-n').textContent=pr.name;pCard.querySelector('.pc-o').textContent=pr.one}
    if(window.Prod3D&&Prod3D.ready)Prod3D.cardFrame(i,pcStage,now/1000);
    pCard.classList.add('on')}
  else pCard.classList.remove('on');
}

/* ======================= shared pointer tilt + epilogue card ======================= */
const tilt={x:0,y:0};
function tickTilt(){tilt.x=lerp(tilt.x,tm.x,.06);tilt.y=lerp(tilt.y,tm.y,.06)}

/* ---- PROJECTS sky: fades in from white as the section arrives, sun rises; fades out on leave ---- */
const pjSky=$('#pjSky'), pjMapCv=()=>$('.map-gl');
function tickPjSky(){
  const r=pjSticky.getBoundingClientRect(); if(r.bottom<0||r.top>VH)return;
  const kin=eIO(clamp(1-r.top/VH)), kout=eIO(clamp(r.bottom/VH));
  const k=Math.min(kin,kout);
  pjSky.style.opacity=k.toFixed(3);
  pjSticky.style.setProperty('--t',(VH*.45*clamp(r.top/(VH*.3))).toFixed(1)+'px');
  pjSticky.style.setProperty('--b',(VH*.45*clamp((VH-r.bottom)/(VH*.3))).toFixed(1)+'px');
  pjSky.style.setProperty('--sy',(30*(1-kin)).toFixed(2)+'vh');
  pjSky.style.setProperty('--ss',(.8+.2*kin).toFixed(3));
  const W=FP.shake||0, tt=performance.now()/1000, shx=W*(7*Math.sin(tt*37)+4*Math.sin(tt*23+1)), shy=W*(5*Math.sin(tt*31+2)+3*Math.sin(tt*19)), shr=W*(.55*Math.sin(tt*27)+.3*Math.sin(tt*41));
  $$('.map-gl').forEach(cv=>{cv.style.opacity=k.toFixed(3);cv.style.transform=`translateY(${(6*(1-kin)).toFixed(2)}vh) translate(${shx.toFixed(2)}px,${shy.toFixed(2)}px) rotate(${shr.toFixed(3)}deg) scale(${(1.04-.04*kin+W*.012).toFixed(4)})`;const bl=W*1.4+(cv.classList.contains('map-gl3')?0:(FP.focus||0)*5);cv.style.filter=bl>.05?`blur(${bl.toFixed(2)}px)`:''})
}
/* ======================= SCROLL PAUSES + SNAP ======================= */
// mapped progress values where the scene should rest (content fully shown)
const HOLDS={'intro':[0,.44,1],'world-a':[.04,.24,.4467,.6533,.86],'context-vision':[.12,.50,.88],'system':[.05,.31,.53,.8],'turn':[.07,.42,.8],'projects':[.03,.36,.595,.77,.955,.996]};
const HOLD_W={'intro':.07,'world-a':.05,'context-vision':.05,'system':.05,'turn':.07,'projects':.045};   // raw share of the section each pause takes
const KNOTS={};
for(const id in HOLDS){const H=HOLDS[id],w=HOLD_W[id],mv=1-H.length*w,k=[[0,0]];let pr=0,pm=0;
  H.forEach(h=>{const r0=pr+(h-pm)*mv;k.push([r0,h],[r0+w,h]);pr=r0+w;pm=h});k.push([1,1]);KNOTS[id]=k}
function remap(id,t){const k=KNOTS[id];if(!k)return t;for(let i=1;i<k.length;i++){const [r0,m0]=k[i-1],[r1,m1]=k[i];if(t<=r1)return r1>r0?m0+(m1-m0)*(.5-.5*Math.cos(Math.PI*(t-r0)/(r1-r0))):m1}return 1}
function holdRaw(id,i){const k=KNOTS[id];return (k[1+i*2][0]+k[2+i*2][0])/2}
function holdY(id,i){const el=$('#'+id);return Math.round(el.offsetTop+holdRaw(id,i)*(el.offsetHeight-VH))}
// returning from a product page: index.html#product-2 → stand at that product on the walk; #products → start of the map
addEventListener('load',()=>{const h=location.hash,m=h.match(/^#product-(\d)$/);
  if(!m&&h!=='#products'&&h!=='#projects')return;
  const y=m?holdY('projects',+m[1]):holdY('projects',0);
  const go=()=>{scrollTo(0,y);if(typeof SS!=='undefined'){SS.tgt=y;SS.cur=y}scenes.forEach(([s,fn])=>{s.t=s.p=progressOf(s.el);fn(s.p)})};
  go();setTimeout(go,60);setTimeout(go,400)});
function snapPoints(){const pts=[];for(const id in HOLDS){const hw=HOLD_W[id]*($('#'+id).offsetHeight-VH)/2;HOLDS[id].forEach((_,i)=>pts.push({y:holdY(id,i),id,i,hw}))}return pts.sort((a,b)=>a.y-b.y)}
/* ---- smooth scrolling: wheel inertia + gentle magnet (no hard stops) ---- */
let snapT=0,touching=false,lastSY=scrollY,dir=1;
const SS={cur:scrollY,tgt:scrollY,on:false,k:.085,set:scrollY};
const maxY=()=>document.documentElement.scrollHeight-innerHeight;
function smoothTo(y,k){if(reduce){window.scrollTo(0,y);return}SS.cur=SS.on?SS.cur:scrollY;SS.tgt=clamp(Math.round(y),0,maxY());SS.k=k||.075;SS.on=true}
function tickSS(){if(!SS.on)return;SS.cur=lerp(SS.cur,SS.tgt,SS.k);if(Math.abs(SS.tgt-SS.cur)<.5){SS.cur=SS.tgt;SS.on=false}SS.set=Math.round(SS.cur);window.scrollTo(0,SS.cur)}
const ownScroller=t=>t&&t.closest&&t.closest('#detail,.lightbox,.pcard');

/* ---- WORLD: one gesture = one chapter (sticky stepping) ---- */
const WS={armed:true,acc:0,lock:0,last:0,ty:0};
function waZone(){const a=holdY('world-a',0),b=holdY('world-a',4);return [a,b]}
function waIdx(y){let bi=0,bd=1e9;for(let i=0;i<5;i++){const d=Math.abs(holdY('world-a',i)-y);if(d<bd){bd=d;bi=i}}return bi}
function waStep(d){const y=SS.on?SS.tgt:scrollY,[a,b]=waZone();
  if(d>0?y<a-VH*.6||y>=b-2:y>b+VH*.6||y<=a+2)return false;          // outside, or leaving at the ends → normal scroll
  const now=performance.now(); if(now<WS.lock)return true;
  let i=waIdx(y); const hy=holdY('world-a',i); if(d>0?hy>y+4:hy<y-4){}else i=clamp(i+(d>0?1:-1),0,4);
  smoothTo(holdY('world-a',i),.085); WS.lock=now+720; return true}
addEventListener('wheel',e=>{
  if(e.ctrlKey||reduce||detail.classList.contains('open')||ownScroller(e.target))return;
  const d=e.deltaY; if(Math.abs(e.deltaX)>Math.abs(d)||!d)return;
  const y=SS.on?SS.tgt:scrollY,[a,b]=waZone(); if(y<a-VH*.6||y>b+VH*.6)return;
  if(d>0&&y>=b-2||d<0&&y<=a+2)return;
  e.preventDefault();e.stopImmediatePropagation();
  const now=performance.now(); if(now-WS.last>180){WS.acc=0;WS.armed=true} WS.last=now;
  if(!WS.armed||now<WS.lock)return; WS.acc+=d;
  if(Math.abs(WS.acc)>28){waStep(WS.acc);WS.acc=0;WS.armed=false}
},{passive:false,capture:true});
addEventListener('touchstart',e=>{WS.ty=e.touches[0].clientY;WS.y0=scrollY},{passive:true});
addEventListener('touchend',e=>{const t=e.changedTouches[0];if(!t)return;const dy=WS.ty-t.clientY;
  const [a,b]=waZone(); if(WS.y0<a-4&&dy>0&&scrollY<a-VH*.3||WS.y0>b+4)return;
  if(Math.abs(dy)>24&&WS.y0>=a-VH*.4&&WS.y0<=b+4){const i=clamp(waIdx(WS.y0)+(dy>0?1:-1),0,4);
    if(!(dy>0&&WS.y0>=b-2)&&!(dy<0&&WS.y0<=a+2)){setTimeout(()=>smoothTo(holdY('world-a',i),.09),0);WS.lock=performance.now()+700}}},{passive:true});
addEventListener('wheel',e=>{
  if(e.ctrlKey||reduce||detail.classList.contains('open')||ownScroller(e.target))return;
  if(Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
  e.preventDefault();
  const d=e.deltaY*(e.deltaMode===1?32:e.deltaMode===2?VH:1);
  if(!SS.on){SS.cur=scrollY;SS.tgt=scrollY}
  if(gateWheel(d))return;
  SS.tgt=clamp(SS.tgt+d,0,maxY());SS.k=.085;SS.on=true;if(d)dir=d>0?1:-1;queueMagnet();
},{passive:false});
addEventListener('touchstart',()=>{touching=true;SS.on=false},{passive:true});
addEventListener('touchend',()=>{touching=false;GATE.te=performance.now();queueMagnet()},{passive:true});
/* ---- one hard stop on "하지만," before the question: the scroll rests there for a beat ---- */
const GATE={te:0,lockT:0};
// hard stops: "하지만," and the moment the three orbs launch (they fly on a clock, so the scroll waits for them)
const GATES=[{i:0,ms:1500},{i:2,ms:1000}].map(g=>Object.assign(g,{until:0,passed:false}));
function gateY(g){return holdY('turn',g.i)}
function gateWheel(d){const now=performance.now(),base=SS.on?SS.tgt:scrollY;
  for(const g of GATES){const gy=gateY(g);
    if(base<gy-VH*.3)g.passed=false;
    if(d<=0)continue;
    if(now<g.until&&Math.abs(base-gy)<VH*.6)return true;
    if(!g.passed&&base<gy-2&&base+d>=gy-2){g.passed=true;g.until=now+g.ms;smoothTo(gy,.08);return true}}
  return false}
function gateTouch(){if(!touching&&performance.now()-(GATE.te||0)>1600)return;
  for(const g of GATES){const gy=gateY(g);if(scrollY<gy-VH*.3){g.passed=false;continue}
    if(!g.passed&&lastSY<gy-2&&scrollY>gy+2&&dir>0){g.passed=true;const de=document.documentElement;de.style.overflow='hidden';window.scrollTo(0,gy);SS.cur=SS.tgt=gy;
      clearTimeout(GATE.lockT);GATE.lockT=setTimeout(()=>{de.style.overflow=''},g.ms-300);return}}}
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
addEventListener('scroll',()=>{if(!SS.on&&!reduce)gateTouch();const d=scrollY-lastSY;if(Math.abs(d)>.5)dir=d>0?1:-1;lastSY=scrollY;
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
  const show=!!cur&&HOLDS[cur].length>1&&!['intro','world-a','context-vision','system'].includes(cur); holdbar.classList.toggle('show',show); if(!show)return;
  const pts=HOLDS[cur].map((_,i)=>holdY(cur,i)); let a=0;pts.forEach((y,i)=>{if(scrollY>=y-VH*.35)a=i});
  const key=cur+pts.length; if(key!==hbKey){hbKey=key;holdbar.innerHTML=pts.map(()=>'<i></i>').join('')}
  [...holdbar.children].forEach((x,i)=>x.classList.toggle('on',i===a));
}
const scenes=[[intro,renderIntro],[worldA,renderWorldA],[system,renderSystem],[turn,renderTurn],[pj,renderProjects]];
function progressOf(el){const top=el.offsetTop, h=el.offsetHeight-VH;return remap(el.id,clamp((scrollY-top)/h))}
function updateChrome(){
  const y=scrollY+VH*.45; let cur=0;
  secOrder.forEach((id,i)=>{const el=$('#'+id);if(el.offsetTop<=y)cur=i});
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
    tickMap(); updateChrome(); tickHoldbar(); tickTilt(); tickWorld(performance.now()); tickTurn(performance.now()); tickSystem2(performance.now()); tickPjSky(); tickFP(performance.now()); Sound.tick();
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
  if(intro.p>.12||scrollY>intro.el.offsetHeight)return;
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
  if(GL)GL.click=[(e.clientX-VW/2)/VH,(VH/2-e.clientY)/VH,now]; typeof Sound!=='undefined'&&Sound.play('bloom',e.clientX/VW);
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
    if(pIn&&FINE){const dx=q.x-PX,dy=q.y-PY,d=Math.hypot(dx,dy)||1,f=Math.exp(-(d*d)/(2*110*110))*on;tx+=dx/d*26*f;ty+=dy/d*26*f-10*f;
      const hot=f>.55;if(hot&&!c._hot&&now-(c._ts||0)>220){c._ts=now;typeof Sound!=='undefined'&&Sound.play('letter',i)}c._hot=hot}
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
const skewEls=$$('.wa-left,.sys-inner .h-main'); let sv=0, lastY=scrollY;
function tickSkew(){
  if(reduce)return; sv=lerp(sv,scrollY-lastY,.12); lastY=scrollY;
  const k=clamp(sv*.045,-2.2,2.2); skewEls.forEach(el=>el.style.transform=Math.abs(k)<.01?'':`skewY(${(-k).toFixed(3)}deg)`);
}

/* ---------- 11. Map: fly-in entrance, idle orbit, filter indicator ---------- */
world.classList.add('pre'); pins.forEach((p,i)=>p.style.setProperty('--i',i));
let mapEntered=false, lastMapInt=performance.now();
new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!mapEntered){mapEntered=true;
  if(!reduce){map.cur.rot=MAP_ROT-112;map.cur.tilt=80;map.cur.zoom=.45;map.dirty=true}
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

/* ---------- intro flight (매 프레임: 구름·카메라 흔들림이 시간에 따라 움직인다) ---------- */
let flLast=0;
function tickFlight(now){
  const F=window.__flight; if(!F)return;
  const dt=Math.min(.05,Math.max(.001,(now-(flLast||now))/1000)); flLast=now;
  if(scrollY>intro.el.offsetTop+intro.el.offsetHeight)return;
  F.render(intro.p,now/1000,dt);
}

/* ---------- master fx loop ---------- */
function fxLoop(now){
  const tx=pIn?PX/VW-.5:0, ty=pIn?PY/VH-.5:0; fxm.x=lerp(fxm.x,tx,.07); fxm.y=lerp(fxm.y,ty,.07);
  tickCursor(); tickMag();
  if(!detail.classList.contains('ready')){
    drawGL(now); tickFlight(now); tickTitle(now); tickWorldImgs(); tickSystem(); tickSkew(); tickMapIdle(now);
    const H=document.documentElement.scrollHeight-VH; sprog.style.transform=`scaleX(${(H>0?scrollY/H:0).toFixed(4)})`;
  } else tickDetail(now);
  requestAnimationFrame(fxLoop);
}
addEventListener('resize',()=>{sizeGL();if(chPos.length)measureChs()});
sizeGL(); requestAnimationFrame(fxLoop);

/* ======================= SOUND · short cues for key moments (synthesized in the browser, no audio files) ======================= */
const Sound=(()=>{
  let ctx=null,out,verb,echo,on=false,mlp,mvol,wet,eg;
  // ---- user settings (persisted) ----
  const MOODS={'경쾌':{space:.28,echo:.25,bright:.9,oct:0},'몽환':{space:.6,echo:.55,bright:.72,oct:0},'차분':{space:.45,echo:.3,bright:.38,oct:-1},'반짝':{space:.5,echo:.7,bright:1,oct:1}};
  const TEX={musicbox:'오르골',glass:'유리 벨',soft:'소프트 패드',pluck:'플럭'};
  const P=Object.assign({vol:.8,tex:'musicbox',mood:'몽환',ix:true},MOODS['몽환']);
  Object.assign(P,{vol:.8,tex:'musicbox',mood:'사용자',space:.5,echo:.02,bright:.02,oct:-1,ix:true}); // fixed sound setting (settings panel removed)
  const saveP=()=>{try{localStorage.setItem('cf-sound-set',JSON.stringify(P))}catch(e){}};
  const ICON_SND='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path class="w1" d="M15.5 8.5a5 5 0 0 1 0 7"/><path class="w2" d="M18.5 5.5a9 9 0 0 1 0 13"/><path class="x" d="m16 9 6 6m0-6-6 6"/></svg>';
  const ICON_SET='<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>';
  const wrap=document.createElement('div');wrap.className='snd';
  wrap.innerHTML=`<svg class="snd-defs" width="0" height="0" aria-hidden="true"><filter id="sndGoo"><feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" result="g"/><feComposite in="SourceGraphic" in2="g" operator="atop"/></filter></svg>
    <div class="snd-goo" aria-hidden="true"><i class="b1"></i><i class="b2"></i></div>
    <button class="snd-btn" type="button" aria-pressed="false">${ICON_SND}<span class="sr">소리 켜기</span></button>
    <button class="snd-set" type="button" aria-label="사운드 설정" aria-expanded="false" tabindex="-1">${ICON_SET}</button>
    <div class="snd-panel" role="dialog" aria-label="사운드 설정">
      <div class="sp-h"><b>사운드 설정</b><button type="button" class="sp-x" aria-label="닫기">×</button></div>
      <label class="sp-row"><span>볼륨</span><input type="range" min="0" max="1" step=".01" data-k="vol"><em data-v="vol"></em></label>
      <div class="sp-row col"><span>분위기</span><div class="sp-chips" data-g="mood">${Object.keys(MOODS).map(m=>`<button type="button" data-m="${m}">${m}</button>`).join('')}</div></div>
      <div class="sp-row col"><span>질감</span><div class="sp-chips" data-g="tex">${Object.entries(TEX).map(([k,v])=>`<button type="button" data-t="${k}">${v}</button>`).join('')}</div></div>
      <label class="sp-row"><span>공간감</span><input type="range" min="0" max="1" step=".01" data-k="space"><em data-v="space"></em></label>
      <label class="sp-row"><span>잔향(에코)</span><input type="range" min="0" max="1" step=".01" data-k="echo"><em data-v="echo"></em></label>
      <label class="sp-row"><span>밝기</span><input type="range" min="0" max="1" step=".01" data-k="bright"><em data-v="bright"></em></label>
      <div class="sp-row"><span>음높이</span><div class="sp-chips sm" data-g="oct"><button type="button" data-o="-1">낮게</button><button type="button" data-o="0">기본</button><button type="button" data-o="1">높게</button></div></div>
      <label class="sp-row sw"><span>글자·마우스 반응음</span><input type="checkbox" data-k="ix"><i></i></label>
      <div class="sp-f"><button type="button" class="sp-try">미리 듣기</button><button type="button" class="sp-reset">기본값</button></div>
    </div>`;
  document.body.appendChild(wrap);
  const btn=wrap.querySelector('.snd-btn'),setB=wrap.querySelector('.snd-set'),panel=wrap.querySelector('.snd-panel');
  let NB=null;
  function noise(){if(NB)return NB;const b=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return NB=b}
  function init(){
    ctx=new (window.AudioContext||window.webkitAudioContext)();
    out=ctx.createGain();out.gain.value=.8;const comp=ctx.createDynamicsCompressor();mlp=ctx.createBiquadFilter();mlp.type='lowpass';mlp.Q.value=.5;mvol=ctx.createGain();out.connect(mlp);mlp.connect(mvol);mvol.connect(comp);comp.connect(ctx.destination);
    // soft hall reverb from a generated impulse
    verb=ctx.createConvolver();const L=ctx.sampleRate*2.6,ir=ctx.createBuffer(2,L,ctx.sampleRate);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,3.2)}
    verb.buffer=ir;wet=ctx.createGain();wet.gain.value=.35;verb.connect(wet);wet.connect(out);
    // ping-pong echo (dreamy tails)
    echo=ctx.createGain();const dl=ctx.createDelay(1),dr=ctx.createDelay(1),fb=ctx.createGain(),pl=ctx.createStereoPanner(),pr=ctx.createStereoPanner(),lp=ctx.createBiquadFilter();eg=ctx.createGain();
    dl.delayTime.value=.27;dr.delayTime.value=.27;fb.gain.value=.38;pl.pan.value=-.7;pr.pan.value=.7;eg.gain.value=.5;lp.type='lowpass';lp.frequency.value=4200;
    echo.connect(lp);lp.connect(dl);dl.connect(pl);pl.connect(eg);dl.connect(dr);dr.connect(pr);pr.connect(eg);dr.connect(fb);fb.connect(dl);eg.connect(out);
    applyP(true);
  }
  function applyP(now){if(!ctx)return;const t=ctx.currentTime,k=now?.001:.08;
    mvol.gain.setTargetAtTime(P.vol*1.15,t,k);wet.gain.setTargetAtTime(.05+P.space*.6,t,k);eg.gain.setTargetAtTime(P.echo*.95,t,k);
    mlp.frequency.setTargetAtTime(900*Math.pow(18000/900,P.bright),t,k)}
  const T=()=>ctx.currentTime;
  // light + dreamy palette: D major pentatonic, music-box / kalimba / glass tones, ping-pong echo + airy reverb
  const PN=[587.33,659.25,739.99,880,987.77,1174.66,1318.51,1479.98,1760,1975.53,2349.32];
  const PF=()=>Math.pow(2,P.oct||0);
  const pick=i=>PN[((i%PN.length)+PN.length)%PN.length]*PF();
  function bus(dry=1,rev=.5,del=.25){const g=ctx.createGain();const d=ctx.createGain(),r=ctx.createGain(),e=ctx.createGain();d.gain.value=dry;r.gain.value=rev;e.gain.value=del;
    g.connect(d);d.connect(out);g.connect(r);r.connect(verb);g.connect(e);e.connect(echo);return g}
  function env(g,t,a,dur,vol){g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+dur)}
  function tone(f,t,dur,vol,type='sine',rev=.6,glide=0,del=.2){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(glide)o.frequency.exponentialRampToValueAtTime(f*glide,t+dur);
    o.connect(g);g.connect(bus(1,rev,del));env(g,t,.006,dur,vol);o.start(t);o.stop(t+dur+.05)}
  // music box / kalimba: sine with a quick bright overtone and tiny pitch blip
  function box(f,t,vol=.09,dur=1.1,del=.35){
    if(P.tex==='glass'){glass(f,t,vol*.85,Math.max(.8,dur*1.6));return}
    if(P.tex==='soft'){const b=bus(.9,.9,del);[-8,8].forEach(dt=>{const o=ctx.createOscillator(),lp=ctx.createBiquadFilter(),g=ctx.createGain();o.type='triangle';o.frequency.value=f;o.detune.value=dt;lp.type='lowpass';lp.frequency.value=Math.min(6000,f*2.2);
      o.connect(lp);lp.connect(g);g.connect(b);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol*.6,t+.05);g.gain.exponentialRampToValueAtTime(.0001,t+dur*1.5);o.start(t);o.stop(t+dur*1.5+.05)});return}
    if(P.tex==='pluck'){const o=ctx.createOscillator(),lp=ctx.createBiquadFilter(),g=ctx.createGain();o.type='sawtooth';o.frequency.value=f;lp.type='lowpass';lp.Q.value=4;lp.frequency.setValueAtTime(Math.min(18000,f*8),t);lp.frequency.exponentialRampToValueAtTime(Math.min(16000,f*1.1),t+.18);
      o.connect(lp);lp.connect(g);g.connect(bus(1,.5,del));env(g,t,.003,dur*.7,vol*.55);o.start(t);o.stop(t+dur*.7+.05);return}
    const o=ctx.createOscillator(),o2=ctx.createOscillator(),g=ctx.createGain(),g2=ctx.createGain();
    o.frequency.setValueAtTime(f*1.012,t);o.frequency.exponentialRampToValueAtTime(f,t+.04);o2.frequency.value=f*4.02;o2.type='sine';
    o.connect(g);o2.connect(g2);const b=bus(1,.7,del);g.connect(b);g2.connect(b);env(g,t,.004,dur,vol);env(g2,t,.002,.18,vol*.35);o.start(t);o2.start(t);o.stop(t+dur+.05);o2.stop(t+.25)}
  // glass bell: soft FM
  function glass(f,t,vol=.07,dur=2.4){const c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain();
    c.frequency.value=f;m.frequency.value=f*3.5;mg.gain.setValueAtTime(f*1.4,t);mg.gain.exponentialRampToValueAtTime(f*.05,t+dur*.6);
    m.connect(mg);mg.connect(c.frequency);c.connect(g);g.connect(bus(.9,1,.3));env(g,t,.01,dur,vol);c.start(t);m.start(t);c.stop(t+dur+.05);m.stop(t+dur+.05)}
  function air(t,dur,f0,f1,vol=.16,q=.8,rev=.8){const s=ctx.createBufferSource();s.buffer=noise();const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=500;const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=q;
    f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(f1,t+dur);const g=ctx.createGain();s.connect(hp);hp.connect(f);f.connect(g);g.connect(bus(1,rev,.15));
    g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.5);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.start(t,Math.random()*2);s.stop(t+dur+.05)}
  function pad(fs,t,dur,vol=.035){const pf=PF();fs=fs.map(f=>f*pf);fs.forEach((f,i)=>{[-7,7].forEach(dt=>{const o=ctx.createOscillator(),g=ctx.createGain(),lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(700,t);lp.frequency.linearRampToValueAtTime(2600,t+dur*.5);
    o.type='triangle';o.frequency.value=f;o.detune.value=dt;o.connect(lp);lp.connect(g);g.connect(bus(.7,1,.2));g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.4);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.start(t);o.stop(t+dur+.1)})})}
  function sparkle(t,n,from=5,spread=6,step=.045,vol=.04,up=true){for(let k=0;k<n;k++){const i=up?from+k%spread:from+spread-1-k%spread;box(pick(i)*(k>=spread?2:1),t+k*step,vol,.6,.45)}}
  function arp(t,idx,step=.08,vol=.07){idx.forEach((i,k)=>box(pick(i),t+k*step,vol))}
  const C={
    on(){const t=T();arp(t,[0,2,3,5],.07,.07)},
    introFly(){const t=T();air(t,2.4,600,6000,.14);pad([293.66,369.99,440,659.25],t,3.6,.03);arp(t+.2,[0,1,2,3,4,5,6,7],.16,.05)},
    introLand(){const t=T();[8,7,5,3].forEach((i,k)=>glass(pick(i),t+k*.08,.05,2.6));box(pick(5),t+.4,.08)},
    section(){const t=T();air(t,.7,900,5200,.12);box(pick(3),t+.12,.07);box(pick(5),t+.24,.07)},
    card(dir){const t=T();air(t,.25,dir>0?1500:4000,dir>0?4000:1500,.12,1.6,.4);const a=dir>0?[4,6]:[6,4];box(pick(a[0]),t+.04,.06,.5);box(pick(a[1]),t+.12,.06,.7)},
    msgAi(){const t=T();box(pick(3),t,.07,.7);tone(pick(5),t+.06,.18,.025,'sine',.5,1.06)},
    msgMe(){const t=T();box(pick(6),t,.06,.5);box(pick(8),t+.07,.05,.6)},
    typing(){const t=T();[0,.11,.22].forEach((d,k)=>box(pick(9+k%2),t+d,.018,.2,.2))},
    key(){const t=T();[0,2,4,7].forEach((i,k)=>glass(pick(i),t+k*.05,.05,3.2));pad([293.66,369.99,440,554.37],t,4,.03);sparkle(t+.3,10,6,5,.06,.03)},
    dive(){const t=T();air(t,1.8,5000,700,.14);arp(t+.1,[8,7,6,5,4,3,2],.1,.05)},
    stop(i){const t=T();const M=[[0,2,5],[1,3,6],[2,4,7]][i]||[0,2,5];M.forEach((n,k)=>glass(pick(n),t+k*.09,.06,2.2));box(pick(M[2]+3),t+.3,.04)},
    hover(){const t=T();box(pick(9),t,.02,.25,.2)},
    open(){const t=T();air(t,.7,900,6400,.13);sparkle(t,6,3,6,.04,.05)},
    letter(i){const t=T();box(pick(i),t,.05,.8,.4)},
    bloom(x){const t=T(),r=Math.min(3,Math.floor(x*4));const CH=[[0,2,3],[1,3,5],[2,4,6],[3,5,7]][r];
      CH.forEach((n,k)=>glass(pick(n),t+k*.04,.045,2.6));sparkle(t+.12,8,CH[0]+3,5,.05,.03);air(t,1,800,5200,.08)},
    // "하지만," — a playful glitch: pitched stutters, a little crunch, then a soft drop
    preHit(){const t=T();const seq=[[0,7],[.05,2],[.09,9],[.15,4],[.2,7],[.26,0],[.72,8],[.77,3]];
      seq.forEach(([d,n],i)=>{const o=ctx.createOscillator(),lp=ctx.createBiquadFilter(),g=ctx.createGain();o.type='square';o.frequency.setValueAtTime(pick(n),t+d);
        lp.type='lowpass';lp.frequency.value=3200;o.connect(lp);lp.connect(g);g.connect(bus(1,.4,.35));g.gain.setValueAtTime(.06,t+d);g.gain.setValueAtTime(0,t+d+.04);o.start(t+d);o.stop(t+d+.05);
        const s=ctx.createBufferSource();s.buffer=noise();const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2500+i*500;bp.Q.value=4;const ng=ctx.createGain();
        s.connect(bp);bp.connect(ng);ng.connect(bus(1,.3,.1));ng.gain.setValueAtTime(.16,t+d);ng.gain.setValueAtTime(0,t+d+.025);s.start(t+d,Math.random()*2);s.stop(t+d+.03)});
      tone(73.42,t+.02,.9,.22,'sine',.4,.5,0)},
    lens(){const t=T();air(t,2.2,4200,500,.13);pad([293.66,329.63,440,587.33],t+.1,4,.035);tone(146.83,t+.2,2.4,.06,'sine',.8,1,.1)},
    question(){const t=T();[0,.36].forEach(d=>tone(110,t+d,.35,.14,'sine',.3,.7,0));[[5,0],[6,.12]].forEach(([n,d])=>{glass(pick(n),t+.15+d,.04,3.4)});pad([293.66,440,659.25],t+.1,3.6,.025)},
    shatter(){const t=T();for(let k=0;k<20;k++)box(pick(5+Math.floor(Math.random()*6))*(Math.random()<.4?2:1),t+Math.random()*.9,.025+Math.random()*.02,.5,.5);air(t,1,2000,8000,.1)},
    core(i){const t=T();glass(pick([5,7,8][i]),t,.08,3);box(pick([0,2,3][i]),t+.05,.05,1.2)},
    answer(){const t=T();pad([293.66,369.99,440,587.33,739.99],t,4.5,.035);arp(t+.15,[0,2,3,5,7,8],.09,.06);glass(pick(8),t+.7,.05,3)},
    fall(i){const t=T();air(t,1.1,7000,1400,.07,1.2,.9);tone(pick(9-i)*2,t,1.1,.012,'sine',.9,.5,.4)},
    gust(i){const t=T();air(t,.9,900,5200,.16,.7,.6);air(t+.05,.7,4800,700,.09,1.2,.3)},
    star(i){const t=T();glass(pick([5,7,8][i]||5),t,.07,2.6);box(pick([2,4,5][i]||3),t+.03,.06,1);sparkle(t+.08,6,4+i,5,.04,.03)},
    release(){const t=T();air(t,1.4,800,6800,.14);sparkle(t+.2,8,4,6,.05,.035)},
  };
  function play(k,...a){if(!on||!ctx)return;if(!P.ix&&(k==='letter'||k==='hover'||k==='bloom'))return;try{C[k](...a)}catch(e){console.warn('sound',k,e)}}
  let sh=null,lx=0,ly=0,spd=0,lt=0;
  addEventListener('pointermove',e=>{const now=performance.now(),dt=Math.max(8,now-lt);spd=Math.min(1,spd*.6+Math.hypot(e.clientX-lx,e.clientY-ly)/dt*.12);lx=e.clientX;ly=e.clientY;lt=now},{passive:true});
  function shimmer(active){if(!on||!ctx)return;if(!P.ix)active=false;
    if(!sh){const s=ctx.createBufferSource();s.buffer=noise();s.loop=true;const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=6;const g=ctx.createGain();g.gain.value=0;
      const o=ctx.createOscillator();o.type='sine';const og=ctx.createGain();og.gain.value=0;o.connect(og);og.connect(bus(.6,1,.6));
      s.connect(f);f.connect(g);g.connect(bus(.7,1));s.start();o.start();sh={f,g,o,og}}
    const t=T(),x=lx/VW,y=ly/VH,v=active?spd:0;spd*=.9;
    sh.f.frequency.setTargetAtTime(900+x*3800,t,.08);sh.g.gain.setTargetAtTime(v*.08,t,.12);
    sh.o.frequency.setTargetAtTime(PN[Math.min(PN.length-1,Math.floor((1-y)*8))],t,.12);sh.og.gain.setTargetAtTime(v*.035,t,.2)}
  // intro flight: a sustained wind + pad layer that lasts the whole flight and opens up as it progresses
  let fl=null,flStep=-1;
  function fly(active,p){if(!ctx)return;
    if(!fl){const s=ctx.createBufferSource();s.buffer=noise();s.loop=true;const hp=ctx.createBiquadFilter();hp.type='highpass';hp.frequency.value=900;
      const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=.7;const ng=ctx.createGain();ng.gain.value=0;s.connect(hp);hp.connect(bp);bp.connect(ng);ng.connect(bus(.8,.9,.15));
      const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;lp.Q.value=.6;const pg=ctx.createGain();pg.gain.value=0;lp.connect(pg);pg.connect(bus(.6,1,.25));
      const os=[293.66,440,587.33,739.99,880].map((f,i)=>{const o=ctx.createOscillator();o.type=i<2?'sine':'triangle';o.frequency.value=f;o.detune.value=(i%2?6:-6);o.connect(lp);o.start();return o});
      s.start();fl={bp,ng,lp,pg,os}}
    const t=T(),v=active&&on?1:0,q=Math.max(0,Math.min(1,p));
    fl.bp.frequency.setTargetAtTime(1400+q*5200,t,.15);
    fl.ng.gain.setTargetAtTime(v*(.05+.09*Math.sin(q*Math.PI)),t,v?.25:.6);
    fl.lp.frequency.setTargetAtTime(1600+q*4200,t,.2);
    fl.pg.gain.setTargetAtTime(v*.022,t,v?.4:.9);
    fl.os.forEach((o,i)=>o.frequency.setTargetAtTime([293.66,440,587.33,739.99,880][i]*(1+q*.26),t,.3));
    // a rising music-box note every tenth of the flight
    const st=active?Math.floor(q*10):-1; if(active&&on&&st>flStep&&flStep>=0)box(pick(4+st),t,.045,.9,.5);if(st%2)box(pick(6+st),t+.09,.03,.7,.5); flStep=active?st:-1}
  function set(v){on=v;if(!v&&fl){fly(false,0)}btn.setAttribute('aria-pressed',String(on));btn.classList.toggle('on',on);btn.querySelector('span').textContent=on?'소리 끄기':'소리 켜기';btn.title=on?'소리 끄기':'소리 켜기';wrap.classList.toggle('on',on);
    try{sessionStorage.setItem('cf-sound',on?'1':'0')}catch(e){}
    if(on){if(!ctx)init();ctx.resume();play('on')}}
  // ---- droplet: hover (or long-press on touch) splits off the settings bubble ----
  let lpT=0,lpFired=false,hideT=0;
  const openDrop=()=>{};
  const closeDrop=()=>{if(wrap.classList.contains('panel'))return;clearTimeout(hideT);hideT=setTimeout(()=>{wrap.classList.remove('drop');setB.tabIndex=-1},380)};
  wrap.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openDrop()});
  wrap.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse')closeDrop()});
  btn.addEventListener('pointerdown',e=>{lpFired=false;clearTimeout(lpT);if(0)lpT=setTimeout(()=>{lpFired=true;openDrop();if(navigator.vibrate)try{navigator.vibrate(12)}catch(_){}} ,450)});
  ['pointerup','pointercancel','pointerleave'].forEach(ev=>btn.addEventListener(ev,()=>clearTimeout(lpT)));
  btn.addEventListener('contextmenu',e=>e.preventDefault());
  btn.addEventListener('click',e=>{if(lpFired){e.preventDefault();lpFired=false;return}set(!on)});
  btn.addEventListener('focus',openDrop);
  const showPanel=v=>{wrap.classList.toggle('panel',v);setB.setAttribute('aria-expanded',String(v));if(v){openDrop();syncUI()}else closeDrop()};
  setB.addEventListener('click',()=>showPanel(!wrap.classList.contains('panel')));
  panel.querySelector('.sp-x').addEventListener('click',()=>showPanel(false));
  document.addEventListener('pointerdown',e=>{if(!wrap.contains(e.target)){if(wrap.classList.contains('panel'))showPanel(false);else if(wrap.classList.contains('drop')&&e.pointerType!=='mouse'){wrap.classList.remove('drop')}}});
  addEventListener('keydown',e=>{if(e.key==='Escape'&&wrap.classList.contains('panel')){showPanel(false);btn.focus()}});
  ['wheel','touchmove'].forEach(ev=>panel.addEventListener(ev,e=>e.stopPropagation(),{passive:true}));
  const pct=v=>Math.round(v*100)+'%';
  function syncUI(){panel.querySelectorAll('input[type=range]').forEach(i=>{i.value=P[i.dataset.k];i.style.setProperty('--f',pct(P[i.dataset.k]))});
    panel.querySelectorAll('[data-v]').forEach(e=>e.textContent=pct(P[e.dataset.v]));
    panel.querySelectorAll('[data-m]').forEach(b=>b.classList.toggle('on',b.dataset.m===P.mood));
    panel.querySelectorAll('[data-t]').forEach(b=>b.classList.toggle('on',b.dataset.t===P.tex));
    panel.querySelectorAll('[data-o]').forEach(b=>b.classList.toggle('on',+b.dataset.o===(P.oct||0)));
    panel.querySelector('[data-k=ix]').checked=!!P.ix}
  let tryT=0;const audition=()=>{if(!on)set(true);clearTimeout(tryT);tryT=setTimeout(()=>{const t=T();arp(t,[0,2,3,5,7],.09,.07);glass(pick(8),t+.5,.045,2.2)},60)};
  const changed=(aud)=>{saveP();applyP();syncUI();if(aud)audition()};
  panel.addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;
    if(e.target.type==='checkbox')P[k]=e.target.checked;else{P[k]=+e.target.value;if(k!=='vol')P.mood='사용자'}changed(false)});
  panel.addEventListener('change',e=>{if(e.target.type==='range')audition()});
  panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.m){Object.assign(P,MOODS[b.dataset.m],{mood:b.dataset.m});changed(true)}
    else if(b.dataset.t){P.tex=b.dataset.t;changed(true)}
    else if(b.dataset.o!=null){P.oct=+b.dataset.o;P.mood='사용자';changed(true)}
    else if(b.classList.contains('sp-try'))audition();
    else if(b.classList.contains('sp-reset')){Object.assign(P,{vol:.8,tex:'musicbox',mood:'몽환',ix:true},MOODS['몽환']);changed(true)}});
  syncUI();
  try{if(sessionStorage.getItem('cf-sound')==='1'){btn.classList.add('hint');btn.querySelector('span').textContent='소리 다시 켜기'}}catch(e){}
  // watch the page and fire cues on moments
  const W={sec:null,ia:-1,wa:-1,act:0,k:-1,hov:0,first:true};
  const SECS=['intro','world-a','context-vision','turn','projects'];
  return {play,shimmer,fly,
    tick(){if(!on)return;
      let cur=null;for(const id of SECS){const r=$('#'+id).getBoundingClientRect();if(r.top<=VH*.5&&r.bottom>VH*.5)cur=id}
      if(cur!==W.sec){const prev=W.sec;W.sec=cur;if(!W.first&&cur&&prev!==null&&cur!=='turn')Sound.play('section');W.first=false}
      // the turn ("하지만,") — one cue per beat, fired going forward
      const tp=turn.p, TB=[[.02,'preHit'],[.1,'lens'],[.24,'question'],[.47,'shatter'],[.56,'core',0],[.59,'core',1],[.62,'core',2],[.66,'answer'],[.88,'release']];
      let tb=-1;TB.forEach((b,i)=>{if(tp>=b[0])tb=i});
      if(tb!==W.tb){if(W.tb!==undefined&&tb>W.tb&&tb-W.tb<=2){for(let i=W.tb+1;i<=tb;i++)Sound.play(TB[i][1],TB[i][2])}W.tb=tb}
      // intro: colour-mix shimmer follows the pointer over the aurora
      Sound.shimmer(intro.p<.15);
      // intro flight: start and landing
      const ip=intro.p,ia=ip<.04?0:ip<.85?1:2; if(ia!==W.ia){if(W.ia===0&&ia===1)Sound.play('introFly');if(W.ia===1&&ia===2)Sound.play('introLand');W.ia=ia}
      // world chapter cards
      const wa=worldA.act??-1; if(wa!==W.wa){if(W.wa>=0&&wa>=0)Sound.play('card',wa>W.wa?1:-1);W.wa=wa}
      // map: dive into first person, product stops, hover
      const k=pj.p>.12?1:0; if(k!==W.k){if(W.k===0&&k===1)Sound.play('dive');W.k=k}
      if(FP.act&&FP.act!==W.act)Sound.play('stop',FP.act-1); W.act=FP.act||0;
      if(FP.hover&&FP.hover!==W.hov)Sound.play('hover'); W.hov=FP.hover||0;
    }};
})();

window.__site={map,openCard,openDetail,closeDetail};
})();

/* ---- right-side progress: the five scenes of the site ---- */
window.SPRAIL={sections:()=>[['intro','INTRO'],['world-a','WORLD'],['context-vision','EPILOGUE'],['turn','QUESTION'],['projects','PROJECTS']].map(([id,label])=>({el:document.getElementById(id),label})),
  go:el=>jumpTo(el.id==='intro'?0:(HOLDS[el.id]?holdY(el.id,0):el.offsetTop))};
/* right-edge liquid-glass progress: a thin glass edge that dents in where you are, and settles flat when you stop */
(function(){
  const cfg=window.SPRAIL||{};
  const pick=cfg.sections||(()=>{const seen=new Set(),out=[];document.querySelectorAll(cfg.links||'header a[href^="#"]').forEach(a=>{const id=a.getAttribute('href').slice(1);if(!id||seen.has(id))return;const el=document.getElementById(id);if(!el)return;seen.add(id);out.push({el,label:(a.textContent||'').replace(/^[←↑\s]+/,'').trim()||id})});return out});
  const goto=cfg.go||(el=>{const t=(el.closest('.pin-spacer')||el).getBoundingClientRect().top+scrollY;window.scrollTo({top:Math.max(0,t-(cfg.offset||0)),behavior:'smooth'})});
  const topOf=el=>(el.closest('.pin-spacer')||el).getBoundingClientRect().top+scrollY;
  const NS='http://www.w3.org/2000/svg';
  let secs=[],rail,glass,svg,body,rim,prog,bead,now,ticks=[],cur=-1,flT=0,raf=0;
  const S={py:0,vy:0,amp:0,last:0,lastY:scrollY,vel:0,over:false};
  function build(){
    secs=pick().filter(s=>s.el); if(!secs.length)return;
    if(!rail){rail=document.createElement('nav');rail.className='sprail';rail.setAttribute('aria-label','페이지 진행 위치');document.body.appendChild(rail)}
    const id='spg'+Math.random().toString(36).slice(2,7);
    rail.innerHTML=`<svg aria-hidden="true"><defs>
      <linearGradient id="${id}b" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".35" stop-color="#fff" stop-opacity=".08"/><stop offset=".8" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity=".6"/></linearGradient>
      <linearGradient id="${id}p" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#C9C6FF" stop-opacity=".9"/><stop class="sp-s1" offset=".5" stop-color="#E9B8E4" stop-opacity=".9"/><stop class="sp-s2" offset=".6" stop-color="#EDEBFF" stop-opacity=".45"/><stop offset="1" stop-color="#EDEBFF" stop-opacity=".45"/></linearGradient>
      <radialGradient id="${id}d" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#fff"/><stop offset=".45" stop-color="#F3F0FF"/><stop offset="1" stop-color="#B8B6E5"/></radialGradient></defs>
      <path class="sp-tint" fill="url(#${id}p)"/><path class="sp-body" fill="url(#${id}b)"/>
      <path class="sp-rim" fill="none" stroke="rgba(255,255,255,.95)" stroke-width="1.2"/><path class="sp-rim2" fill="none" stroke="rgba(90,80,170,.28)" stroke-width="1"/>
</svg><div class="sp-hit"></div>`+
      secs.map((s,i)=>`<button type="button" class="sp-tick" data-i="${i}" aria-label="${s.label}(으)로 이동"><span>${String(i+1).padStart(2,'0')} · ${s.label}</span></button>`).join('')+'<div class="sp-now" aria-live="polite"></div>';
    svg=rail.querySelector('svg');body=rail.querySelector('.sp-body');prog=rail.querySelector('.sp-tint');rail.s1=rail.querySelector('.sp-s1');rail.s2=rail.querySelector('.sp-s2');rim=rail.querySelector('.sp-rim');
    rail.rim2=rail.querySelector('.sp-rim2');now=rail.querySelector('.sp-now');ticks=[...rail.querySelectorAll('.sp-tick')];
    ticks.forEach(b=>{b.addEventListener('click',()=>goto(secs[+b.dataset.i].el));b.addEventListener('pointerenter',()=>rail.classList.add('sp-hov'));b.addEventListener('pointerleave',()=>rail.classList.remove('sp-hov'))});
    rail.querySelector('.sp-hit').addEventListener('pointerenter',()=>{S.over=true;rail.classList.add('sp-over');kick()});
    rail.addEventListener('pointerleave',()=>{S.over=false;rail.classList.remove('sp-over');kick()});
    cur=-1;place();S.py=target();kick()}
  const maxY=()=>Math.max(1,document.documentElement.scrollHeight-innerHeight);
  const PAD=()=>Math.min(70,innerHeight*.08);
  const target=()=>{const f=Math.min(1,Math.max(0,scrollY/maxY()));return PAD()+f*(innerHeight-2*PAD())};
  function place(){const M=maxY(),P=PAD(),H=innerHeight-2*P;secs.forEach((s,i)=>{s.y=Math.min(M,topOf(s.el));ticks[i].style.top=(P+s.y/M*H).toFixed(1)+'px'})}
  function kick(){S.last=performance.now();if(!raf)raf=requestAnimationFrame(frame)}
  function frame(t){raf=0;const H=innerHeight,W=rail.clientWidth,idle=t-S.last;
    const tgt=target(); const k=.16,d=.72; S.vy=(S.vy+(tgt-S.py)*k)*d; S.py+=S.vy;              // springy follow = liquid lag
    const active=S.over||idle<900; S.amp+=((active?1:0)-S.amp)*(active?.18:.06);
    const v=Math.min(1,Math.abs(S.vy)/40), depth=S.amp*(14+12*v), base=5+S.amp*5, sig=38+30*v+20*S.amp;
    const xs=y=>W-(base+depth*Math.exp(-Math.pow((y-S.py)/sig,2)));
    let d1=`M${W} 0`,rimD='';for(let y=0;y<=H+8;y+=6){const x=xs(Math.min(y,H)).toFixed(2);d1+=` L${x} ${Math.min(y,H)}`;rimD+=(rimD?' L':'M')+x+' '+Math.min(y,H)}
    d1+=` L${W} ${H} Z`; body.setAttribute('d',d1); rim.setAttribute('d',rimD); rail.rim2.setAttribute('d',rimD.replace(/(\d+\.\d+) /g,(m,x)=>(+x-1).toFixed(2)+' '));
    prog.setAttribute('d',d1); prog.style.opacity=(.6+.35*S.amp).toFixed(2);
    const f=S.py/H; rail.s1.setAttribute('offset',Math.max(0,f-.01).toFixed(4)); rail.s2.setAttribute('offset',Math.min(1,f+.12).toFixed(4));   // passed part saturated, the rest pale
    ticks.forEach(b=>{const y=parseFloat(b.style.top);b.style.setProperty('--tx',(W-xs(y)-2).toFixed(1)+'px');b.style.setProperty('--to','0')});
    now.style.transform=`translate(${(xs(S.py)-8).toFixed(1)}px,${S.py.toFixed(1)}px) translate(-100%,-50%)`;
    // current section
    const y=scrollY;let c=0;secs.forEach((s,i)=>{if(y+innerHeight*.35>=s.y)c=i});
    if(c!==cur){const first=cur<0;cur=c;now.innerHTML=`<b>${String(c+1).padStart(2,'0')}</b>${secs[c].label}`;if(!first||y>10){rail.classList.add('sp-flash');clearTimeout(flT);flT=setTimeout(()=>rail.classList.remove('sp-flash'),1800)}}
    if(Math.abs(tgt-S.py)>.3||Math.abs(S.vy)>.05||S.amp>.003&&!active||active)raf=requestAnimationFrame(frame);
    if(!active&&S.amp<.004&&Math.abs(S.vy)<.05&&Math.abs(tgt-S.py)<.3){S.amp=0;cancelAnimationFrame(raf);raf=0;draw0()}}
  function draw0(){/* one last flat frame already drawn */}
  addEventListener('scroll',kick,{passive:true});addEventListener('wheel',kick,{passive:true});addEventListener('touchmove',kick,{passive:true});
  addEventListener('resize',()=>{place();kick()});
  const init=()=>{build();setTimeout(()=>{place();kick()},800);setTimeout(()=>{place();kick()},2500)};
  if(document.readyState==='complete')init();else addEventListener('load',init);
  window.SPRAIL_REFRESH=()=>{place();kick()};
})();


/* ======================= EPILOGUE · ISOMETRIC WALK ======================= */
(()=>{
const root=document.getElementById('context-vision'); if(!root||root.dataset.iv)return; root.dataset.iv='1';
const svg=document.getElementById('ivSvg'), NS='http://www.w3.org/2000/svg', lines=[...root.querySelectorAll('.iv-line')];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const el=(t,a={},p)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e};
const C30=Math.cos(Math.PI/6), K=1;
const iso=(x,y,z=0)=>[(x-y)*C30*K,(x+y)*.5*K-z*K];
const P=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)), lerp=(a,b,t)=>a+(b-a)*t, ss=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
// ---------- defs ----------
const defs=el('defs',{},svg);
defs.innerHTML=`<linearGradient id="ivG" x1="0" x2="1"><stop stop-color="#9CC8E2"/><stop offset=".5" stop-color="#B8B6E5"/><stop offset="1" stop-color="#E8B0DD"/></linearGradient>
<radialGradient id="ivMe"><stop stop-color="#fff"/><stop offset=".35" stop-color="#e6d9ff" stop-opacity=".95"/><stop offset="1" stop-color="#b8a6ee" stop-opacity="0"/></radialGradient>
<radialGradient id="ivPink"><stop stop-color="#ffbcd6" stop-opacity=".95"/><stop offset="1" stop-color="#ffbcd6" stop-opacity="0"/></radialGradient>
<radialGradient id="ivCrowd"><stop stop-color="#f4a6c7" stop-opacity=".6"/><stop offset="1" stop-color="#f4a6c7" stop-opacity="0"/></radialGradient>
<radialGradient id="ivLamp"><stop stop-color="#ffe2c4" stop-opacity=".9"/><stop offset="1" stop-color="#ffe2c4" stop-opacity="0"/></radialGradient>
<linearGradient id="ivBeam" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b9a5f3" stop-opacity=".55"/><stop offset="1" stop-color="#efc2de" stop-opacity=".06"/></linearGradient>
<filter id="ivSh" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#6d5a9c" flood-opacity=".14"/></filter>
<filter id="ivB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="ivB4"><feGaussianBlur stdDeviation="4"/></filter>`;
const world=el('g',{},svg);
const gGround=el('g',{},world), gFloor=el('g',{},world), gTrail=el('g',{},world), gObj=el('g',{},world), gPeople=el('g',{},world), gCam=el('g',{},world), gMe=el('g',{},world);
// ---------- layout (world units; walkway runs along +y) ----------
const WW=70, L0=-500, L1=1500;
const gate=1080, seat=[150,1330];
const quad=(x0,y0,x1,y1,z=0)=>[iso(x0,y0,z),iso(x1,y0,z),iso(x1,y1,z),iso(x0,y1,z)];
el('polygon',{points:P(quad(-520,L0,520,L1+100)),fill:'#fbf9fe'},gGround);
el('polygon',{points:P(quad(-WW,L0,WW,gate)),fill:'#f3eff9'},gGround);
[-WW+14,WW-14].forEach(x=>el('line',{x1:iso(x,L0)[0],y1:iso(x,L0)[1],x2:iso(x,gate)[0],y2:iso(x,gate)[1],stroke:'#e6def1','stroke-width':1.6,'stroke-dasharray':'4 12'},gGround));
// side lane used by the detour (scene 2)
el('polygon',{points:P(quad(-WW-110,520,-WW,820)),fill:'#f7f4fb'},gGround);
// lanes after gate
el('polygon',{points:P(quad(-WW-140,gate+30,-12,L1+80)),fill:'#efedf3'},gGround);
const laneOn=el('polygon',{points:P(quad(12,gate+30,WW+170,L1+80)),fill:'url(#ivG)',opacity:.12},gGround);
const laneEdge=el('polygon',{points:P(quad(12,gate+30,WW+170,L1+80)),fill:'none',stroke:'url(#ivG)','stroke-width':2.2,opacity:0},gGround);
// glows that the AI switches on (floor layer)
const truckGlow=el('ellipse',{rx:150,ry:90,fill:'url(#ivPink)',filter:'url(#ivB)',opacity:0},gFloor);
const crowdFog=el('ellipse',{rx:190,ry:110,fill:'url(#ivCrowd)',filter:'url(#ivB)',opacity:0},gFloor);
const seatRing=el('ellipse',{rx:34,ry:17,fill:'none',stroke:'url(#ivG)','stroke-width':2.5,'stroke-dasharray':'5 5',opacity:0},gFloor);
// detour light band
const detourPts=[[0,470],[-40,540],[-120,610],[-128,690],[-112,770],[-40,840],[0,900]];
const detourD='M'+detourPts.map(([x,y])=>iso(x,y).map(v=>v.toFixed(1)).join(' ')).join(' L');
const detourGlow=el('path',{d:detourD,fill:'none',stroke:'url(#ivG)','stroke-width':46,'stroke-linecap':'round','stroke-linejoin':'round',filter:'url(#ivB4)',opacity:0},gFloor);
const detourLine=el('path',{d:detourD,fill:'none',stroke:'url(#ivG)','stroke-width':5,'stroke-linecap':'round','stroke-linejoin':'round',opacity:0},gFloor);
const detourLen=detourLine.getTotalLength?detourLine.getTotalLength():800;
detourLine.setAttribute('stroke-dasharray',detourLen);detourGlow.setAttribute('stroke-dasharray',detourLen);
// ---------- static objects ----------
const objs=[];
function box(x,y,w,d,h,top,s1,s2,extra){objs.push({k:x+y+w+d,f:g=>{
  el('polygon',{points:P([iso(x,y+d,0),iso(x+w,y+d,0),iso(x+w,y+d,h),iso(x,y+d,h)]),fill:s1},g);
  el('polygon',{points:P([iso(x+w,y,0),iso(x+w,y+d,0),iso(x+w,y+d,h),iso(x+w,y,h)]),fill:s2},g);
  el('polygon',{points:P(quad(x,y,x+w,y+d,h)),fill:top,stroke:'#fff','stroke-width':1.4},g);
  if(extra)extra(g)}})}
function tent(x,y,w,col){box(x,y,w,w,26,'#fff','#efe8f6','#e4daf1',g=>{const a=iso(x+w/2,y+w/2,58);
  [[[x,y+w],[x+w,y+w],col],[[x+w,y],[x+w,y+w],'#f4ebf7'],[[x,y],[x+w,y],'#fbf7fd'],[[x,y],[x,y+w],'#fff']].forEach(([p,q,c])=>el('polygon',{points:P([iso(...p,30),iso(...q,30),a]),fill:c,stroke:'#fff','stroke-width':1},g))})}
function table(x,y){objs.push({k:x+y,f:g=>{const c=iso(x,y,8);el('ellipse',{cx:c[0],cy:c[1],rx:15,ry:7.5,fill:'#fff',stroke:'#e4dbef','stroke-width':1.5,filter:'url(#ivSh)'},g);
  [[22,0],[-22,0],[0,22],[0,-22]].forEach(([dx,dy])=>{const s=iso(x+dx,y+dy,4);el('ellipse',{cx:s[0],cy:s[1],rx:5,ry:2.6,fill:'#ebe3f5'},g)})}})}
function bed(x,y,w,d){box(x,y,w,d,10,'#eef6f1','#dcece3','#d3e6db',g=>{for(let i=0;i<w/16;i++)for(let j=0;j<d/16;j++){const s=iso(x+8+i*16,y+8+j*16,14);el('circle',{cx:s[0],cy:s[1],r:4+((i*7+j*3)%3),fill:['#cfe8d8','#ead4ee','#dfe9f7'][(i+j)%3]},g)}})}
function lamp(x,y){objs.push({k:x+y,f:g=>{const b=iso(x,y),t=iso(x,y,70);el('line',{x1:b[0],y1:b[1],x2:t[0],y2:t[1],stroke:'#e4dbef','stroke-width':2},g);el('circle',{cx:t[0],cy:t[1],r:22,fill:'url(#ivLamp)'},g);el('circle',{cx:t[0],cy:t[1],r:4,fill:'#fff',stroke:'#f2dcc8'},g)}})}
// left side (x<-WW) and right side (x>WW)
tent(-300,-380,110,'#e7eef9'); tent(150,-300,110,'#f3e6f3'); bed(-240,-150,140,40); lamp(-WW-24,-200); lamp(WW+24,-60);
tent(-310,20,120,'#eee6fb'); bed(130,40,60,120);
// food truck (right of walkway at y≈200)
const TR={x:WW+40,y:150};
box(TR.x,TR.y,90,150,70,'#fff','#efe6f5','#f6dbe8',g=>{const a=quad(TR.x+10,TR.y+12,TR.x+80,TR.y+60,70);el('polygon',{points:P(a),fill:'#f6e2ee'},g)});
const truckWin=el('polygon',{points:P([iso(TR.x,TR.y+40,18),iso(TR.x,TR.y+110,18),iso(TR.x,TR.y+110,50),iso(TR.x,TR.y+40,50)]),fill:'#efe5f4'});
objs.push({k:TR.x+TR.y+400,f:g=>g.appendChild(truckWin)});
table(WW+200,180);table(WW+230,280);table(WW+175,360);
tent(-300,250,110,'#f6e8ee'); lamp(-WW-24,330);
// scene 2 surroundings
tent(170,520,120,'#e8eef9'); bed(-330,520,150,40); tent(-330,640,110,'#f3e6f3'); table(WW+150,760); table(WW+220,820); lamp(WW+24,620); lamp(-WW-150,880);
tent(160,900,110,'#eee6fb'); bed(-300,900,180,40);
// gate (scene 3)
box(-WW-36,gate-12,26,24,110,'#fff','#ece4f5','#e2d8ef'); box(WW+10,gate-12,26,24,110,'#fff','#ece4f5','#e2d8ef');
objs.push({k:gate*2+200,f:g=>{el('polygon',{points:P([iso(-WW-36,gate,110),iso(WW+36,gate,110),iso(WW+36,gate,126),iso(-WW-36,gate,126)]),fill:'#f3edf9',stroke:'#fff','stroke-width':1.2},g)}});
// stage
box(-60,L1-20,260,120,40,'#f1e9fb','#e6dcf5','#ddd0f1',g=>{const a=quad(-40,L1-8,180,L1+40,40);el('polygon',{points:P(a),fill:'#f6dbe9'},g)});
bed(-WW-150,gate+60,60,40); tent(WW+200,gate+20,100,'#e8eef9');
objs.sort((a,b)=>a.k-b.k).forEach(o=>o.f(gObj));
// ---------- cameras ----------
const CAMS=[{x:-WW-40,y:120,h:120},{x:WW+50,y:470,h:120},{x:-WW-70,y:860,h:120},{x:0,y:gate,h:128}];
CAMS.forEach(c=>{const b=iso(c.x,c.y),t=iso(c.x,c.y,c.h);c.t=t;
  if(c.y!==gate)el('line',{x1:b[0],y1:b[1],x2:t[0],y2:t[1],stroke:'#e1d7ef','stroke-width':3},gCam);
  c.beam=el('polygon',{fill:'url(#ivBeam)',opacity:0},gCam);
  c.line=el('line',{stroke:'#b8a6ee','stroke-width':1.2,'stroke-dasharray':'3 6',opacity:0},gCam);
  el('circle',{cx:t[0],cy:t[1],r:13,fill:'#fff',filter:'url(#ivSh)'},gCam);c.dot=el('circle',{cx:t[0],cy:t[1],r:6.5,fill:'url(#ivG)',opacity:.4},gCam);el('circle',{cx:t[0],cy:t[1],r:2.2,fill:'#fff'},gCam)});
const scan=el('ellipse',{fill:'none',stroke:'#b8a6ee','stroke-width':2,opacity:0},gCam);
// ---------- people ----------
const COLS=['#ddd3ea','#ead6e4','#d6e0ee','#e3dcef'];
let seed=7;const rnd=()=>(seed=(seed*9301+49297)%233280)/233280;
const people=[];
function addP(n,f){for(let i=0;i<n;i++)people.push(Object.assign({c:COLS[i%4],ph:rnd()*6.28,sp:.4+rnd()*.6},f(i)))}
addP(9,i=>({kind:'cross',y:205+rnd()*60,x0:-WW-40,x1:WW+30,o:rnd()}));                // crossing in front of the truck
addP(10,i=>({kind:'wander',x:(rnd()-.5)*110,y:-420+rnd()*560}));
addP(26,i=>({kind:'crowd',x:(rnd()-.5)*120,y:600+rnd()*190}));                       // cluster ahead (scene 2)
addP(8,i=>({kind:'wander',x:(rnd()-.5)*110,y:880+rnd()*180}));
addP(16,i=>({kind:'lane',x:-WW-120+rnd()*100,y:gate+80+rnd()*360,grey:true}));
addP(9,i=>({kind:'lane',x:30+rnd()*150,y:gate+90+rnd()*330}));
people.forEach(p=>{p.g=el('g',{},gPeople);el('ellipse',{rx:6,ry:3,cy:1,fill:'#6d5a9c',opacity:.12},p.g);p.b=el('rect',{x:-4.5,y:-20,width:9,height:18,rx:4.5,fill:p.grey?'#e2dde8':p.c},p.g);el('circle',{cy:-25,r:4.6,fill:p.grey?'#e2dde8':p.c},p.g)});
// ---------- me ----------
const trail=el('path',{fill:'none',stroke:'url(#ivG)','stroke-width':4,'stroke-linecap':'round','stroke-linejoin':'round',opacity:.85},gTrail);
const hes=[0,1,2,3].map(i=>el('ellipse',{rx:7,ry:3.5,fill:'#cdbdf3',opacity:0},gTrail));
const toTruck=el('path',{fill:'none',stroke:'#ff9cc3','stroke-width':2.6,'stroke-dasharray':'2 7','stroke-linecap':'round',opacity:0},gTrail);
const toSeat=el('path',{fill:'none',stroke:'url(#ivG)','stroke-width':2.6,'stroke-dasharray':'3 8','stroke-linecap':'round',opacity:0},gTrail);
const meHalo=el('ellipse',{rx:62,ry:31,fill:'url(#ivMe)'},gMe);
const meRing=el('ellipse',{rx:22,ry:11,fill:'none',stroke:'url(#ivG)','stroke-width':3},gMe);
const meRing2=el('ellipse',{rx:32,ry:16,fill:'none',stroke:'url(#ivG)','stroke-width':1.8,opacity:0},gMe);
const meBody=el('g',{},gMe);el('rect',{x:-7,y:-30,width:14,height:27,rx:7,fill:'url(#ivG)'},meBody);el('circle',{cy:-37,r:7,fill:'url(#ivG)',stroke:'#fff','stroke-width':2},meBody);
const pulse=el('ellipse',{fill:'none',stroke:'#b8a6ee','stroke-width':2,opacity:0},gMe);
// ---------- path of 'me' (world coords) as a function of progress ----------
function mePos(p,t){
  // beat 1: walk to the truck, hesitate, step toward the window
  if(p<.33){const a=ss(0,.17,p); let x=lerp(0,40,a), y=lerp(-260,210,a);
    const h=ss(.13,.22,p)*(1-ss(.24,.3,p)); x+=Math.sin(t*3.1)*10*h; y+=Math.sin(t*2.3+1)*7*h;
    const go=ss(.24,.33,p); x=lerp(x,0,go); y=lerp(y,470,go); return [x,y]}
  // beat 2: follow the light band around the crowd
  if(p<.66){const a=ss(.36,.64,p), n=detourPts.length-1, f=a*n, i=Math.min(n-1,Math.floor(f)), u=f-i;
    const A=detourPts[i],B=detourPts[i+1]; let x=lerp(A[0],B[0],u), y=lerp(A[1],B[1],u);
    const pre=ss(.33,.36,p); if(pre<1){x=lerp(0,x,pre);y=lerp(470,y,pre)} return [x,y]}
  // beat 3: through the gate, into the student lane, to a free spot by the stage
  const a=ss(.67,.84,p), b=ss(.84,.97,p);
  let x=lerp(0,0,a), y=lerp(900,gate+60,a); x=lerp(x,seat[0]-30,b); y=lerp(y,seat[1]-40,b); return [x,y]}
// ---------- render ----------
let VW=innerWidth,VH=innerHeight; const hist=[];
function size(){VW=innerWidth;VH=innerHeight;svg.setAttribute('viewBox',`0 0 ${VW} ${VH}`)}
size(); addEventListener('resize',size,{passive:true});
function prog(){const r=root.getBoundingClientRect(),tot=Math.max(1,root.offsetHeight-innerHeight);return clamp(-r.top/tot)}
function inView(){const r=root.getBoundingClientRect();return r.bottom>-50&&r.top<innerHeight+50}
let last=-1;
function frame(now){
  requestAnimationFrame(frame); if(!inView())return;
  const t=RM?0:now/1000, p=prog(), mob=VW<760;
  const [mx,my]=mePos(p,t), ms=iso(mx,my);
  // camera: keep 'me' fixed on screen; gentle zoom-out at the very end
  const sc=(mob?.78:1)*lerp(1,.86,ss(.9,1,p)), ax=mob?VW*.5:VW*.64, ay=VH*(mob?.42:.55);
  world.setAttribute('transform',`translate(${(ax-ms[0]*sc).toFixed(1)},${(ay-ms[1]*sc).toFixed(1)}) scale(${sc.toFixed(4)})`);
  // copy: one line per beat
  const B=[[0,.31],[.35,.64],[.68,1.01]];
  lines.forEach((l,i)=>{const [a,b]=B[i];const o=ss(a,a+.04,p)*(1-ss(b,b+.03,p));l.style.opacity=o.toFixed(3);
    const dy=(1-ss(a,a+.04,p))*24-ss(b,b+.03,p)*24; l.style.transform=mob?`translateY(${dy.toFixed(1)}px)`:`translateY(calc(-50% + ${dy.toFixed(1)}px))`;l.style.filter=o<.99?`blur(${((1-o)*6).toFixed(2)}px)`:'none'});
  // me
  meHalo.setAttribute('cx',ms[0]);meHalo.setAttribute('cy',ms[1]);[meRing,meRing2,pulse].forEach(e=>{e.setAttribute('cx',ms[0]);e.setAttribute('cy',ms[1])});
  meBody.setAttribute('transform',`translate(${ms[0].toFixed(1)},${ms[1].toFixed(1)})`);
  const carry=ss(.33,.38,p)*(1-ss(.62,.66,p)); meRing2.setAttribute('opacity',(carry*.8).toFixed(2));
  const isStudent=ss(.72,.78,p); meRing.setAttribute('stroke-width',(3+isStudent*1.5).toFixed(1));
  // trail (world points sampled along progress)
  const pts=[];for(let k=0;k<=40;k++){const q=Math.max(0,p-.42+k*.0105);if(q>p)break;const w=mePos(q,0);pts.push(iso(w[0],w[1]))}
  pts.push(ms); trail.setAttribute('d','M'+pts.map(v=>v[0].toFixed(1)+' '+v[1].toFixed(1)).join(' L'));
  // hesitation echoes + pulse
  const h=ss(.13,.2,p)*(1-ss(.26,.3,p));
  hes.forEach((e,i)=>{const w=iso(40+Math.sin(t*3.1-i*.7)*10,210+Math.sin(t*2.3+1-i*.7)*7);e.setAttribute('cx',w[0]);e.setAttribute('cy',w[1]);e.setAttribute('opacity',(h*(.15+i*.1)).toFixed(2))});
  const pul=(t*.9)%1, pk=ss(.18,.22,p)*(1-ss(.3,.33,p))+ss(.75,.79,p)*(1-ss(.86,.9,p));
  pulse.setAttribute('rx',(22+pul*60).toFixed(1));pulse.setAttribute('ry',(11+pul*30).toFixed(1));pulse.setAttribute('opacity',(pk*(1-pul)*.8).toFixed(2));
  // food truck responds
  const tw=ss(.19,.24,p)*(1-ss(.34,.4,p)); const c=iso(TR.x,TR.y+75);
  truckGlow.setAttribute('cx',c[0]);truckGlow.setAttribute('cy',c[1]);truckGlow.setAttribute('opacity',tw.toFixed(2));
  truckWin.setAttribute('fill',tw>.05?`rgba(255,156,195,${(.35+.5*tw).toFixed(2)})`:'#efe5f4');
  const wn=iso(TR.x,TR.y+75);toTruck.setAttribute('d',`M${ms[0]} ${ms[1]} Q${(ms[0]+wn[0])/2} ${(ms[1]+wn[1])/2-20} ${wn[0]} ${wn[1]}`);toTruck.setAttribute('opacity',(ss(.21,.25,p)*(1-ss(.28,.32,p))).toFixed(2));
  // crowd + detour
  const cf=ss(.3,.4,p)*(1-ss(.68,.76,p)), cc=iso(0,700);crowdFog.setAttribute('cx',cc[0]);crowdFog.setAttribute('cy',cc[1]);crowdFog.setAttribute('opacity',cf.toFixed(2));
  const dl=ss(.37,.45,p)*(1-ss(.68,.74,p)), dd=detourLen*(1-ss(.37,.47,p));
  detourLine.setAttribute('opacity',dl.toFixed(2));detourGlow.setAttribute('opacity',(dl*.28).toFixed(2));detourLine.setAttribute('stroke-dashoffset',dd);detourGlow.setAttribute('stroke-dashoffset',dd);
  // lanes + seat
  laneOn.setAttribute('opacity',(.12+isStudent*.3).toFixed(2));laneEdge.setAttribute('opacity',isStudent.toFixed(2));
  const st=iso(seat[0],seat[1]);seatRing.setAttribute('cx',st[0]);seatRing.setAttribute('cy',st[1]);seatRing.setAttribute('opacity',(ss(.8,.86,p)).toFixed(2));
  toSeat.setAttribute('d',`M${ms[0]} ${ms[1]} L${st[0]} ${st[1]}`);toSeat.setAttribute('opacity',(ss(.79,.84,p)*(1-ss(.95,.99,p))).toFixed(2));
  // gate scan
  const sp=ss(.72,.75,p)*(1-ss(.8,.84,p)), gs=iso(0,gate), sr=(t*1.2)%1;
  scan.setAttribute('cx',gs[0]);scan.setAttribute('cy',gs[1]);scan.setAttribute('rx',(30+sr*110).toFixed(1));scan.setAttribute('ry',(15+sr*55).toFixed(1));scan.setAttribute('opacity',(sp*(1-sr)).toFixed(2));
  // cameras: nearest one tracks strongly, others dim
  let best=null,bd=1e9;CAMS.forEach(c=>{const d=Math.abs(c.y-my)+Math.abs(c.x-mx)*.5;if(d<bd){bd=d;best=c}});
  CAMS.forEach(c=>{const on=c===best?1:0;c.k=lerp(c.k??0,on,.12);
    const dx=ms[0]-c.t[0],dy=ms[1]-c.t[1],L=Math.hypot(dx,dy)||1,nx=-dy/L,ny=dx/L,w=34;
    c.beam.setAttribute('points',P([c.t,[ms[0]+nx*w,ms[1]+ny*w*.6+8],[ms[0]-nx*w,ms[1]-ny*w*.6+8]]));
    c.beam.setAttribute('opacity',(c.k*.95*(bd<520?1:0)).toFixed(2));
    c.line.setAttribute('x1',c.t[0]);c.line.setAttribute('y1',c.t[1]);c.line.setAttribute('x2',ms[0]);c.line.setAttribute('y2',ms[1]);c.line.setAttribute('opacity',(c.k*.7*(bd<520?1:0)).toFixed(2));
    c.dot.setAttribute('opacity',(.35+.65*c.k).toFixed(2))});
  // people
  const gather=ss(.3,.42,p)*(1-ss(.7,.8,p));
  people.forEach(q=>{let x,y;
    if(q.kind==='cross'){const u=((t*.05*q.sp+q.o)%1);x=lerp(q.x0,q.x1,u);y=q.y+Math.sin(t+q.ph)*4;
      const gap=ss(.21,.25,p)*(1-ss(.3,.34,p));if(Math.abs(y-210)<40&&Math.abs(x-20)<45)x+=gap*(x<20?-50:50)}
    else if(q.kind==='crowd'){x=q.x*(.4+.6*(1-gather))+Math.sin(t*.7+q.ph)*5;y=lerp(q.y+200,q.y,gather)+Math.cos(t*.6+q.ph)*4;
      if(gather<.05){x=q.x*1.6;y=q.y+Math.sin(t*.2+q.ph)*30}}
    else {x=q.x+Math.sin(t*.35*q.sp+q.ph)*14;y=q.y+Math.cos(t*.3*q.sp+q.ph)*18}
    const s=iso(x,y);q.g.setAttribute('transform',`translate(${s[0].toFixed(1)},${s[1].toFixed(1)})`)});
}
requestAnimationFrame(frame);
})();
