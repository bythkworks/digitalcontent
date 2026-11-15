/* ======================= INTRO 비행 전환 =======================
   첫 화면(오로라 배경·타이틀)에서 스크롤을 시작하면, 하늘에서 구름을 뚫고 오른쪽으로 선회하며
   축제 공간(입체로 세운 사진)으로 내려앉는다. 메인 스크립트가 매 프레임 window.__flight.render(p,time,dt) 를 부른다. */
(()=>{
'use strict';
const $=s=>document.querySelector(s);
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const range=(p,a,b)=>clamp((p-a)/(b-a));
const eOut=t=>1-Math.pow(1-t,3), eIn=t=>t*t*t, eIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
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
const DEPTH_SRC="data:image/png;base64,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";   // 원본 사진에서 만든 깊이맵(R)과 흰 테두리 마스크(G), 320×200
const ZMIN=Math.log(3.2), ZMAX=Math.log(1000);

const stage=$('#intro .stage'),portal=$('#portal'),pScene=$('#portalScene'),pLabel=$('#portalLabel'),depthFx=$('#depthFx');
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
   ① 하늘 + 지면(사진의 하늘색·보도블록색에 맞춤)  ② 깊이를 가진 사진 공간  ③ 구름층 */
const heroBg=$('#flightBg');
let GL=null, glScale=1;
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
  const VS_MESH=`
attribute vec2 aUV;attribute vec4 aZM;attribute float aFD;uniform float uFarPass;
uniform vec3 uRo,uF,uR,uU,uO,uF0,uR0,uU0;uniform vec2 uTan,uTanP;
varying vec2 vUV;varying float vM,vDist,vD;
void main(){
 vec2 q=aUV*2.-1.;vD=uFarPass>.5?aFD:aZM.z;
 vec3 w=uO+(uF0+q.x*uTanP.x*uR0+q.y*uTanP.y*uU0)*mix(aZM.x,aZM.w,uFarPass);
 vec3 rel=w-uRo;float zc=dot(rel,uF);
 vUV=aUV;vM=aZM.y;vDist=length(rel);
 gl_Position=vec4(dot(rel,uR)/uTan.x,dot(rel,uU)/uTan.y,1.0004*zc-.6001,zc);
}`;
  const FS_MESH=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uTex;uniform float uMK,uArrive,uFeather,uFrame,uSpeed,uSheet,uFarPass,uSkyIn,uVr;uniform vec2 uRes,uVc;
varying vec2 vUV;varying float vM,vDist,vD;
const vec3 HAZE=vec3(.89,.80,.86);
void main(){
 vec2 e=min(vUV,1.-vUV);
 float k=clamp(min(e.x*1.6,e.y)/max(uFeather,1e-4),0.,1.);
 float a=k*k*(3.-2.*k)*mix(smoothstep(.35,.9,vM),1.,uFrame);
 float fog=(1.-exp(-min(vDist,130.)*uMK))*(1.-uArrive);
 float skyish=smoothstep(150.,500.,vDist);
 a*=mix(1.-smoothstep(.55,.85,fog),uSkyIn,skyish);
 // 깊이가 끊기는 경계면: 비행 중에는 숨기고(뒤쪽 면이 그 자리를 채운다), 도착 직전에 닫는다
 a*=mix(1.-smoothstep(.04,.7,vD),1.,uSheet);
 // 멀리서 볼 때는 가장자리의 조각난 부분을 안개 속으로 둥글게 녹인다 (다가갈수록 넓어져 도착 전에 사라진다)
 vec2 vq=(gl_FragCoord.xy/uRes*2.-1.)*vec2(uRes.x/uRes.y,1.)-uVc;vq.y*=1.4;
 a*=1.-smoothstep(uVr*.5,uVr,length(vq));
 if(a<.004)discard;
 vec3 tx=texture2D(uTex,vUV,fog*3.+uSpeed*(1.-uArrive)*1.2).rgb;
 tx=mix(tx,vec3(dot(tx,vec3(.3,.59,.11))),fog*.45);
 vec3 col=mix(tx,HAZE,fog*.9*(1.-skyish));
 gl_FragColor=vec4(col*a,a);
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
  const M=mk(VS_MESH,FS_MESH,['aUV','aZM','aFD'],['uRo','uF','uR','uU','uTan','uO','uF0','uR0','uU0','uTanP','uTex','uMK','uArrive','uFeather','uFrame','uSpeed','uSheet','uFarPass','uSkyIn','uVr','uRes','uVc']);
  const C=mk(VS_FULL,FS_CL,['a'],[...CAMU,'uOver','uMist','uArrive','uClear','uPc','uWash','uReveal']);
  if(!A||!M||!C)return;
  const quad=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,quad);g.bufferData(g.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),g.STATIC_DRAW);
  GL={g,A,M,C,quad,tex:false,mesh:null};
  // 휘젓기 격자 → 텍스처 유닛 1 (사진은 유닛 0)
  g.activeTexture(g.TEXTURE1);g.bindTexture(g.TEXTURE_2D,g.createTexture());
  g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);
  g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);
  g.texImage2D(g.TEXTURE_2D,0,g.RGBA,SW,SH,0,g.RGBA,g.UNSIGNED_BYTE,stir.px);
  g.activeTexture(g.TEXTURE0);
  // 사진 → 텍스처 (밉맵을 쓰기 위해 2의 거듭제곱 크기로만 옮겨 담는다. 내용은 그대로)
  const img=$('#portalScene img');
  const up=()=>{try{
    const c=document.createElement('canvas');c.width=2048;c.height=1024;
    const x=c.getContext('2d');x.imageSmoothingQuality='high';x.drawImage(img,0,0,2048,1024);
    const t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);
    g.texImage2D(g.TEXTURE_2D,0,g.RGB,g.RGB,g.UNSIGNED_BYTE,c);
    g.generateMipmap(g.TEXTURE_2D);
    g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR_MIPMAP_LINEAR);
    g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);
    g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,g.CLAMP_TO_EDGE);
    GL.tex=true;
  }catch(e){console.warn(e)}};
  if(img.complete&&img.naturalWidth)up();else img.addEventListener('load',up,{once:true});
  // 깊이맵 → 격자 메시. 삼각형은 먼 것부터 그리도록 정렬한다.
  const dimg=new Image();
  dimg.onload=()=>{try{
    const NX=dimg.naturalWidth,NY=dimg.naturalHeight,c=document.createElement('canvas');c.width=NX;c.height=NY;
    const x=c.getContext('2d');x.drawImage(dimg,0,0);const px=x.getImageData(0,0,NX,NY).data;
    const vb=new Float32Array(NX*NY*7),zs=new Float32Array(NX*NY),lz=new Float32Array(NX*NY);
    for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){const k=j*NX+i,z=Math.exp(lerp(ZMIN,ZMAX,px[k*4]/255));
      vb[k*7]=i/(NX-1);vb[k*7+1]=1-j/(NY-1);vb[k*7+2]=z;vb[k*7+3]=px[k*4+1]/255;zs[k]=z;lz[k]=Math.log(z)}
    // 격자 위의 최댓값/평균 필터 (가로·세로로 나눠 계산)
    const N=NX*NY,tmp=new Float32Array(N);
    const pass=(src,r,avg)=>{const out=new Float32Array(N);
      for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){let m=avg?0:-1e9,c=0;for(let a=Math.max(0,i-r);a<=Math.min(NX-1,i+r);a++){const v=src[j*NX+a];if(avg){m+=v;c++}else if(v>m)m=v}tmp[j*NX+i]=avg?m/c:m}
      for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){let m=avg?0:-1e9,c=0;for(let b=Math.max(0,j-r);b<=Math.min(NY-1,j+r);b++){const v=tmp[b*NX+i];if(avg){m+=v;c++}else if(v>m)m=v}out[j*NX+i]=avg?m/c:m}
      return out};
    // 깊이가 끊기는 자리: 한 칸짜리 톱니 대신 몇 칸에 걸쳐 부드럽게 옅어지는 띠로 만든다
    const disc=new Float32Array(N);
    for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){let lo=9,hi=-9;
      for(let b=Math.max(0,j-1);b<=Math.min(NY-1,j+1);b++)for(let a=Math.max(0,i-1);a<=Math.min(NX-1,i+1);a++){const v=lz[b*NX+a];if(v<lo)lo=v;if(v>hi)hi=v}
      disc[j*NX+i]=clamp((hi-lo-.45)/.5)}
    const band=pass(pass(disc,1,false),2,true);
    // 뒤쪽 면: 주변에서 가장 먼 깊이를 고르고 매끈하게 다듬은 한 장의 배경. 앞쪽 면이 벌어진 틈을 이 면이 채운다
    const farZ=pass(pass(lz,4,false),3,true);
    for(let k=0;k<N;k++)farZ[k]=Math.max(farZ[k],lz[k]);
    // 뒤쪽 면에서도 깊이가 크게 벌어지는 곳(건물·나무 뒤로 하늘이 이어지는 곳)은 늘어진 면이 보이지 않게 부드럽게 지운다
    const fdisc=new Float32Array(N);
    for(let j=0;j<NY;j++)for(let i=0;i<NX;i++){let lo=9,hi=-9;
      for(let b=Math.max(0,j-1);b<=Math.min(NY-1,j+1);b++)for(let a=Math.max(0,i-1);a<=Math.min(NX-1,i+1);a++){const v=farZ[b*NX+a];if(v<lo)lo=v;if(v>hi)hi=v}
      fdisc[j*NX+i]=clamp((hi-lo-.3)/.4)}
    const fband=pass(pass(fdisc,1,false),2,true);
    for(let k=0;k<N;k++){vb[k*7+4]=Math.max(disc[k],clamp(band[k]*1.35));vb[k*7+5]=Math.exp(farZ[k])*1.02;vb[k*7+6]=Math.max(fdisc[k],clamp(fband[k]*1.35))}
    const tris=[];
    for(let j=0;j<NY-1;j++)for(let i=0;i<NX-1;i++){const a=j*NX+i,b=a+1,cc=a+NX,d=cc+1;
      tris.push([zs[a]+zs[b]+zs[cc],a,cc,b],[zs[b]+zs[cc]+zs[d],b,cc,d])}
    tris.sort((p,q)=>q[0]-p[0]);
    const ib=new Uint16Array(tris.length*3);tris.forEach((t,i)=>{ib[i*3]=t[1];ib[i*3+1]=t[2];ib[i*3+2]=t[3]});
    const vbo=g.createBuffer();g.bindBuffer(g.ARRAY_BUFFER,vbo);g.bufferData(g.ARRAY_BUFFER,vb,g.STATIC_DRAW);
    const ibo=g.createBuffer();g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,ibo);g.bufferData(g.ELEMENT_ARRAY_BUFFER,ib,g.STATIC_DRAW);
    GL.mesh={vbo,ibo,n:ib.length};
  }catch(e){console.warn(e)}};
  dimg.src=DEPTH_SRC;
  heroBg.addEventListener('webglcontextlost',e=>{e.preventDefault();GL=null;heroBg.style.opacity='0'});
})();
function sizeGL(){
  if(!GL)return;
  const d=Math.min(devicePixelRatio||1,2);
  let s=d*glScale; const px=VW*VH*s*s, cap=2.2e6; if(px>cap)s*=Math.sqrt(cap/px);
  heroBg.width=Math.max(2,Math.round(VW*s));heroBg.height=Math.max(2,Math.round(VH*s));
  GL.g.viewport(0,0,heroBg.width,heroBg.height);
}
const pv=[0,0,0],vc0=[0,0,0],vc1=[0,0,0];
let mist=0, speed=0, openK=1, auT=0, auLast=-1;
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
  // ② 사진 공간
  if(GL.mesh&&GL.tex&&u>.2){
    const U=GL.M.U;
    g.enable(g.DEPTH_TEST);g.depthFunc(g.LEQUAL);g.clear(g.DEPTH_BUFFER_BIT);
    g.useProgram(GL.M.pr);
    g.bindBuffer(g.ARRAY_BUFFER,GL.mesh.vbo);g.vertexAttribPointer(0,2,g.FLOAT,false,28,0);
    g.enableVertexAttribArray(1);g.vertexAttribPointer(1,4,g.FLOAT,false,28,8);g.enableVertexAttribArray(2);g.vertexAttribPointer(2,1,g.FLOAT,false,28,24);
    g.bindBuffer(g.ELEMENT_ARRAY_BUFFER,GL.mesh.ibo);
    g.uniform3fv(U.uRo,cam.ro);g.uniform3fv(U.uF,cam.f);g.uniform3fv(U.uR,cam.r);g.uniform3fv(U.uU,cam.up);g.uniform2f(U.uTan,tanH,tanV);
    g.uniform3fv(U.uO,O);g.uniform3fv(U.uF0,F0);g.uniform3fv(U.uR0,R0);g.uniform3fv(U.uU0,U0);g.uniform2f(U.uTanP,TANP*IMG_ASPECT,TANP);
    g.uniform1i(U.uTex,0);
    g.uniform1f(U.uMK,(.02*(1-clear)+.0012)*fogT);g.uniform1f(U.uArrive,arrive);
    g.uniform1f(U.uFeather,.09*(1-sst5(range(u,.62,.96))));
    g.uniform1f(U.uFrame,sst5(range(u,.885,.992)));   // 사진 테두리는 시차가 거의 사라진 뒤에 덮는다
    g.uniform1f(U.uSpeed,speed);g.uniform1f(U.uSheet,sst5(range(u,.78,.96)));
    g.uniform1f(U.uSkyIn,sst(range(u,.7,.93)));
    {const cz=14,cx=0,cy=HC+F0[1]*cz,czw=F0[2]*cz, k=.8*TANP*IMG_ASPECT*cz;
     proj(cx,cy,czw,vc0);proj(cx+k,cy,czw,vc1);
     const ax=(vc0[0]/VW*2-1)*VA, ay=1-vc0[1]/VH*2, bx=(vc1[0]/VW*2-1)*VA, by=1-vc1[1]/VH*2;
     const ok=vc0[2]>1&&vc1[2]>1, R=ok?Math.hypot(bx-ax,by-ay)*1.25:.01;
     g.uniform2f(U.uRes,heroBg.width,heroBg.height);g.uniform2f(U.uVc,ok?ax:0,ok?ay:0);
     g.uniform1f(U.uVr,R+40*eIn(range(u,.7,.9)))}
    g.uniform1f(U.uFarPass,1);g.drawElements(g.TRIANGLES,GL.mesh.n,g.UNSIGNED_SHORT,0);
    g.uniform1f(U.uFarPass,0);g.drawElements(g.TRIANGLES,GL.mesh.n,g.UNSIGNED_SHORT,0);
    g.disableVertexAttribArray(1);g.disableVertexAttribArray(2);g.disable(g.DEPTH_TEST);
  }
  // ③ 구름
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

