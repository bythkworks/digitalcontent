# PRODUCT02 — PATH GUARD 제품 상세 페이지

2030 FUTURE WORLD › TEAM0X › PRODUCT0X 구조의 개인 제품 소개 페이지입니다.
화면 구조와 에셋 ID는 ASSET WIREFRAME을 따르고, 스타일은 DC Design Guide를 따릅니다.

## 미리보기
`index.html`을 더블클릭해도 3D까지 보입니다(`models/product-glb.js`의 내장 사본 사용). 단, **product.json 원고 수정은 로컬 서버에서만 반영**됩니다.
VS Code의 Live Server 확장을 쓰거나, `PROJECT/` 폴더에서 `python3 -m http.server`를 실행하세요.
(GSAP, Three.js, Pretendard는 CDN에서 불러오므로 인터넷 연결이 필요합니다.)

## 에셋 교체 방법
모든 에셋은 **같은 파일명으로 덮어쓰면** 코드를 수정하지 않아도 바로 반영됩니다.
지금 들어 있는 파일은 레이아웃 확인용 플레이스홀더이며, 왼쪽 아래에 `PLACEHOLDER` 표시가 있습니다.

| ID | 파일 | 섹션 | 권장 사양 |
|---|---|---|---|
| IMG-01 | images/product-hero.webp | 01 첫 화면 메인 이미지 | 스튜디오 제품 사진, 1653×952 |
| — | images/product-scene.webp | (현재 페이지에서 사용 안 함) | 축제 장면 |
| IMG-01b | images/product-hero-poster.webp | 06 3D 뷰어 포스터(로딩 · 실패 시) | 1672×941, 정면, 밝은 웜그레이 배경 |
| IMG-02–03 | images/product-problem-01–02.webp | 02 문제 카드 | 4:3, 1200px |
| IMG-04–06 | images/product-feature-01–03.webp | 03 기능 카드 | 16:10, 1600px |
| IMG-07 | images/product-system.webp | 04 시스템 뷰 | 약 1.85:1. 지금 이미지에는 01–03 라벨이 들어 있어서 코드 라벨을 꺼 두었습니다(`sys-stage`의 `baked` 클래스). 라벨 없는 이미지로 바꾸면 `baked`를 지우세요 |
| IMG-08–11 | images/product-scenario-01–04.webp | 05 STEP 썸네일 | 16:9, 1600px |
| IMG-12–14 | images/product-front / side / detail.webp | (현재 페이지에서 사용 안 함) | 1:1, 1200px |
| IMG-15 | images/product-spec.webp | 07 사양 상단 | 가림막을 펼친 정면 렌더 (1721×914) |
| 3D-01 | models/product.glb | 06 3D 뷰어 | 텍스처 포함 5MB 이하, 원점 중심. **교체하면 `models/product-glb.js`는 지우세요**(남아 있으면 더블클릭으로 열 때 예전 모델이 보입니다) |
| VIDEO-01 | videos/product-scenario.mp4 / .webm | 05 시나리오 | 무음, 루프. STEP 구간은 아래 참고 |
| TEXT-01–08 | content/product.json | 전체 원고 | 「」 부분을 교체 |
| UI | ../assets/images/logo.svg | 헤더 | 조 공통 로고 |

## 자주 고치는 부분
- **원고**: `assets/content/product.json`만 수정하면 됩니다. 「」로 표시된 부분이 교체할 자리입니다.
- **04 시스템 라벨 위치**: product.json의 `TEXT-04.steps[].x / y` 값(이미지 기준 %)을 바꾸세요.
- **05 영상 STEP 구간**: index.html의 `.scn-step` 버튼에 있는 `data-start` / `data-end`(초)를 실제 영상에 맞게 바꾸세요. 현재 값은 0–2 / 2–4 / 4–6 / 6–8초입니다.
- **사양 TBD**: 값이 `TBD`이면 점선 배지로 표시됩니다. 값이 정해지면 product.json에서 바꾸세요.
- **다음 제품 링크**: 하단 세 번째 링크는 지금 조 페이지(`../index.html#products`)로 연결됩니다. 최종 취합 뒤 실제 경로로 바꾸세요.

