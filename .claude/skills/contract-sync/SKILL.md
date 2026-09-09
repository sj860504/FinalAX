---
name: contract-sync
description: 상대가 제안한 계약 변경 중 내가 아직 적용하지 않은 것(내 마커 이후 ts)만 찾아 내 쪽 코드에 반영하고 마커를 올린다. "계약 바뀐 거 있어?", "계약 반영해", "[요청] 계약 … 적용" 이슈를 받았을 때, /contract-sync 로 호출.
---

# 계약 변경 적용

## 0. 내 쪽 판별
`gh api user --jq .login` → CLAUDE.md 1항 표 → `frontend` | `backend`.

## 1. 미적용 노트 찾기
```
git pull --rebase origin main
sh .claude/skills/contract-sync/scripts/pending.sh <내쪽>
```
- 결과가 없으면 "적용할 계약 변경 없음. 마커: <ts>" 한 줄로 끝.
- 있으면 각 파일의 제목·ts·"<내쪽>이 할 일" 체크박스만 뽑아 표로 보여준다. 여러 개면 **오래된 것부터** 순서대로 처리한다.

## 2. 이슈 확인
노트에 적힌 `[요청] 계약 <slug> 적용` 이슈를 찾는다(`gh issue list --label request --search "<slug>"`). 없으면 내 앞으로 만든다(라벨 `request`, `<내쪽>`). 브랜치:
```
git checkout -b <내쪽>/<N>-contract-<slug>
```

## 3. 반영 (implementer 에 위임)
노트의 "<내쪽>이 할 일" 체크박스를 그대로 넘긴다. 내 소유 폴더만 수정.
- frontend: `src/types/api.ts`(계약 스키마 그대로), `src/mocks/`(형식 일치), 영향받는 페이지.
- backend: `app/schemas/<domain>/`, 필요하면 `api/<domain>/router.py`, `services/`, `repositories/`.
끝나면:
```
echo <ts> > shared/changes/.applied-<내쪽>      # 처리한 노트 중 가장 최신 ts
```
노트 파일의 내 쪽 체크박스와 "적용 상태"를 ✅ 로 바꾼다. (`shared/changes/` 의 마커·체크박스는 승인 면제)

## 4. 검증 (validator 에 위임)
계약 문서 ↔ 내 쪽 타입/스키마 필드 일치, 빌드/import, 마커 값 = 처리한 최신 ts, `pending.sh <내쪽>` 이 비어 있음.

## 5. PR
```
git push -u origin HEAD
gh pr create --title "[#N] 계약 <slug> 적용" --body "Closes #N ... 노트: shared/changes/<slug>.<ts>.md"
```
내 폴더 + 마커만 바꿨으므로 CI 통과 후 셀프 머지 가능. 이슈에 코멘트 2~3줄.