/* ======================= 렌더 ======================= */
let lastU=0, slow=0;
const lb=[0,0,0];
function render(p,time,dt){
  const u=clamp(p/FLIGHT_END), flat=reduce||!GL;
  const fin=flat?0:sst(range(p,.004,.09));          // 첫 화면 → 비행 화면으로 겹쳐 넘어간다
  heroBg.style.opacity=fin.toFixed(3); depthFx.style.opacity=fin.toFixed(3);
  if(flat){
    portal.style.opacity=range(p,.12,.6).toFixed(3);
    pScene.style.transform=`scale(${lerp(1.12,1,range(p,.12,FLIGHT_END)).toFixed(4)})`;
    pLabel.style.opacity='0';
    return;
  }
  camAt(u,time);
  const du=Math.abs(u-lastU); lastU=u;
  speed=lerp(speed,clamp(du/Math.max(dt,.001)*2.2),1-Math.pow(.88,dt*60));
  const jump=du>.05;
  const done=range(p,FLIGHT_END,FLIGHT_END+.035);
  portal.style.opacity=done.toFixed(3);
  pScene.style.transform='none';
  if(fin>0&&done<1){
    if(p<FLIGHT_END){slow=dt>.03?slow+1:Math.max(0,slow-1);if(slow>45&&glScale>.5){glScale*=.8;slow=0;sizeGL()}}   // 느리면 해상도를 낮춘다
    drawGL(u,time);
  }
  if(fin>0)drawDepth(u,time,jump);else ctx.clearRect(0,0,VW,VH);
  proj(0,0,-9,lb);
  const lo=lb[2]>1?range(u,.5,.56)*(1-range(u,.64,.7)):0;
  pLabel.style.opacity=lo.toFixed(3);
  if(lo>0)pLabel.style.transform=`translate(${clamp(lb[0],110,VW-110).toFixed(1)}px,${clamp(lb[1]+26,60,VH-90).toFixed(1)}px) translateX(-50%)`;
}
function resize(){VW=innerWidth;VH=innerHeight;fitCam();sizeGL();sizeCanvas();buildDepth()}
addEventListener('resize',resize);
resize();
window.__flight={render,FLIGHT_END,get gl(){return !!GL}};
})();
