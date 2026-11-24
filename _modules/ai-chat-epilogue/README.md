# AI 대화 에필로그 모듈 (보존용)

WORLD 다음에 나오던 **'나의 AI' 휴대폰 대화 장면**(`#world-c`)을 따로 떼어 보관한 폴더입니다.
v15 제안안(CONNECTED VISION)으로 이 자리를 바꾼 뒤에도, 요청 한 번으로 다시 되돌리거나 다른 위치에 넣을 수 있게 남겨 둡니다.
사이트는 이 폴더를 불러오지 않으므로 그대로 두어도 화면에 영향이 없습니다.

## 들어 있는 것
| 파일 | 내용 |
|---|---|
| `section.html` | `<section id="world-c">` 마크업 (휴대폰 틀, 대화 목록 자리, 배경·파동 레이어) |
| `style.css` | 이 섹션 전용 CSS 규칙 185개 + 사용하는 키프레임 (모바일 미디어쿼리 포함) |
| `script.js` | 배경 그라데이션(EC_BG), 대화 데이터(EC_MSG·EC_CHOICES·EC_ROLES), 선택 버튼, 입력 중 표시, 'AI는 모든 것을 대신 결정하지 않습니다' 그라데이션 파동, `renderWorldC` / `tickWorldC` |

## 이 섹션이 사이트와 연결되던 지점 (되돌릴 때 다시 연결)
1. **장면 등록** — `const scenes=[...]`에 `[worldC,renderWorldC]` (worldA 다음)
2. **매 프레임 루프** — `tickWorldC();` (tickWorld 다음)
3. **스크롤 정지 위치** — `HOLDS['world-c']=[.11,.22,.35,.45,.55,.65,.78,.92]`, `HOLD_W['world-c']=.05`
4. **섹션 높이** — CSS `#world-c{height:360vh}` (style.css에 포함)
5. **사운드 반응음** — Sound 감시 `SECS`에 `'world-c'`, 그리고
   `const n=EC.n; if(n!==W.ec){...Sound.play('key'|'msgMe'|'msgAi')...}`
6. **오른쪽 진행 바** — `window.SPRAIL` 섹션 목록의 `['world-c','EPILOGUE']`
7. **상단 WORLD 드롭다운** — `data-jx="world-c"` (05 EPILOGUE)
8. **장면 이미지** — `WORLD_ART[5]` (메인 스크립트의 이미지 배열에 그대로 있음)

## 통째로 되돌리는 가장 쉬운 방법
깃 태그 **`keep/ai-chat-epilogue`** 가 이 장면이 들어 있던 마지막 버전(커밋 f58852d)을 가리킵니다.
"AI 대화 화면 다시 넣어줘"라고 요청하면, 이 폴더와 태그를 기준으로 현재 버전에 다시 끼워 넣습니다.

## 초안 문구 표시
`script.js`에서 `// [초안]` 표시가 붙은 줄은 팀 확정 문구가 아닙니다.
