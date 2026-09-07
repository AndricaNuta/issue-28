#!/usr/bin/env python3
"""Prepare the product shots for the bag's gallery.

    python3 scripts/bagshots.py ~/Downloads/bag

Takes the images in the folder in filename order and writes
public/photos/bag/01.jpg upward, shrunk for the web. Then list them in
CONFIG.photos.bagShots in src/config.js, first one shown when the page opens.
Product shots on a white background can be cut out instead with:

    python3 scripts/photos.py <file> bag.png --cutout
"""
import os
import sys
from PIL import Image, ImageOps

OUT = 'public/photos/bag'
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.avif'}


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    src = os.path.expanduser(sys.argv[1])
    if not os.path.isdir(src):
        print(f'not a folder: {src}')
        return 1
    files = sorted(f for f in os.listdir(src) if os.path.splitext(f)[1].lower() in EXTS)
    if not files:
        print(f'no images in {src}')
        return 1
    os.makedirs(OUT, exist_ok=True)
    for i, f in enumerate(files, start=1):
        im = ImageOps.exif_transpose(Image.open(os.path.join(src, f))).convert('RGB')
        im.thumbnail((900, 900), Image.LANCZOS)
        dst = os.path.join(OUT, f'{i:02d}.jpg')
        im.save(dst, quality=85, optimize=True, progressive=True)
        print(f"{f}  ->  {dst}  {im.size}  {os.path.getsize(dst) // 1024} KB")
    print(f"\n{len(files)} shots. Now list them in CONFIG.photos.bagShots:")
    print('  bagShots: [' + ', '.join(f"'photos/bag/{i:02d}.jpg'" for i in range(1, len(files) + 1)) + '],')
    return 0


if __name__ == '__main__':
    sys.exit(main())
