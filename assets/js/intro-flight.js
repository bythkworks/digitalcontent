/* ======================= INTRO 비행 전환 =======================
   첫 화면(오로라 배경·타이틀)에서 스크롤을 시작하면, 하늘에서 구름을 뚫고 오른쪽으로 선회하며
   축제 공간(입체로 세운 사진)으로 내려앉는다. 메인 스크립트가 매 프레임 window.__flight.render(p,time) 를 부른다. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const range=(p,a,b)=>clamp((p-a)/(b-a));
const sst=t=>t*t*(3-2*t);                       // smoothstep
const sst5=t=>t*t*t*(t*(t*6-15)+10);            // smootherstep (속도·가속도 모두 0에서 시작/종료)
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
let VW=innerWidth, VH=innerHeight;

const IMG_ASPECT=1400/876;

/* ======================= 조절값 ======================= */
const TUNE={turn:110,bank:10,fog:1,damp:.08};
const FLIGHT_END=.86;          // 스크롤 진행도 p 가 이 값일 때 카메라가 도착한다. 이후는 도착 카피 구간
const D0=420, DR=60;           // 출발 거리(m)와 거리 감쇠비
const EL0=26*Math.PI/180;      // 출발 고도각
const PITCH_SKY=.30;           // 출발 시 올려다보는 각 (rad)
const LAYERS=[300,150,100,68,42];   // 구름층 높이(m) — 셰이더와 동일
const DIR=-1;                  // 선회 방향: -1 = 화면이 오른쪽으로 넘어간다, 1 = 왼쪽(이전 버전)
const WASH=0, PATCH=0;                 // (이전 시안의 흰 장막·물결 효과는 쓰지 않는다)
const SW=4, SH=4, stir={px:new Uint8Array(SW*SH*4).fill(128),dirty:false};
/* 사진을 찍은 카메라(추정): 눈높이 1.45m, 지평선이 사진 높이의 64% 지점에 오도록 7.9° 올려다봄.
   사진의 각 픽셀을 이 카메라에서 깊이만큼 밀어내 3D 공간에 세운다 → 도착 지점에서는 원본 사진과 정확히 같은 화면이 된다. */
const TANP=.5, HC=1.45, PH=Math.atan((560-438)/438*TANP);
const O=[0,HC,0], F0=[0,Math.sin(PH),-Math.cos(PH)], R0=[1,0,0], U0=[0,Math.cos(PH),Math.sin(PH)];
const TGT=[O[0]+F0[0]*30,O[1]+F0[1]*30,O[2]+F0[2]*30];

