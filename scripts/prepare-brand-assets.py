#!/usr/bin/env python3
"""Prepare Amit Traders brand assets from the source logo PNG.

Usage:
  python3 scripts/prepare-brand-assets.py

Reads:  frontend/public/brand/logo.png (full logo from user)
Writes: frontend/public/brand/logo.png      (trimmed + optimized for header)
        frontend/public/brand/logo-icon.png (hide mark only, for favicon)
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "frontend" / "public" / "brand"
LOGO = BRAND / "logo.png"
ICON = BRAND / "logo-icon.png"
BG_THRESHOLD = 242
MAX_LOGO_WIDTH = 520
ICON_SIZE = 256


def content_bbox(img: Image.Image, *, top_limit: int | None = None) -> tuple[int, int, int, int] | None:
    pixels = img.load()
    w, h = img.size
    limit = top_limit if top_limit is not None else h
    bbox = None
    for y in range(min(limit, h)):
        for x in range(w):
            r, g, b, *rest = pixels[x, y]
            a = rest[0] if rest else 255
            if a < 16:
                continue
            if r < BG_THRESHOLD or g < BG_THRESHOLD or b < BG_THRESHOLD:
                if bbox is None:
                    bbox = [x, y, x, y]
                else:
                    bbox[0] = min(bbox[0], x)
                    bbox[1] = min(bbox[1], y)
                    bbox[2] = max(bbox[2], x)
                    bbox[3] = max(bbox[3], y)
    if not bbox:
        return None
    pad = max(6, int(min(w, h) * 0.02))
    return (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad + 1),
        min(h, bbox[3] + pad + 1),
    )


def resize_width(img: Image.Image, max_width: int) -> Image.Image:
    if img.width <= max_width:
        return img
    ratio = max_width / img.width
    return img.resize((max_width, int(img.height * ratio)), Image.Resampling.LANCZOS)


def square_icon(img: Image.Image, size: int) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), (250, 247, 242, 255))
    scale = min(size / img.width, size / img.height) * 0.88
    nw, nh = int(img.width * scale), int(img.height * scale)
    resized = img.resize((nw, nh), Image.Resampling.LANCZOS)
    x = (size - nw) // 2
    y = (size - nh) // 2
    canvas.paste(resized, (x, y), resized if resized.mode == "RGBA" else None)
    return canvas


def main() -> None:
    if not LOGO.exists():
        raise SystemExit(f"Missing source logo: {LOGO}")

    source = Image.open(LOGO).convert("RGBA")
    w, h = source.size

    # Full header logo: trim cream padding, keep icon + wordmark.
    full_box = content_bbox(source)
    full = source.crop(full_box) if full_box else source
    full = resize_width(full, MAX_LOGO_WIDTH)
    full.save(LOGO, format="PNG", optimize=True, compress_level=9)
    print(f"Optimized {LOGO} ({full.size[0]}x{full.size[1]}, {LOGO.stat().st_size // 1024} KB)")

    # Favicon: top ~48% of original (hide mark only, above text).
    icon_region = source.crop((0, 0, w, int(h * 0.48)))
    icon_box = content_bbox(icon_region, top_limit=icon_region.height)
    icon = icon_region.crop(icon_box) if icon_box else icon_region
    icon = square_icon(icon, ICON_SIZE)
    icon.save(ICON, format="PNG", optimize=True, compress_level=9)

    # Optional WebP copies for faster loading (not required by UI).
    full.save(BRAND / "logo.webp", format="WEBP", quality=88, method=6)
    icon.save(BRAND / "logo-icon.webp", format="WEBP", quality=88, method=6)

    print(f"Wrote {ICON} ({icon.size[0]}x{icon.size[1]}, {ICON.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
