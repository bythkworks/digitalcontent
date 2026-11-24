/* AI 대화 에필로그(#world-c) — 보존용 스크립트
 * 원본: v5_src.html 메인 스크립트 (커밋 f58852d, 2026-11-24)
 * 사이트 공용 함수 $, $$, range, eOut, eIO, clamp, holdY, scrollToY, VH 를 사용하므로
 * 단독 실행용이 아니라 메인 스크립트의 같은 자리에 다시 끼워 넣는 용도입니다. README.md 참고.
 */

/* ---- (1) 배경 그라데이션 + 장면 이미지 — 원래 위치: 인트로 타이틀 생성 직후 ---- */
$('#wcScene').innerHTML=WORLD_ART[5];
// epilogue backdrop: continues from WORLD CH.04 → evening festival → the place the person picks
const EC_BG=[ // [base, blob1, blob2, blob3] — start → evening → the picked place (쉼터 · 무대 · 푸드 트럭)
  ['#C9C3F2','#A9C9F0','#E9B8E0','#D9D4FF'],['#9C8FDB','#7E8BE0','#E59AC8','#F6BFA6'],
  ['#BFD9E6','#A6DCCB','#C9C2FA','#EFE0FF'],['#8A78D8','#6F7FE6','#E688C7','#B8A0F5'],['#E9C2D6','#F5BE9E','#EC9FC4','#C8B6F4']];
$('#ecBg').innerHTML=EC_BG.map(c=>`<div class="eb" style="--bg:${c[0]};--c1:${c[1]};--c2:${c[2]};--c3:${c[3]}"><i></i><i></i><i></i></div>`).join('');

/* ---- (2) 대화 본체 — 원래 위치: WORLD A 스크립트 다음, SYSTEM 스크립트 앞 ---- */
/* ======================= WORLD C ======================= */
/* ======================= WORLD EPILOGUE · 대화 ======================= */
// [초안] 표시된 줄은 팀 문구로 바꿔 주세요. 나머지는 기존 에필로그 문구입니다.
const EC_CHOICES=['조용한 쉼터','공연 무대 앞','푸드 트럭 거리'];                     // [초안]
const EC_ROLES=[
  {k:'개인',t:'자신의 경험을 이어가고',ic:'<svg width="22" height="22" viewBox="0 0 26 26" fill="none" stroke="#8E8AD8" stroke-width="1.8"><circle cx="13" cy="9" r="4"/><path d="M5 22c1.2-4.2 4.2-6 8-6s6.8 1.8 8 6" stroke-linecap="round"/></svg>'},
  {k:'공간',t:'변화에 반응하며',ic:'<svg width="22" height="22" viewBox="0 0 26 26" fill="none" stroke="#7FAFD0" stroke-width="1.8"><path d="M4 21V11l9-6 9 6v10" stroke-linejoin="round"/><path d="M10 21v-6h6v6"/></svg>'},
  {k:'운영자',t:'더 넓은 상황을 살필 수 있습니다',ic:'<svg width="22" height="22" viewBox="0 0 26 26" fill="none" stroke="#D08FC6" stroke-width="1.8"><circle cx="13" cy="13" r="8"/><circle cx="13" cy="13" r="3"/><path d="M13 2v4M13 20v4M2 13h4M20 13h4" stroke-linecap="round"/></svg>'}];
const josa=w=>{const c=w.charCodeAt(w.length-1)-0xAC00;return c>=0&&c%28&&c%28!==8?'으로':'로'};
const EC_MSG=[ // at: scroll progress where the message lands
  {at:.06,who:'ai',html:'오후 7시예요. 지금 축제 공간이 가장 붐비고 있어요.'},                 // [초안]
  {at:.15,who:'ai',kind:'choice',html:'지금 상황에 맞는 곳을 골라 봤어요.'},                    // [초안]
  {at:.31,who:'me',reply:true},                                                                 // [초안] "○○(으)로 갈게요."
  {at:.40,who:'me',html:'그런데 AI가 다 정해 주는 건가요?'},                                     // [초안]
  {at:.50,who:'ai',kind:'big',html:'AI는 모든 것을<br>대신 결정하지 않습니다.'},
  {at:.60,who:'ai',kind:'lead',html:'사람과 공간의 상황을 이해하고, 더 나은 선택을 돕습니다.'},
  {at:.70,who:'ai',kind:'roles'}];
