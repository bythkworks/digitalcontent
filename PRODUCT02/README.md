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
| IMG-01 | images/product-hero.webp | 01 히어로 · 06 3D 대체 이미지 | 16:9, 2400px, 3/4 뷰 |
| IMG-02–03 | images/product-problem-01–02.webp | 02 문제 카드 | 4:3, 1200px |
| IMG-04–06 | images/product-feature-01–03.webp | 03 기능 카드 | 16:10, 1600px |
| IMG-07 | images/product-system.webp | 04 시스템 뷰 | 약 1.85:1. 지금 이미지에는 01–03 라벨이 들어 있어서 코드 라벨을 꺼 두었습니다(`sys-stage`의 `baked` 클래스). 라벨 없는 이미지로 바꾸면 `baked`를 지우세요 |
| IMG-08–11 | images/product-scenario-01–04.webp | 05 STEP 썸네일 | 16:9, 1600px |
| IMG-12–14 | images/product-front / side / detail.webp | 06 썸네일 | 1:1, 1200px |
| IMG-15 | images/product-spec.webp | 07 사양 | 정면 렌더 + 치수선 |
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

## 06 DESIGN · 3D 뷰어 기능
| 버튼 | 동작 |
|---|---|
| 3/4 · 정면 · 측면 · 위 | 카메라가 해당 시점으로 부드럽게 이동 |
| 가림막 접기 / 펼치기 | 가림막이 본체 안으로 접히고 다시 펼쳐짐 |
| 설명 | 3D 위의 번호 핀 켜기·끄기. 핀을 누르거나 마우스를 올리면 설명 카드가 열림 |
| 자동 회전 | 천천히 도는 회전 켜기·끄기(드래그하면 자동으로 멈춤) |
| 밤 | 어두운 배경과 낮은 조명으로 전환, 가장자리 조명이 더 밝게 빛남 |
| ＋ － ↺ ⛶ | 확대, 축소, 처음 시점으로, 전체화면 |

- 마우스 휠은 페이지 스크롤에 쓰입니다. 3D 확대는 버튼, 핀치, 또는 Ctrl(⌘)+스크롤로 합니다.
- **설명 핀 수정**: `product.json` → `TEXT-06.hotspots`에서 `label`, `body`, `pos`([x, y, z], GLB 원본 좌표)를 바꾸세요. `"fan": true`인 핀은 가림막을 접으면 숨겨집니다.
- **실제 모델로 바꿀 때 가림막 접기**: GLB 안에 가림막 애니메이션(클립)이 있으면 버튼이 그 애니메이션을 재생합니다. 애니메이션이 없고 `FanLeft`·`FanRight`·`RibLeft`·`RibRight` 메시도 없으면 버튼이 자동으로 숨겨집니다.
