#!/usr/bin/env bash
# Renders one part locally and writes the delivery files (alpha WebM, quick-look, stems, VERIFY).
# Usage: bash scripts/deliver.sh part2 "/c/Users/.../drones/2/entrega"
set -euo pipefail
PART="$1"
DEST="${2:-}"
eval "$(bash scripts/part-env.sh "$PART" | sed 's/^/export /')"
mkdir -p out dist

echo "== rendering $COMP ($FRAMES frames)"
npx remotion render src/index.ts "$COMP" "out/${NAME}_picture.webm" \
  --codec=vp9 --pixel-format=yuva420p --crf=28 --image-format=png --muted --concurrency="$(nproc)"

echo "== muxing the mix"
ffmpeg -y -v error -i "out/${NAME}_picture.webm" -i "public/audio/${PREFIX}mix.wav" \
  -map 0:v -map 1:a -c:v copy -c:a libopus -b:a 192k -shortest "dist/${NAME}_alpha.webm"

echo "== verifying the alpha channel"
{
  ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate:stream_tags=alpha_mode -of compact "dist/${NAME}_alpha.webm"
  ffmpeg -hide_banner -c:v libvpx-vp9 -ss 30 -i "dist/${NAME}_alpha.webm" -frames:v 1 \
    -vf "format=rgba,alphaextract,signalstats,metadata=print:key=lavfi.signalstats.YMIN,metadata=print:key=lavfi.signalstats.YMAX" \
    -f null - 2>&1 | grep -E "YMIN|YMAX"
} | tee dist/VERIFY.txt
grep -q "YMIN=0" dist/VERIFY.txt || { echo "alpha plane missing"; exit 1; }

echo "== quick-look on grey"
ffmpeg -y -v error -c:v libvpx-vp9 -i "dist/${NAME}_alpha.webm" \
  -filter_complex "color=c=0x3b4447:s=1920x1080:r=30[bg];[bg][0:v]overlay=shortest=1,scale=1280:720,format=yuv420p[v]" \
  -map "[v]" -map 0:a -c:v libx264 -crf 24 -preset veryfast -c:a aac -b:a 192k -movflags +faststart \
  "dist/${NAME}_quicklook.mp4"

echo "== audio stems"
node -e '
const {execFileSync}=require("child_process");
const [name,prefix]=[process.env.NAME,process.env.PREFIX||""];
const files=["mix","voice","music","sfx"].map((s)=>`public/audio/${prefix}${s}.wav`);
execFileSync("powershell",["-NoProfile","-Command",`Compress-Archive -Force -Path ${files.map((f)=>`"${f}"`).join(",")} -DestinationPath "dist/${name}_audio_stems.zip"`],{stdio:"inherit"});
'

if [ -n "$DEST" ]; then
  mkdir -p "$DEST"
  cp "dist/${NAME}_alpha.webm" "dist/${NAME}_quicklook.mp4" "dist/${NAME}_audio_stems.zip" dist/VERIFY.txt "$DEST/"
  cp "public/audio/${PREFIX}mix.wav" "$DEST/${NAME}_mix.wav"
  ls -la "$DEST"
fi
echo "== done $NAME"
