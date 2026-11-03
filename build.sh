#!/usr/bin/env bash
# Собирает funpay-dark-extension.zip из файлов расширения.
# Использование: ./build.sh [путь_к_zip]
# Нужен только zip или python3 — сборщиков и зависимостей нет.
set -euo pipefail

cd "$(dirname "$0")"

NAME="funpay-dark-extension"
OUT="${1:-$NAME.zip}"
FILES=(manifest.json theme.css content.js popup.html popup.css popup.js)

for file in "${FILES[@]}"; do
  if [[ ! -f "$file" ]]; then
    echo "error: не найден файл $file" >&2
    exit 1
  fi
done

# Проверяем, что манифест — валидный JSON.
if command -v python3 >/dev/null 2>&1; then
  python3 -c 'import json,sys; json.load(open("manifest.json", encoding="utf-8"))'
fi

OUT_DIR="$(cd "$(dirname "$OUT")" && pwd)"
OUT_ABS="$OUT_DIR/$(basename "$OUT")"
STAGE="$(mktemp -d)"
trap 'rm -rf "$STAGE"' EXIT

mkdir -p "$STAGE/$NAME"
for file in "${FILES[@]}"; do
  cp "$file" "$STAGE/$NAME/"
done

rm -f "$OUT_ABS"

if command -v zip >/dev/null 2>&1; then
  (cd "$STAGE" && zip -qr -X "$OUT_ABS" "$NAME")
elif command -v python3 >/dev/null 2>&1; then
  python3 - "$STAGE" "$OUT_ABS" "$NAME" <<'PY'
import os
import sys
import zipfile

stage, out_abs, name = sys.argv[1:4]
root = os.path.join(stage, name)
with zipfile.ZipFile(out_abs, "w", zipfile.ZIP_DEFLATED) as archive:
    for current, _dirs, files in os.walk(root):
        for filename in sorted(files):
            path = os.path.join(current, filename)
            arcname = os.path.join(name, os.path.relpath(path, root))
            archive.write(path, arcname)
PY
else
  echo "error: нужен zip или python3" >&2
  exit 1
fi

echo "Готово: $OUT_ABS"
if command -v unzip >/dev/null 2>&1; then
  unzip -l "$OUT_ABS"
fi
