---
name: work-issue
description: GitHub 이슈 번호 하나를 받아 CLAUDE.md 10항 흐름(계획 → implementer 구현 → validator 검증 → 이슈 코멘트 → PR)으로 끝까지 처리한다. "#12 작업해줘", "이슈 12 해줘", /work-issue 12 로 호출.
---

# 이슈 하나를 끝까지

`$ARGUMENTS` = 이슈 번호. 없으면 묻는다. 메인(플래너)은 **코드를 직접 고치지 않는다.**

## 1. 읽기·확인
```
gh issue view <N> --json number,title,body,labels,assignees,state
git pull --rebase origin main
```
- 담당자가 나(현재 GitHub 사용자, `gh api user --jq .login`)가 아니거나 없으면 **중단하고 알린다.**
- 라벨로 영역과 소유 폴더를 정한다(CLAUDE.md 1항 표). 완료 조건 체크박스를 추출한다. 없으면 이슈에 완료 조건을 먼저 제안하고 중단.
- 7항 타임라인이 기능 동결 이후이고 이슈가 기능 추가면 알리고 중단.

## 2. 계획
바꿀 파일 목록(소유 폴더 안만)을 사용자에게 보여준다. 5개 넘으면 확인. 브랜치:
```
git checkout -b <영역>/<N>-<짧은설명>
```

## 3. 구현 위임
`Agent` 도구, `subagent_type: "implementer"`. 프롬프트에 넣을 것: 이슈 번호·제목·본문, 완료 조건, 바꿀 파일 목록, 소유 폴더, 브랜치명, "커밋은 `[#N] 요약` 형식으로 잘게". 결과로 바꾼 파일 목록과 검증 항목을 받는다.

## 4. 검증 위임
`Agent` 도구, `subagent_type: "validator"`. 프롬프트에 넣을 것: 이슈 번호, 완료 조건 그대로, 바꾼 파일 목록, "PASS/FAIL 표로 보고". 
- FAIL → 실패 목록을 implementer 에게 다시 넘긴다(3단계). 2회 반복 후에도 FAIL 이면 사용자에게 알리고 중단.

## 5. 마무리
```
git push -u origin <브랜치>
gh pr create --fill --body "Closes #<N>

<바꾼 것 3줄>

## 검증
<validator 표>"
gh issue comment <N> --body "<무엇을 바꿨고 어떻게 확인했는지 2~3줄> / PR: <url>"
```
- 공동 영역을 건드렸으면 PR 에 상대를 리뷰어로 지정하고 "상대 승인 필요"를 알린다. 아니면 CI 통과 후 셀프 머지 가능함을 알린다(머지는 사용자가 결정).
- 범위 밖에서 발견한 문제는 고치지 말고 새 이슈 제안 문구로만 남긴다.
