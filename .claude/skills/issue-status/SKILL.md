---
name: issue-status
description: GitHub 이슈 현황을 담당자·라벨·블로커 기준으로 한 화면에 정리한다. "지금 뭐 남았어", "블로커 있어?", "현황 정리해줘", 스탠드업 전, 또는 /issue-status 로 호출.
---

# 이슈 현황 정리

## 1. 수집
```
gh issue list --state open --limit 100 --json number,title,labels,assignees,updatedAt,url
gh pr list --state open --json number,title,headRefName,author,isDraft,url
gh issue list --state closed --limit 20 --json number,title,closedAt
```

## 2. 정리 순서 (위가 급한 것)
1. **블로커** (`blocker` 라벨) — 누가 누구를 막고 있는지, 몇 시간 방치됐는지(`updatedAt` 기준). 30분 넘게 움직임 없으면 표시.
2. **담당자 없는 이슈** — CLAUDE.md 2항 위반. 바로 어싸인 제안.
3. **담당자별 열린 이슈** — 각자 `P1` 먼저, 그다음 `P2`. 라벨 없는 이슈는 "라벨 없음"으로 표시.
4. **열린 PR** — 공동 영역(`shared`) PR은 상대 승인 대기임을 표시.
5. **최근 닫힌 이슈** — 오늘 끝낸 것 요약 한 줄씩.

## 3. 타임라인 판단
CLAUDE.md 7항 표를 보고 지금 단계(병렬 개발 / 1차 통합 / 보강 / 기능 동결)를 적고, 그 단계에서 허용되지 않는 이슈(예: 동결 이후 기능 이슈)가 있으면 경고한다. 시작 시각은 첫 커밋 시각(`git log --reverse --format=%ci | head -1`)으로 추정하고, 사용자가 다르게 말하면 그걸 따른다.

## 4. 출력 형식
마크다운 표 하나(번호 · 제목 · 담당 · 라벨 · 마지막 갱신)와 그 위에 3줄 요약:
- 블로커 N개 / 담당자 없음 N개 / P1 남은 것 N개
- 지금 단계와 남은 시간
- 바로 해야 할 행동 1~2개 (예: "#12 블로커를 백엔드가 먼저 처리")

읽기 전용이다. 이슈를 만들거나 닫지 않는다. 필요하면 `/issue-request` 를 안내한다.