## 인터랙션 맵
| ID | 내용 | 구현 |
|---|---|---|
| INTERACTION-01 | 히어로 순차 등장(stagger 0.15) | GSAP |
| INTERACTION-02 | 문제 카드가 아래에서 위로 + 캡션 페이드(top 70%) | ScrollTrigger |
| INTERACTION-03 | 기능 카드 가로 스크롤(pin). 활성 카드 1.0, 나머지 0.92 · 50% | ScrollTrigger scrub |
| INTERACTION-04 | 01 → 02 → 03 순차 하이라이트(pin) | ScrollTrigger |
| INTERACTION-05 | 시나리오 4단계(pin 400vh) + 영상 구간 동기화 | ScrollTrigger + video |
| INTERACTION-06 | 썸네일 클릭으로 이미지 교체(fade 0.3s), 3D 드래그 회전과 확대 | Three.js |
| INTERACTION-07 | 사양 순차 등장 | ScrollTrigger |
| INTERACTION-08 | Sticky 탭, 현재 섹션 강조, 클릭하면 이동 | ScrollTrigger |
| INTERACTION-09 | 공통 fade-up reveal | ScrollTrigger |
| INTERACTION-10 | 버튼 Default / Hover / Press | CSS |

화면 너비가 900px 이하이면 고정(pin) 연출을 끄고, 기능 카드는 스와이프, STEP은 탭으로 전환합니다.
`prefers-reduced-motion`(동작 줄이기)을 켠 사용자에게는 모션 없이 모든 콘텐츠를 보여 줍니다.

## 06 3D 디자인 · 실시간 3D 제품 뷰어 (3D-01)
3D 뷰어는 06 3D 디자인 섹션에 있습니다. 이 섹션에는 3D 뷰어만 있습니다. 포스터 사진(`images/product-hero-poster.webp`)이 먼저 보이고, 모델을 불러오면 같은 구도의 3D 화면으로 부드럽게 바뀝니다. 모델을 불러오지 못하면 포스터가 그대로 남습니다.

| 조작 | 데스크톱 | 모바일 |
|---|---|---|
| 둘러보기 | 드래그로 회전 | 가로로 밀어 회전 (세로로 쓸면 페이지 스크롤) |
| 확대 · 축소 | 마우스 휠 | 두 손가락 |

