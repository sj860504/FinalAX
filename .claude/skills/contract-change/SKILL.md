---
name: contract-change
description: API 계약(shared/api-contract.md)을 바꿀 때 쓴다. 계약 수정 + 변경 노트(shared/changes/<slug>.<ts>.md) + 내 쪽 코드 반영 + 상대 리뷰 PR + 상대에게 [요청] 이슈를 한 번에 만든다. "계약 바꿔", "응답에 필드 추가", "/contract-change <설명>" 으로 호출. 프론트·백엔드 누구나 쓴다.
---

# 계약 변경 제안

`$ARGUMENTS` = 바꾸려는 내용. 계약 문서는 **진실**이므로 코드보다 문서를 먼저 고친다.

## 0. 내 쪽 판별
`gh api user --jq .login` → CLAUDE.md 1항 표에서 내 영역(`frontend` | `backend`)과 상대 ID. 표에 `@팀원ID`가 남아 있으면 묻는다.

## 1. 확인
"공동 영역(`shared/`)을 건드립니다. 진행할까요?" 한 번 묻는다. 타임라인이 기능 동결 이후면 계약 변경은 버그 수정 목적만 허용됨을 알린다.

## 2. 이슈 · 브랜치
```
gh issue create --title "[shared] 계약 변경: <설명>" --label shared --label P1|P2 --assignee <나> --body "<무엇을 왜>"
git pull --rebase origin main && git checkout -b shared/<N>-contract-<slug>
```

## 3. 계약 문서 수정
- `shared/api-contract.md` 해당 항목을 고친다. **삭제·이름 변경**이면 상태 표기를 `🔧 진행 중` 으로 바꾸고, 필드 추가만이면 그대로.
- 맨 아래 "변경 이력" 표에 한 줄 추가(시각·누가·변경).

## 4. 변경 노트 생성
```
TS=$(date -u +%Y%m%dT%H%M%S)
```
`templates/change.md` 로 `shared/changes/<slug>.${TS}.md` 작성. slug 는 소문자·하이픈(예: `items-add-description`). 양쪽 "할 일"을 모두 채운다. 상대가 이 파일만 보고 작업할 수 있어야 한다.

## 5. 내 쪽 코드 반영 (implementer 에 위임)
- frontend 면: `frontend/src/types/api.ts`, `frontend/src/mocks/` 를 새 계약에 맞춘다.
- backend 면: `backend/app/schemas/<domain>/` 를 새 계약에 맞춘다(라우터·서비스 수정은 별도 이슈).
- 상대 폴더는 건드리지 않는다.
- 내 마커 갱신: `echo $TS > shared/changes/.applied-<내쪽>`
- 노트의 내 쪽 "적용 상태"를 ✅ 로.

## 6. 검증 (validator 에 위임)
계약 문서 ↔ 내 쪽 타입/스키마 필드 일치, `tsc -b` 또는 `python -c "import app.main"`, 노트 파일명 ts 와 마커 값 일치.

## 7. PR · 상대 알림
```
git push -u origin HEAD
gh pr create --title "[#N] 계약 변경: <설명>" --reviewer <상대> --body "Closes #N ... 변경 노트: shared/changes/<slug>.${TS}.md"
gh issue create --title "[요청] 계약 <slug> 적용 (<상대 영역>)" --label request --label <상대영역> --label P1|P2 --assignee <상대> \
  --body "변경 노트: shared/changes/<slug>.${TS}.md — /contract-sync 로 적용. 계약 PR: <url>"
```
공동 영역 PR 이므로 **상대 승인 후 머지**. 머지 전까지 상대는 노트를 보고 자기 브랜치에서 미리 작업할 수 있다.
