#!/usr/bin/env python3
"""Turn a folder of photographs into the sixteen polaroids.

    python3 scripts/people.py ~/Downloads/people

Takes the images in the folder in filename order, centre-crops each to a
square, shrinks it, and writes public/photos/people/01.jpg upward. Whatever
order the files sort in is the order the polaroids appear in, so name them
01-anna.jpg, 02-maria.jpg and so on if you care about it.
"""
import os
import sys
from PIL import Image, ImageOps

OUT = 'public/photos/people'
EXTS = {'.jpg', '.jpeg', '.png', '.webp', '.heic', '.HEIC'}


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
        im = Image.open(os.path.join(src, f))
        im = ImageOps.exif_transpose(im).convert('RGB')
        # Square from the centre, biased slightly up: faces sit high in a photo.
        w, h = im.size
        side = min(w, h)
        left = (w - side) // 2
        top = int((h - side) * 0.35)
        im = im.crop((left, top, left + side, top + side))
        im.thumbnail((520, 520), Image.LANCZOS)
        dst = os.path.join(OUT, f'{i:02d}.jpg')
        im.save(dst, quality=86, optimize=True)
        print(f'{f}  ->  {dst}  {im.size}  {os.path.getsize(dst) // 1024} KB')

    print(f'\n{len(files)} polaroids. Names and wishes go in src/config.js.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
