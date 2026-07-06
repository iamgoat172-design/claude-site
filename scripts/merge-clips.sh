#!/usr/bin/env bash
# Склейка 7 клипов-морфов стройки в ОДИН непрерывный ролик.
# Запускать на машине с доступом к CDN Higgsfield (в контейнере агента
# egress его блокирует) и установленным ffmpeg.
#
#   bash scripts/merge-clips.sh
#
# Результат: public/assets/clips/construction.mp4 — единый файл.
# Клипы встык дают бесшовный ролик: конец клипа i == начало клипа i+1.
set -euo pipefail

CDN="https://d8j0ntlcm91z4.cloudfront.net/user_32Q9KWTtKxuO9vGsur6JRmOi1Zg"
OUT_DIR="public/assets/clips"
TMP="$(mktemp -d)"
mkdir -p "$OUT_DIR"

# порядок и имена файлов = clip-1..7 из src/data/assets.js
CLIPS=(
  "hf_20260706_023245_b133fe02-fa47-4223-89a2-38098af32482.mp4"
  "hf_20260706_014009_bb8cda63-957d-4003-9e2b-b2914f81593d.mp4"
  "hf_20260706_014024_14db626b-ddbc-4c2c-bb54-5f44051e2d4b.mp4"
  "hf_20260706_014031_81251c2e-b2e0-4847-810b-aedb67907595.mp4"
  "hf_20260706_124126_b3a2dd77-992b-4d18-ac15-10fd8e3ffd7e.mp4"
  "hf_20260706_124130_bad5a344-de33-49bf-b4ad-91f653c6659e.mp4"
  "hf_20260706_030624_d52ec698-6561-4c7e-a9de-5e3784a3e9b6.mp4"
)

LIST="$TMP/list.txt"
: > "$LIST"
for i in "${!CLIPS[@]}"; do
  f="$TMP/seg-$i.mp4"
  echo "→ качаю clip-$((i+1))"
  curl -fsSL "$CDN/${CLIPS[$i]}" -o "$f"
  # перекодируем в единый формат/таймбазу, чтобы concat был бесшовным
  ffmpeg -y -loglevel error -i "$f" -an -c:v libx264 -preset slow -crf 18 \
    -pix_fmt yuv420p -r 30 -vf "scale=1920:1080:flags=lanczos" "$TMP/n-$i.mp4"
  echo "file '$TMP/n-$i.mp4'" >> "$LIST"
done

echo "→ склеиваю"
ffmpeg -y -loglevel error -f concat -safe 0 -i "$LIST" -c copy "$OUT_DIR/construction.mp4"
echo "✓ $OUT_DIR/construction.mp4"
echo "Теперь в src/data/assets.js задайте:  'clip-merged': '/assets/clips/construction.mp4'"
rm -rf "$TMP"