| 버튼 | 동작 |
|---|---|
| 가림막 접기 / 펼치기 | 패널을 5° 폭의 단단한 살로 나눠 접이식 부채처럼 결합부 축을 중심으로 모음. 마지막에 LED 프레임이 안쪽·아래로 3cm 들어가 모든 부품이 본체 안에 수납됨. 끝나면 버튼 글자가 바뀜 (`CFG.fold`에서 각도·이동 거리 조정) |
| 가림막 360° 회전 | 양쪽 패널 + LED 프레임 + 가운데 본체 기둥(본체4)이 함께 본체 중심 수직축으로 한 바퀴. 센서 밴드·상단 캡·베이스·바퀴와 카메라는 그대로 (`CFG.parts.spinWith`에서 함께 돌 부품을 바꿀 수 있음) |
| LED 끄기 / 켜기 | 사선 프레임의 발광만 전환 |
| 밤 모드 / 낮 모드 | 0.6초 동안 어두운 스튜디오로 바뀌고, LED가 본체 쪽 아이스 블루(#B3DEFF) → 끝 라벤더(#D4C2E8)로 물듦. 유리 가장자리에 파스텔 헤어라인, 띠 옆 약한 번짐과 본체 반사광 (모두 날개와 함께 움직임) |
| 처음 보기 | 진행 중인 동작을 멈추고 정면 구도 · 가림막 펼침 · 백색 LED · 낮 모드로 복귀 |

- **모델 교체**: `models/product.glb`를 덮어쓰고, `models/product-glb.js`(더블클릭용 사본)는 지우세요.
- **부품 이름**: index.html 아래쪽 `CFG.parts`에 GLB 노드 이름이 적혀 있습니다(본체3·4·11·12 = 본체, 본체2 = 센서 밴드, 본체8·9·10 = 바퀴, 본체14·15 / 17·18 = 안쪽·바깥 패널, 본체5 / 16 = LED 프레임). 다시 내보내 이름이 바뀌면 여기만 고치면 됩니다.
- **결합부 축 · LED 띠**는 GLB 형상에서 자동으로 계산합니다(안쪽 패널의 가장 낮은 꼭짓점 = 접힘 축, 프레임의 길이 방향 = LED 띠).
- **첫 구도**는 포스터 속 제품 크기(`CFG.photo`)에 맞춰 계산됩니다. 포스터를 바꾸면 그 값(제품 높이 비율, 세로 중심)도 맞춰 주세요.


### 스튜디오 라이팅 (index.html `LIGHT`, `studioEnv`, `MAT`)
- 키: 정면 · 약간 위 · 화면 왼쪽의 세로로 긴 면 조명(RectAreaLight) → 본체 왼쪽 1/3에 세로 하이라이트, 오른쪽으로 옅은 회색
- 보조: 오른쪽 약한 중성 면 조명 · 반사 환경: 같은 위치의 소프트박스·반사판(장면에 고정 → 회전하면 반사가 표면을 따라 움직임)
- 재질: 본체 새틴 화이트(metalness 0, roughness 0.4) · 밴드 유광 블랙(roughness 0.14) · 투명 유리 + 헤어라인 · LED는 띠에만 발광
- 배경 #D9D9D9, 바퀴 아래 접지 그림자. 포스터(`product-hero-poster.webp`)는 같은 구도의 3D 정면 렌더

### 07 Specs & Materials
`product.json` → `TEXT-08.specs`의 8개 항목이 아이콘 스펙 목록으로 표시됩니다. 값 안의 ` · `는 줄바꿈 기준입니다(첫 부분 = 진한 줄, 나머지 = 작은 보조 줄). 크기 항목의 `big`은 위에 크게 표시되는 숫자입니다.

### 03 핵심 기능 · 04 작동 원리 (구성 변경)
- 03 핵심 기능: 카드 3개 — IMG-16 `product-func-move.webp`(이동), IMG-17 `product-func-deploy.webp`(바리케이드 전개), IMG-18 `product-func-rotate.webp`(회전). 문구는 `product.json` → `TEXT-03`.
- 04 작동 원리: 예전 03의 가로 스크롤 카드(IMG-04~06, `product-feature-01~03.webp`)를 옮겨 왔습니다. 문구는 `TEXT-04`.
- 예전 04 시스템 이미지 `product-system.webp`(IMG-07)는 현재 페이지에서 사용하지 않습니다.

### 02 동선 문제 — 스크롤 애니메이션
- 사진 카드 대신 아이소메트릭 SVG 장면이 화면에 고정된 채 스크롤에 따라 진행됩니다(코드로 그림, 이미지 파일 없음).
  도로 없는 광장: STEP 1 부스 앞 줄 뒤로 차량 → STEP 2 광장을 가로지르던 학생들이 멈춤 → STEP 3 광장 전체의 엉킨 동선.
- 문구: `product.json` → `TEXT-02.captions[].title / body / highlight` (`highlight`는 그라데이션으로 강조할 부분, body에 그대로 들어 있어야 함).
- `product-problem-01/02.webp`(IMG-02/03)는 현재 페이지에서 사용하지 않습니다.

### 05 사용 장면 영상
- 영상 4개를 04 작동 원리처럼 가로 스크롤 카드로 보여줍니다. 스크롤하면 카드가 넘어가고, 가운데(활성) 카드의 영상만 처음부터 반복 재생됩니다(각 약 4초, 1280×720, 소리 없음). 모바일은 옆으로 넘겨서 봅니다.
  VIDEO-01 `product-scenario-01.mp4` 로봇 이동 · VIDEO-02 `-02` 가림막 전개 · VIDEO-03 `-03` 학생 보행 · VIDEO-04 `-04` 차량 통과.
  포스터(영상이 뜨기 전 이미지)는 `images/product-scenario-01~04.webp`.
- 문구: `product.json` → `TEXT-05.headline`, `TEXT-05.steps[].no / title / body`.
