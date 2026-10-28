"""Generate mobile playback copies, preserving the original videos.

Run with Python and an FFmpeg executable: python scripts/optimize-reels.py PATH_TO_FFMPEG
"""
import pathlib
import subprocess
import sys

root = pathlib.Path(__file__).resolve().parents[1]
output = root / 'assets/videos/mobile'
output.mkdir(exist_ok=True)
for source in sorted((root / 'assets/videos').glob('*.mp4')):
    destination = output / source.name
    if destination.exists() and destination.stat().st_mtime >= source.stat().st_mtime:
        continue
    subprocess.run([
        sys.argv[1], '-hide_banner', '-loglevel', 'error', '-y',
        '-i', str(source), '-map', '0:v:0', '-map', '0:a:0?',
        '-vf', 'scale=720:-2', '-fpsmax', '30',
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
        '-profile:v', 'main', '-level:v', '3.1', '-pix_fmt', 'yuv420p',
        '-threads', '2', '-maxrate', '2500k', '-bufsize', '5000k',
        '-c:a', 'aac', '-b:a', '96k', '-movflags', '+faststart',
        str(destination),
    ], check=True)
    print(f'{source.name}: {source.stat().st_size:,} -> {destination.stat().st_size:,} bytes', flush=True)
