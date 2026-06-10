#!/usr/bin/env bash
# Generate loopable MP3 ambience + one-shots for the harbour sound engine.
# Requires ffmpeg. Run: bash scripts/generate-audio.sh

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/audio"
mkdir -p "$OUT"

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ERROR: ffmpeg is required. Install with: sudo apt install ffmpeg"
  exit 1
fi

echo "Generating ambience loops…"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "anoisesrc=d=50:c=pink:r=44100:a=0.14,lowpass=f=480" \
  -t 50 -c:a libmp3lame -q:a 4 "$OUT/ocean-gulls.mp3"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "anoisesrc=d=45:c=white:r=44100:a=0.1,highpass=f=350,lowpass=f=2800" \
  -t 45 -c:a libmp3lame -q:a 4 "$OUT/rain-wind.mp3"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=f=196:duration=35,sine=f=247:duration=35,sine=f=294:duration=35,amix=inputs=3:duration=first:dropout_transition=0,volume=0.08" \
  -t 35 -c:a libmp3lame -q:a 4 "$OUT/accordion-fiddle.mp3"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "anoisesrc=d=40:c=brown:r=44100:a=0.09,lowpass=f=320" \
  -t 40 -c:a libmp3lame -q:a 4 "$OUT/logbook-ambience.mp3"

echo "Generating one-shots…"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=f=72:duration=3,sine=f=108:duration=3,amix=inputs=2,volume=0.25,afade=t=out:st=2.2:d=0.8" \
  -t 3 -c:a libmp3lame -q:a 4 "$OUT/foghorn.mp3"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=f=520:duration=0.08,sine=f=780:duration=1.2,amix=inputs=2,volume=0.2,afade=t=out:st=0.5:d=0.7" \
  -t 1.2 -c:a libmp3lame -q:a 4 "$OUT/ship-bell.mp3"

ffmpeg -y -hide_banner -loglevel error \
  -f lavfi -i "sine=f=180:duration=0.05,sine=f=90:duration=0.2,amix=inputs=2,volume=0.18,afade=t=out:st=0.05:d=0.15" \
  -t 0.2 -c:a libmp3lame -q:a 4 "$OUT/wax-seal.mp3"

echo "Done — $(ls -1 "$OUT"/*.mp3 | wc -l) MP3 files in public/audio/"