const portal=$('#portal'),depthFx=$('#depthFx');
const planeWidth=780,planeHeight=488;
const plaza=$('#introPlazaLayer');
const plazaPlane={el:plaza,depth:36};
const scenePlanes=[
  {el:$('#introMidLayer'),depth:12,foot:444},
  {el:$('#introGateLayer'),depth:9,foot:397},
  {el:$('#introTreeLayer'),depth:6.3,foot:403,anchorX:51,reveal:[.65,.80]},
  {el:$('#introRightBedLayer'),depth:4.9,foot:468,anchorX:749,reveal:[.68,.84]},
  {el:$('#introLeftBedLayer'),depth:3.8,foot:477,anchorX:61,reveal:[.69,.85]}
];
/* ======================= 카메라 경로 ======================= */
let tanV=.5, tanH=.5, tanVf=.5, widen=1.12, VA=1;
function fitCam(){
  VA=VW/VH;
  tanVf=TANP*Math.min(1,IMG_ASPECT/VA);          // 도착 시 사진이 화면에 정확히 cover 로 맞는 시야
  widen=VA<1?1.5:1.12;                           // 비행 중에는 조금 넓게 보고, 다가가며 좁힌다
}
// 위치만 (링·입자 배치에도 사용). 도착점 O 를 중심으로 한 구면 좌표: 거리·방위·고도가 함께 줄어든다.
function pathPos(u,out){
  const s=sst5(range(u,.08,1));
  const d=D0*(Math.pow(DR,1-s)-1)/(DR-1);                       // 로그형 감쇠 → 끌려가듯 가속, 끝에서 감속
  const th=DIR*TUNE.turn*.36*Math.PI/180*(1-sst(range(u,0,.7)));
  const el=EL0*(1-sst(range(u,0,.8)));
  const ce=Math.cos(el);
  out[0]=O[0]+d*ce*Math.sin(th); out[1]=O[1]+d*Math.sin(el); out[2]=O[2]+d*ce*Math.cos(th);
  return d;
}
const cam={ro:[0,0,1],f:[0,0,-1],r:[1,0,0],up:[0,1,0],d:1,yawOff:0,roll:0};
function camAt(u,time){
  const d=pathPos(u,cam.ro); cam.d=d;
  tanV=tanVf*lerp(widen,1,sst5(range(u,.45,.92))); tanH=tanV*VA;
  let x=TGT[0]-cam.ro[0],y=TGT[1]-cam.ro[1],z=TGT[2]-cam.ro[2];const L=Math.hypot(x,y,z)||1;x/=L;y/=L;z/=L;
  const yawL=Math.atan2(x,-z), pitchL=Math.asin(y);              // 축제 공간을 바라보는 각 (도착 시 사진 카메라와 일치)
  const tw=range(u,.12,.66), w=sst5(tw);
  const settle=1-sst5(range(u,.7,1));
  const yawOff=DIR*TUNE.turn*Math.PI/180*(1-w);
  const yaw=yawL+yawOff+(reduce?0:.012*Math.sin(time*.23)*settle);
  const pitch=lerp(PITCH_SKY,pitchL,sst5(range(u,.05,.56)))+(reduce?0:.008*Math.sin(time*.31+1)*settle);
  const roll=DIR*TUNE.bank*Math.PI/180*16*tw*tw*(1-tw)*(1-tw)+(reduce?0:.006*Math.sin(time*.19+2)*settle);   // 선회 속도에 비례하는 뱅킹
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  const f=[sy*cp,sp,-cy*cp], r0=[cy,0,sy];
  const u0=[r0[1]*f[2]-r0[2]*f[1], r0[2]*f[0]-r0[0]*f[2], r0[0]*f[1]-r0[1]*f[0]];
  const cr=Math.cos(roll),sr=Math.sin(roll);
  cam.f=f;
  cam.r=[r0[0]*cr+u0[0]*sr,r0[1]*cr+u0[1]*sr,r0[2]*cr+u0[2]*sr];
  cam.up=[-r0[0]*sr+u0[0]*cr,-r0[1]*sr+u0[1]*cr,-r0[2]*sr+u0[2]*cr];
  cam.yawOff=yawOff; cam.roll=roll;
}
// 월드 → 화면(px). 반환 [x,y,깊이]
function proj(px,py,pz,o){
  const x=px-cam.ro[0],y=py-cam.ro[1],z=pz-cam.ro[2];
  const zc=x*cam.f[0]+y*cam.f[1]+z*cam.f[2];
  const xc=x*cam.r[0]+y*cam.r[1]+z*cam.r[2], yc=x*cam.up[0]+y*cam.up[1]+z*cam.up[2];
  o[2]=zc; const k=zc>1e-4?1/zc:1e4;
  o[0]=(xc*k/tanH*.5+.5)*VW; o[1]=(.5-yc*k/tanV*.5)*VH; return o;
}

/* ======================= WebGL 씬 (#heroBg) =======================
   ① 하늘 + 지면  ② 구름층 */
