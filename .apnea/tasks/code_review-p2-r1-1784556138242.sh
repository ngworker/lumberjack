#!/usr/bin/env bash
set -euo pipefail
cd /Users/nachovazquez/work/1-projects/ngworkers/lumberjack
exec claude -p --model claude-fable-5 --allowedTools Read,Write,Edit,Glob,Grep 'You are the reviewer.
Read brief: /Users/nachovazquez/work/1-projects/naxodev/pi-apnea/briefs/reviewer.md
Read task: .apnea/tasks/code_review-p2-r1-1784556138242.md
Write artifact exactly at: .apnea/artifacts/phase-02/round-1/code-review.md
Follow the brief. Do not invent paths. Do not commit. Do not edit .apnea/state.json.'
