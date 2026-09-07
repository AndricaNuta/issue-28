#!/usr/bin/env python3
"""Prepare a photo for public/photos/.

    python3 scripts/photos.py <source> <name>          # a photograph
    python3 scripts/photos.py <source> <name> --cutout # knock out a plain background

Trims any flat padding, downscales for the web, and writes an optimised file.
`--cutout` floods in from the edges rather than deleting every near-white pixel,
so a bag's own zipper and highlights survive.
"""
import os
import sys
from PIL import Image, ImageDraw, ImageFilter

OUT = 'public/photos'
MAGIC = (255, 0, 255)


def trim_padding(im):
    bg = im.getpixel((2, 2))
    w, h = im.size

    def differs(p):
        return sum(abs(a - b) for a, b in zip(p[:3], bg[:3])) > 26

    left, right, top, bottom = 0, w - 1, 0, h - 1
    while left < w - 1 and not any(differs(im.getpixel((left, y))) for y in range(0, h, 7)):
        left += 1
    while right > 0 and not any(differs(im.getpixel((right, y))) for y in range(0, h, 7)):
        right -= 1
    while top < h - 1 and not any(differs(im.getpixel((x, top))) for x in range(0, w, 7)):
        top += 1
    while bottom > 0 and not any(differs(im.getpixel((x, bottom))) for x in range(0, w, 7)):
        bottom -= 1
    if right - left < w * 0.3 or bottom - top < h * 0.3:
        return im  # the trim ran away; keep the original
    return im.crop((left, top, right + 1, bottom + 1))


def cutout(src, dst, thresh=30):
    im = Image.open(src).convert('RGB')
    w, h = im.size
    seeds = [(1, 1), (w - 2, 1), (1, h - 2), (w - 2, h - 2),
             (w // 2, 1), (w // 2, h - 2), (1, h // 2), (w - 2, h // 2)]
    for s in seeds:
        if im.getpixel(s) != MAGIC:
            ImageDraw.floodfill(im, s, MAGIC, thresh=thresh)

    px = im.load()
    alpha = Image.new('L', (w, h), 255)
    ap = alpha.load()
    for y in range(h):
        for x in range(w):
            if px[x, y] == MAGIC:
                ap[x, y] = 0
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.8))

    out = Image.open(src).convert('RGBA')
    out.putalpha(alpha)
    out = out.crop(out.getbbox())
    out.thumbnail((900, 900), Image.LANCZOS)
    out.save(dst, optimize=True)
    return out


def photo(src, dst):
    im = Image.open(src).convert('RGB')
    im = trim_padding(im)
    im.thumbnail((1200, 1600), Image.LANCZOS)
    im.save(dst, quality=88, optimize=True, progressive=True)
    return im


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        return 1
    src, name = sys.argv[1], sys.argv[2]
    is_cutout = '--cutout' in sys.argv
    os.makedirs(OUT, exist_ok=True)
    dst = os.path.join(OUT, name)
    im = cutout(src, dst) if is_cutout else photo(src, dst)
    print(f'{dst}  {im.size}  {os.path.getsize(dst) // 1024} KB')
    return 0


if __name__ == '__main__':
    sys.exit(main())
