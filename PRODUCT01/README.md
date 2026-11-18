# PRODUCT01 · KNOBLE

개인 제품 소개 페이지. 인터넷 없이 동작합니다 (Three.js·폰트·영상·모델 모두 폴더 내부 포함).

- `index.html` — 페이지 진입 파일
- `assets/images/` · `assets/videos/` — 이미지·영상
- `assets/models/product.glb` — 원본 제품 3D 모델
- `assets/models/knoble-model.js` — 같은 모델을 JS로 감싼 파일 (파일 더블클릭 실행에서도 3D 뷰어가 뜨도록)
- `assets/js/knoble.bundle.js` — 페이지 스크립트 + Three.js 0.170 (CDN 대신 내부 포함)
- `src/` — 편집용 원본 스크립트. 수정 후 `src` 폴더에서 `npm i && npm run build`로 번들을 다시 만듭니다.

내비게이션: `전체 프로젝트` → `../../index.html`, `COLLEGE FESTIVAL 2031` (조 페이지) → `../index.html#projects`