const EC_PICK=.26, EC_TYPE=.045;
const worldC={el:$('#world-c'),p:0,t:0};
const ecList=$('#ecList'), ecState=$('#ecState'), ecLabel=$('#ecLabel'), ecPhone=$('#ecPhone'), wcScene=$('#wcScene'), wcbar=$('#wcbar'), wcNext=$('#wc6');
const EC={pick:-1,user:-1,n:-1,typing:false};
ecList.innerHTML=EC_MSG.map((m,i)=>{
  let body=m.html||'';
  if(m.kind==='choice')body+=`<div class="ec-opts">${EC_CHOICES.map((c,k)=>`<button type="button" data-k="${k}"><span>${c}</span><i aria-hidden="true"></i></button>`).join('')}</div>`;
  if(m.kind==='roles')body=`<div class="ec-roles">${EC_ROLES.map(r=>`<div><span class="ec-ic">${r.ic}</span><b>${r.k}</b><span>${r.t}</span></div>`).join('')}</div>`;
  if(m.reply)body='<span class="ec-reply"></span>';
  return `<div class="ec-m ${m.who}${m.kind?' '+m.kind:''}" data-i="${i}">${m.who==='ai'?'<i class="ec-av" aria-hidden="true"></i>':''}<div class="ec-b">${body}</div></div>`}).join('')+
  '<div class="ec-m ai typing" id="ecTyping"><i class="ec-av" aria-hidden="true"></i><div class="ec-b"><i></i><i></i><i></i></div></div>';
const ecMs=$$('.ec-m[data-i]',ecList), ecTyping=$('#ecTyping'), ecOpts=$$('.ec-opts button',ecList), ecReply=$('.ec-reply',ecList);
ecOpts.forEach(b=>b.addEventListener('click',()=>{EC.user=+b.dataset.k;ecSetPick(EC.user);
  const target=EC_MSG[2].at+.01; if(worldC.p<target)scrollToY(holdY('world-c',2))}));
function ecSetPick(k){if(k===EC.pick)return;EC.pick=k;ecOpts.forEach((b,i)=>b.classList.toggle('on',i===k));
  if(k>=0){const c=EC_CHOICES[k];ecReply.textContent=`${c}${josa(c)} 갈게요.`}}
function renderWorldC(p){
  const n=EC_MSG.filter(m=>p>=m.at).length;
  if(n!==EC.n){ecMs.forEach((m,i)=>m.classList.toggle('on',i<n));EC.n=n}
  const nx=EC_MSG[n], typing=!!nx&&nx.who==='ai'&&p>=nx.at-EC_TYPE;
  ecTyping.classList.toggle('on',typing); ecState.textContent=typing?'입력 중…':n?'방금 전':'대기 중';
  // the person picks (their own tap wins; otherwise the middle option is chosen by scroll)
  ecSetPick(p>=EC_PICK?(EC.user>=0?EC.user:1):(EC.user>=0?EC.user:-1));
  {const sp=n===5&&!typing, w=$('#ecWave'); if(sp&&!w.classList.contains('on')){const b=$('.ec-m.big .ec-b'),st=w.getBoundingClientRect();if(b){const r=b.getBoundingClientRect();w.style.setProperty('--wx',(r.left+r.width/2-st.left).toFixed(0)+'px');w.style.setProperty('--wy',(r.top+r.height/2-st.top).toFixed(0)+'px')}}
   w.classList.toggle('on',sp)}
  ecPhone.classList.toggle('spot',n===5&&!typing);
  {const pk=EC.pick, L=pk>=0&&p>=EC_PICK-.02?2+pk:n>=1||p>=.03?1:0; if(L!==EC.bgL){EC.bgL=L;$$('#ecBg .eb').forEach((e,i)=>e.classList.toggle('on',i===L))}
   worldC.bgOut=1-range(p,.9,.99)}
  ecPhone.classList.toggle('done',p>=EC_MSG[6].at+.04);
  const ent=eOut(range(p,0,.06)); ecPhone.style.opacity=ent.toFixed(3); ecPhone.style.transform=`translateY(${(40*(1-ent)).toFixed(1)}px)`;
  ecLabel.style.opacity=ent.toFixed(3);
  const nxt=eOut(range(p,.8,.88)); wcNext.style.opacity=nxt.toFixed(3); wcNext.style.transform=`translateY(${(16*(1-nxt)).toFixed(1)}px)`;
  wcbar.style.width=(range(p,.84,.98)*100).toFixed(2)+'%';
  
}
const ecBgEl=$('#ecBg'), ecWaveEl=$('#ecWave');
function tickWorldC(){ // gradient eases in from white while the section scrolls up, so there is no hard edge with WORLD
  const r=worldC.el.getBoundingClientRect(); if(r.top>VH||r.bottom<0)return;
  const inn=eIO(clamp(1-r.top/VH)); const o=(inn*(worldC.bgOut??1)).toFixed(3);
  if(o!==worldC.bgO){worldC.bgO=o;ecBgEl.style.opacity=o;const fh=(Math.sqrt(1-clamp(1-r.top/VH))*90).toFixed(1);ecBgEl.style.webkitMaskImage=ecBgEl.style.maskImage=+fh>.1?`linear-gradient(180deg,transparent 0,#000 ${fh}vh)`:'none'}}
