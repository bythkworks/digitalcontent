# TEAM03 / PRODUCT03 — FLOW DIAL

## 문구 수정
`assets/content/product.json` 하나만 고치면 됩니다. (TEXT-01 ~ TEXT-08)
- `index.html`을 더블클릭(file://)으로 열면 json을 읽지 못하므로 HTML 안의 기본 문구가 보입니다.
  수정 내용을 바로 보려면 로컬 서버로 여세요. 예: 프로젝트 폴더에서 `python3 -m http.server` → http://localhost:8000/TEAM03/PRODUCT03/
- 3D 뷰어도 로컬 서버/배포 환경에서만 표시됩니다.

## 빈칸으로 남은 에셋 — 아래 파일명 그대로 넣으면 자동 교체
| ID | 파일 | 위치 |
|---|---|---|
| IMG-02 | assets/images/product-problem-01.webp | 02 문제 카드 1 |
| IMG-03 | assets/images/product-problem-02.webp | 02 문제 카드 2 |
| IMG-04~06 | assets/images/product-feature-01~03.webp | 03 기능 카드 (2:1) |
| IMG-07 | assets/images/product-system.webp | 04 시스템 뷰 (01~03 라벨은 코드 오버레이) |
| VIDEO-01 | assets/videos/product-scenario.mp4 / .webm | 05 시나리오 영상 |
| IMG-08~11 | assets/images/product-scenario-01~04.webp | 05 STEP 썸네일 (01은 영상 포스터 겸용) |
| logo | ../assets/images/logo.svg (조 공통) | 헤더 로고 |

영상 넣은 뒤 `index.html`의 `.scn-step` 버튼 `data-start / data-end`(초)를 실제 구간에 맞춰 주세요.

## 받은 에셋 매핑
- IMG-01 product-hero.webp — 3/4 렌더
- IMG-12 product-front.webp — 정면 렌더
- IMG-13 product-side.webp — 5면도에서 SIDE VIEW를 잘라 사용 (따로 렌더하면 교체)
- IMG-14 product-detail.webp — 다이얼 클로즈업
- IMG-15 product-spec.webp — 5면도 (치수선 렌더가 생기면 교체)
- 3D-01 product.glb — 페이스 그라데이션 색은 렌더에 맞게 코드에서 보정함

## 라이브러리 (CDN 없음)
`assets/lib/` GSAP 3.12.5 · ScrollTrigger · Three.js 0.160.0 / `assets/fonts/` Pretendard Variable