const heroBg=$('#flightBg');
let GL=null;
(function initGL(){
  if(reduce||!heroBg)return;
  const g=heroBg.getContext('webgl',{antialias:false,alpha:false,depth:true,preserveDrawingBuffer:false,powerPreference:'high-performance'});
  if(!g)return;
  const HEAD=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;uniform float uTime;
uniform vec3 uRo,uF,uR,uU;uniform vec2 uTan;
uniform sampler2D uDisp;uniform float uHov;
const vec3 HAZE=vec3(.89,.80,.86);
const vec3 GLOWD=vec3(0.,.08,-.997);
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1.,0.)),u.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<3;i++){v+=a*n(p);p=m*p;a*=.5;}return v/.875;}
vec3 ray(){vec2 ndc=gl_FragCoord.xy/uRes*2.-1.;return normalize(uF+ndc.x*uTan.x*uR+ndc.y*uTan.y*uU);}
// 색이 놓인 수면의 흔들림 (세로 높이 2 기준): 늘 잔잔하게 일렁이는 너울 + 포인터가 일으킨 물결·밀림. 128/255 가 0 이다
vec2 stirD(){
 if(uHov<.003)return vec2(0.);
 vec2 p=(gl_FragCoord.xy/uRes*2.-1.)*vec2(uRes.x/uRes.y,1.);float t=uTime;
 vec2 sw=vec2(sin(p.y*1.7+t*.21)+.45*sin(p.y*3.1-t*.16+p.x*1.2),
              cos(p.x*1.5+t*.18)+.45*cos(p.x*2.8+t*.24+p.y*1.1));
 return (sw*.02+(texture2D(uDisp,gl_FragCoord.xy/uRes).rg-128./255.)*2.*.55)*uHov;
}
`;
  const VS_FULL=`attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}`;
  const FS_BG=HEAD+`
uniform float uAur,uGK,uGA,uAT;
vec3 skyc(float e){
 vec3 c=mix(HAZE,vec3(.915,.81,.84),smoothstep(0.,.17,e));
 c=mix(c,vec3(.93,.855,.895),smoothstep(.17,.29,e));
 c=mix(c,vec3(.89,.835,.88),smoothstep(.29,.39,e));
 c=mix(c,vec3(.886,.857,.951),smoothstep(.39,.47,e));
 c=mix(c,vec3(.874,.868,.976),smoothstep(.47,.56,e));
 return mix(c,vec3(.80,.85,.975),smoothstep(.56,1.,e));
}
void main(){
 vec3 rd=ray();vec3 col;
 float g=max(dot(rd,normalize(GLOWD)),0.);
 if(rd.y<-1e-4){
  float t=-uRo.y/rd.y;vec2 p=uRo.xz+t*rd.xz;
  vec3 gc=mix(vec3(.775,.725,.80),vec3(.67,.63,.735),smoothstep(.40,.64,fbm(p*.45+3.1))*exp(-t*.025));
  vec2 gq=abs(fract(p/vec2(1.2,.6))-.5);
  gc*=1.-.07*smoothstep(.46,.5,max(gq.x,gq.y))*exp(-t*.07);
  float f=1.-exp(-t*uGK);
  col=mix(gc,HAZE,f*mix(.9,1.,smoothstep(120.,400.,t)));
  vec2 sp=p-vec2(0.,-25.);
  col+=vec3(.10,.05,.02)*exp(-dot(sp,sp)/7000.)*f;
 }else{
  col=skyc(rd.y);
  if(uAur>.01){
   vec2 sp=rd.xz/(abs(rd.y)+.55)*1.15-stirD()*vec2(.9,-.9);float t=uAT;
   vec2 q=vec2(fbm(sp+vec2(0.,t)),fbm(sp+vec2(5.2,1.3)-t));
   float f=fbm(sp*1.2+2.4*q);
   vec3 au=mix(vec3(.612,.784,.886),vec3(.722,.714,.898),smoothstep(.25,.65,f));
   au=mix(au,vec3(.910,.690,.867),smoothstep(.40,.80,q.x)*.9);
   au=mix(au,vec3(.973,.792,.655),smoothstep(.55,.90,q.y)*.75);
   col=mix(col,mix(au,vec3(1.),mix(.64,.36,uHov)),uAur*smoothstep(-.02,.3,rd.y));
  }
 }
 col+=vec3(1.,.80,.62)*pow(g,8.)*.14+vec3(.95,.72,.86)*pow(g,2.5)*.06;
 gl_FragColor=vec4(col,1.);
}`;
  const FS_CL=HEAD+`
