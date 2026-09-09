# <제목: 무엇이 어떻게 바뀌나 한 문장>

- ts: <YYYYMMDDTHHMMSS>
- 제안: @<github id> (<frontend|backend>)
- 이슈 / PR: #<N> / #<PR>
- 계약 항목: <예: GET /api/items, 공통 스키마 Item>

## 변경 내용
<계약 문서의 바뀐 부분. 전/후 JSON 또는 필드 표. 삭제·이름 변경은 굵게>

## 프론트가 할 일 (`frontend/`)
- [ ] `src/types/api.ts`: <필드>
- [ ] `src/mocks/`: <형식 맞추기>
- [ ] <호출하는 페이지/컴포넌트>

## 백엔드가 할 일 (`backend/`)
- [ ] `app/schemas/<domain>/`: <필드>
- [ ] `app/api/<domain>/router.py`, `services/`: <응답 조립>
- [ ] <모델/DB 영향 있으면>

## 적용 상태
- frontend: ⬜  (적용 PR #)
- backend: ⬜  (적용 PR #)
