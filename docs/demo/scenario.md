# 데모 시나리오 (3분)

> 여기 없는 기능은 만들지 않는다. 순서는 실제 발표 순서.

| # | 화면 | 사용자 행동 | 기대 결과 | 호출 API | 상태 |
|---|---|---|---|---|---|
| 1 | 홈 | 접속 | 목록이 뜬다 | GET /api/items | 📝 |
| 2 | 홈 | 입력 후 "분석" 클릭 | 로딩 → 결과 카드 | POST /api/analyze | 📝 |
| 3 | 상세 | 결과 클릭 | 상세 정보 | GET /api/items/{id} | 📝 |

## 백업 플랜
- 백엔드 죽으면: 프론트 `VITE_USE_MOCK=true`로 mock 응답 전환
- 네트워크 죽으면: `docs/demo/backup.mp4` 재생

## 스크린샷
개발 중 `docs/demo/screenshots/`에 `01-home.png` 식으로 저장.
