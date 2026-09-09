#!/bin/sh
# 사용: pending.sh <frontend|backend> [repo-root]
# 내 마커(.applied-<side>) 이후 ts 의 변경 노트를 오래된 것부터 출력한다. 없으면 아무것도 출력하지 않고 종료코드 0.
side="$1"; root="${2:-.}"
dir="$root/shared/changes"
[ -n "$side" ] || { echo "usage: pending.sh <frontend|backend> [repo-root]" >&2; exit 2; }
marker="$dir/.applied-$side"
last=$( [ -f "$marker" ] && tr -d ' \n' < "$marker" || echo 00000000T000000 )
ls "$dir"/*.md 2>/dev/null | grep -v '/README.md$' | while read -r f; do
  base=$(basename "$f" .md)
  ts=${base##*.}
  case "$ts" in [0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]T[0-9][0-9][0-9][0-9][0-9][0-9]) ;; *) continue ;; esac
  [ "$ts" \> "$last" ] && printf '%s\t%s\n' "$ts" "$f"
done | sort | cut -f2
