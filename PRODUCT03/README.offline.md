# 오프라인 동작 메모 (College Festival 2031 사이트에 연결하면서 바꾼 부분)

- 3D 모델 내장 사본 `assets/models/product-glb.js` 추가 (더블클릭으로 열 때 사용, product.glb를 바꾸면 이 파일도 다시 만들어야 함)
- 3D 뷰어 스크립트를 `assets/js/viewer.src.js`(원본)로 분리하고, Three.js를 포함한 번들 `assets/js/viewer.js`로 연결
  → index.html을 더블클릭해도, 로컬 서버로 열어도 3D가 동작
- 다시 번들하려면: `npx esbuild assets/js/viewer.src.js --bundle --format=iife --minify --alias:three=./assets/lib/three/three.module.min.js --alias:three/addons=./assets/lib/three/addons --outfile=assets/js/viewer.js`
- 문구·이미지·레이아웃·모델은 받은 그대로입니다.