uniform float uOver,uMist,uArrive,uClear,uWash,uReveal;uniform vec2 uPc;
void layer(float hh,float sc,float cov,vec3 rd,inout vec4 front){
 float dy=hh-uRo.y;float tc=dy/rd.y;
 if(tc<=0.||tc>4000.)return;
 vec2 xz=uRo.xz+tc*rd.xz;
 float f=fbm(xz*sc+vec2(hh*.37,hh*.13)+uTime*vec2(.014,.006));
 float a=smoothstep(cov,cov+.17,f);
 a*=exp(-tc*(.0008+sc*.012));
 a*=smoothstep(0.,1.,abs(dy)/(.07*hh+2.));
 a*=smoothstep(0.,.07,abs(rd.y))*.88;
 if(a<.004)return;
 vec3 c=mix(vec3(.80,.775,.93),vec3(1.,.985,.99),smoothstep(cov+.02,cov+.36,f));
 c+=vec3(.07,.02,.0)*pow(max(dot(rd,normalize(GLOWD)),0.),3.);
 c=mix(c,HAZE+.06,1.-exp(-tc*.0012));
 front=front*(1.-a)+vec4(c*a,a);
}
void main(){
 vec3 rd=ray();vec4 front=vec4(0.);
 if(rd.y>0.){
  if(uOver>.004){
   layer(300.,.004,.52,rd,front);layer(150.,.008,.47,rd,front);layer(100.,.012,.47,rd,front);layer(68.,.018,.48,rd,front);layer(42.,.028,.47,rd,front);
   front*=uOver;
  }
 }else{
  layer(42.,.028,.47,rd,front);layer(68.,.018,.48,rd,front);layer(100.,.012,.47,rd,front);layer(150.,.008,.47,rd,front);layer(300.,.004,.52,rd,front);
  vec2 ndc=gl_FragCoord.xy/uRes*2.-1.;
  float r=length((ndc-uPc)*vec2(uRes.x/uRes.y,1.));
  front*=mix(1.,mix(.12,1.,smoothstep(.1,.75,r)),uClear);
 }
 vec4 m=vec4(vec3(.985,.972,.988),1.)*uMist*(.72+.28*n(gl_FragCoord.xy/uRes*4.6+uTime*.3));
 front=front*(1.-m.a)+m;
 if(uWash>.003){   // 첫 화면의 흰 장막. 군데군데 얼룩처럼 걷혀 색이 비치고, 포인터가 휘저으면 그 얼룩이 끌려가며 섞인다
  vec2 sd=stirD();float sm=length(sd)/.55;
  vec2 pp=(gl_FragCoord.xy/uRes*2.-1.)*vec2(uRes.x/uRes.y,1.)-sd;
  float pf=fbm(pp*.85+vec2(3.7,1.9)+uTime*.011)+.18*(fbm(pp*2.3-vec2(1.3,6.1)-uTime*.017)-.5);
  float pt=smoothstep(.47-.07*sm,.74+.05*sm,pf);
  float hw=(texture2D(uDisp,gl_FragCoord.xy/uRes).b-128./255.)*2.;      // 물결의 높이: 마루에서는 색이 조금 더 비치고 골에서는 옅어진다
  float w=uWash*(1.-uReveal*clamp(pt+hw*.3*(.2+pt),0.,1.));front=front*(1.-w)+vec4(w);}
 front.rgb+=(h(gl_FragCoord.xy+fract(uTime*7.))-.5)*.02*(1.-uArrive)*front.a;
 gl_FragColor=front;
}`;
  const sh=(type,src)=>{const s=g.createShader(type);g.shaderSource(s,src);g.compileShader(s);if(!g.getShaderParameter(s,g.COMPILE_STATUS)){console.warn(g.getShaderInfoLog(s));return null}return s};
  const mk=(vs,fs,attrs,unis)=>{const v=sh(g.VERTEX_SHADER,vs),f=sh(g.FRAGMENT_SHADER,fs);if(!v||!f)return null;
    const pr=g.createProgram();g.attachShader(pr,v);g.attachShader(pr,f);attrs.forEach((a,i)=>g.bindAttribLocation(pr,i,a));g.linkProgram(pr);
    if(!g.getProgramParameter(pr,g.LINK_STATUS)){console.warn(g.getProgramInfoLog(pr));return null}
    const U={};unis.forEach(k=>U[k]=g.getUniformLocation(pr,k));return {pr,U}};
  const CAMU=['uRes','uTime','uRo','uF','uR','uU','uTan','uDisp','uHov'];
  const A=mk(VS_FULL,FS_BG,['a'],[...CAMU,'uAur','uGK','uGA','uAT']);
  const C=mk(VS_FULL,FS_CL,['a'],[...CAMU,'uOver','uMist','uArrive','uClear','uPc','uWash','uReveal']);
  if(!A||!C)return;
  const quad=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,quad);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);
  GL={g,A,C,quad};
  // 휘젓기 격자 → 텍스처 유닛 1 (사진은 유닛 0)
  g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,g.createTexture());
  g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);
  g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);
  g.texImage2D(g.TEXTURE_2D,0,g.RGBA,SW,SH,0,g.RGBA,g.UNSIGNED_BYTE,stir.px);
  g.activeTexture(g.TEXTURE0);
  heroBg.addEventListener('webglcontextlost',e=>{e.preventDefault();GL=null;heroBg.style.opacity='0'});
})();
function sizeGL(){
  if(!GL)return;
  const d=Math.min(devicePixelRatio||1,2);
  let s=d; const px=VW*VH*s*s, cap=2.2e6; if(px>cap)s*=Math.sqrt(cap/px);
  heroBg.width=Math.max(2,Math.round(VW*s));heroBg.height=Math.max(2,Math.round(VH*s));
  GL.g.viewport(0,0,heroBg.width,heroBg.height);
}
const pv=[0,0,0];
let mist=0, openK=1, auT=0, auLast=-1;
function camU(g,U,time){
  g.uniform2f(U.uRes,heroBg.width,heroBg.height); g.uniform1f(U.uTime,time%3600);
  g.uniform3fv(U.uRo,cam.ro);g.uniform3fv(U.uF,cam.f);g.uniform3fv(U.uR,cam.r);g.uniform3fv(U.uU,cam.up);
  g.uniform2f(U.uTan,tanH,tanV);
  g.uniform1i(U.uDisp,1);g.uniform1f(U.uHov,0);
}
function drawGL(u,time){
  if(!GL)return;
  const g=GL.g, clear=sst(range(u,.66,.93)), arrive=sst5(range(u,.66,.96)), fogT=Math.max(TUNE.fog,.05);
  if(stir.dirty){stir.dirty=false;g.activeTexture(g.TEXTURE1);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,false);
    g.texSubImage2D(g.TEXTURE_2D,0,0,0,SW,SH,g.RGBA,g.UNSIGNED_BYTE,stir.px);g.activeTexture(g.TEXTURE0)}
  openK=1-sst(range(u,.015,.3));
  auT+=(auLast<0?0:Math.min(.1,Math.max(0,time-auLast)))*lerp(.045,.022,openK); auLast=time;   // 첫 화면에서는 색이 더 느리게 흐른다          // 첫 화면 연출(흰 장막·번짐)은 비행이 시작되면 걷힌다
  let m=0; for(const hh of LAYERS){const nf=.07*hh+2;m=Math.max(m,1-sst(clamp(Math.abs(hh-cam.ro[1])/nf)))}
  mist=lerp(mist,m*.34,.2);
  // ① 하늘 + 지면
  g.disable(g.DEPTH_TEST);g.disable(g.BLEND);
  g.bindBuffer(g.ARRAY_BUFFER,GL.quad);g.enableVertexAttribArray(0);g.vertexAttribPointer(0,2,g.FLOAT,false,0,0);
  g.useProgram(GL.A.pr);camU(g,GL.A.U,time);
  g.uniform1f(GL.A.U.uAT,auT);
  g.uniform1f(GL.A.U.uAur,lerp(1,0,sst(range(u,.08,.4))));
  g.uniform1f(GL.A.U.uGK,((.02*(1-clear)+.0012)*(1-arrive)+.0015)*fogT);
  g.drawArrays(g.TRIANGLES,0,3);
  g.enable(g.BLEND);g.blendFunc(g.ONE,g.ONE_MINUS_SRC_ALPHA);
  // ② 구름
  proj(TGT[0],0,TGT[2],pv);
  g.bindBuffer(g.ARRAY_BUFFER,GL.quad);g.vertexAttribPointer(0,2,g.FLOAT,false,0,0);
  g.useProgram(GL.C.pr);camU(g,GL.C.U,time);
  g.uniform1f(GL.C.U.uOver,1-sst(range(u,.5,.78)));
  g.uniform1f(GL.C.U.uMist,mist*(1-range(u,.7,.9)));
  g.uniform1f(GL.C.U.uArrive,arrive);
  g.uniform1f(GL.C.U.uWash,WASH*openK);g.uniform1f(GL.C.U.uReveal,PATCH);
  g.uniform1f(GL.C.U.uClear,pv[2]>1?range(u,.22,.36):0);
  g.uniform2f(GL.C.U.uPc,pv[0]/VW*2-1,1-pv[1]/VH*2);
  g.drawArrays(g.TRIANGLES,0,3);
}

/* ======================= 깊이 레이어: 링 · 빛 입자 (#particles) ======================= */
const cvs=$('#depthFx'), ctx=cvs.getContext('2d');
const PCOL=['156,200,226','184,182,229','232,176,221','248,202,167','255,255,255'];
const RCOL=['184,182,229','156,200,226','232,176,221'];
function sizeCanvas(){const d=Math.min(devicePixelRatio||1,2);cvs.width=VW*d;cvs.height=VH*d;ctx.setTransform(d,0,0,d,0,0)}
let rings=[], dust=[];
function buildDepth(){
  // 링: 하늘 구간의 비행 경로 위에 놓인 게이트. 카메라가 그 한가운데를 통과한다.
  rings=[];const a=[0,0,0],b=[0,0,0];
  for(let k=0;k<7;k++){
    const u=.2+k*.05, d=pathPos(u,a); pathPos(u+.004,b);
    let n=[b[0]-a[0],b[1]-a[1],b[2]-a[2]];const nl=Math.hypot(...n)||1;n=n.map(v=>v/nl);
    let e1=[n[2],0,-n[0]];const l1=Math.hypot(...e1)||1;e1=e1.map(v=>v/l1);
    const e2=[n[1]*e1[2]-n[2]*e1[1],n[2]*e1[0]-n[0]*e1[2],n[0]*e1[1]-n[1]*e1[0]];
    rings.push({c:[...a],e1,e2,R:d*.26,col:RCOL[k%3],dash:[[3,9],[2,12],[1,14]][k%3],spin:(k%2?1:-1)*(.05+.02*k)});
  }
  // 빛 입자: 경로 주변의 공간에 흩어져 있고, 카메라가 지나가며 스쳐 간다.
  dust=[];const N=VW<700?130:240;
  let s=7; const rnd=()=>(s=(s*1664525+1013904223)>>>0)/4294967296;
  for(let i=0;i<N;i++){
    const u=.06+.86*rnd(), d=Math.max(pathPos(u,a),3);
    const th=rnd()*6.283, ph=Math.acos(2*rnd()-1), rho=d*(.05+.36*rnd());
    dust.push({x:a[0]+rho*Math.sin(ph)*Math.cos(th),y:Math.max(.5,a[1]+rho*Math.sin(ph)*Math.sin(th)),z:a[2]+rho*Math.cos(ph),sz:d*(.004+.007*rnd()),d,
      c:PCOL[(rnd()*5)|0],ph:rnd()*6.28,px:0,py:0,ok:false});
  }
}
const q0=[0,0,0],q1=[0,0,0];
function drawDepth(u,time,jump){
  ctx.clearRect(0,0,VW,VH);
  const fade=1-range(u,.74,.9);
  if(fade<=0)return;
  ctx.lineCap='round';
  const nz=Math.max(.3,cam.d*.01);
  const SEG=72;
  for(const rg of rings){
    proj(rg.c[0],rg.c[1],rg.c[2],q0);
    const zc=q0[2]; if(zc<-rg.R||zc>rg.R*26)continue;
    const al=(1-range(zc,rg.R*12,rg.R*26))*range(zc,-rg.R*.2,rg.R*.5)*fade*.85;
    if(al<.01)continue;
    const pxr=rg.R/(Math.max(zc,rg.R*.3)*tanV)*VH*.5;
    ctx.strokeStyle=`rgba(${rg.col},${al})`;ctx.lineWidth=clamp(pxr*.006,.9,2.6);
    const ds=clamp(pxr/250,.5,3);ctx.setLineDash(rg.dash.map(v=>v*ds));
    ctx.beginPath();let pen=false;
    for(let i=0;i<=SEG;i++){
      const a=i/SEG*6.2832+time*rg.spin, c=Math.cos(a)*rg.R, s=Math.sin(a)*rg.R;
      proj(rg.c[0]+rg.e1[0]*c+rg.e2[0]*s,rg.c[1]+rg.e1[1]*c+rg.e2[1]*s,rg.c[2]+rg.e1[2]*c+rg.e2[2]*s,q1);
      if(q1[2]<nz){pen=false;continue}
      if(pen)ctx.lineTo(q1[0],q1[1]);else{ctx.moveTo(q1[0],q1[1]);pen=true}
    }
    ctx.stroke();
  }
  ctx.setLineDash([]);
  for(const p of dust){
    proj(p.x,p.y,p.z,q0);const zc=q0[2];
    if(zc<p.d*.012||q0[0]<-60||q0[0]>VW+60||q0[1]<-60||q0[1]>VH+60){p.ok=false;continue}
    const sz=clamp(p.sz/(zc*tanV)*VH*.5,.5,6);
    const al=clamp(sz/1.1)*range(zc,p.d*.012,p.d*.07)*(1-range(zc,p.d*1.4,p.d*2.6))*(.62+.38*Math.sin(time*1.7+p.ph))*fade*.9;
    if(al>.01){
      const dx=q0[0]-p.px,dy=q0[1]-p.py,dl=Math.hypot(dx,dy);
      if(p.ok&&!jump&&dl>1.5){const k=Math.min(1,110/dl);
        ctx.strokeStyle=`rgba(${p.c},${al*.8})`;ctx.lineWidth=sz*1.3;ctx.beginPath();ctx.moveTo(q0[0]-dx*k,q0[1]-dy*k);ctx.lineTo(q0[0],q0[1]);ctx.stroke();
      }else{ctx.fillStyle=`rgba(${p.c},${al})`;ctx.beginPath();ctx.arc(q0[0],q0[1],sz,0,6.2832);ctx.fill()}
    }
    p.px=q0[0];p.py=q0[1];p.ok=true;
  }
}

/* ======================= 축제 레이어 투영 ======================= */
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function placePlane({el,depth,foot,anchorX=planeWidth/2},plazaMatrix){
  const halfW=TANP*IMG_ASPECT*depth,halfH=TANP*depth;
  const center=O.map((o,i)=>o+F0[i]*depth-cam.ro[i]);
  const right=R0.map(v=>v*2*halfW/planeWidth);
  const down=U0.map(v=>-v*2*halfH/planeHeight);
  const corner=center.map((v,i)=>v-right[i]*planeWidth/2-down[i]*planeHeight/2);

  // 각 레이어 전체에 원근 투영을 적용해서 실루엣 내부가 갈라지지 않도록 한다.
  const z=dot(center,cam.f);
  if(z<=1 || dot(corner,cam.f)<=1 ||
      z-Math.abs(dot(right,cam.f))*planeWidth/2-Math.abs(dot(down,cam.f))*planeHeight/2<=1){
    el.style.visibility='hidden';
    return;
  }
  el.style.visibility='visible';
  const scaleX=VW/(2*tanH),scaleY=VH/(2*tanV);
  function column(v){
    const w=dot(v,cam.f);
    return [(VW*w/2+scaleX*dot(v,cam.r))/z,(VH*w/2-scaleY*dot(v,cam.up))/z,0,w/z];
  }
  const m=[...column(right),...column(down),0,0,1,0,...column(corner)];
  if(foot&&plazaMatrix){
    // 바닥은 배경 이미지에 있다. 실루엣의 발밑을 그 원근에 정렬한다.
    const own=planePoint(m,anchorX,foot);
    const ground=planePoint(plazaMatrix,anchorX,foot);
    const dx=(ground[0]-own[0])*.65,dy=ground[1]-own[1];
    for(const i of [0,4,12]){
      m[i]+=dx*m[i+3];
      m[i+1]+=dy*m[i+3];
    }
  }
  el.style.transform=`matrix3d(${m.map(x=>x.toFixed(9)).join(',')})`;
  return m;
}
function planePoint(m,x,y){
  const w=m[3]*x+m[7]*y+m[15];
  return [(m[0]*x+m[4]*y+m[12])/w,(m[1]*x+m[5]*y+m[13])/w];
}

let lastU=0;
function render(p,time){
  const u=clamp(p/FLIGHT_END);
  const entry=sst(range(u,.33,.60));
  const arrive=reduce?1:sst(range(u,.50,.955));
  portal.style.opacity=entry.toFixed(3);
  plaza.style.setProperty('--plaza-core',`${lerp(36,155,arrive)}%`);
  plaza.style.setProperty('--plaza-edge',`${lerp(77,170,arrive)}%`);

  const flightOpacity=sst(range(p,.004,.09));
  heroBg.style.opacity=flightOpacity.toFixed(3);
  depthFx.style.opacity=reduce?'0':flightOpacity.toFixed(3);

  camAt(reduce?1:u,time);
  if(entry>0){
    const plazaMatrix=placePlane(plazaPlane);
    scenePlanes.forEach(plane=>{
      if(plane.reveal)plane.el.style.opacity=(reduce?1:sst(range(u,...plane.reveal))).toFixed(3);
      placePlane(plane,plazaMatrix);
    });
  }
  if(!reduce&&flightOpacity>0&&u<.98){
    if(GL)drawGL(u,time);
    drawDepth(u,time,Math.abs(u-lastU)>.05);
  }else{
    ctx.clearRect(0,0,VW,VH);
  }
  lastU=u;
}
function resize(){VW=innerWidth;VH=innerHeight;fitCam();sizeGL();sizeCanvas();buildDepth()}
addEventListener('resize',resize);
resize();
window.__flight={render,FLIGHT_END,get gl(){return !!GL}};
})();
