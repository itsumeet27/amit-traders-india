#!/usr/bin/env python3
"""Crop the leather-mark icon from the full Amit Traders logo PNG.

Usage (after placing your logo at frontend/public/brand/logo.png):
  python3 scripts/prepare-brand-assets.py

Outputs:
  frontend/public/brand/logo-icon.png  (top icon only, for favicon)
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
BRAND = ROOT / "frontend" / "public" / "brand"
LOGO = BRAND / "logo.png"
ICON = BRAND / "logo-icon.png"


def main() -> None:
    if not LOGO.exists():
        raise SystemExit(f"Missing source logo: {LOGO}\nAdd your PNG logo there first.")

    img = Image.open(LOGO).convert("RGBA")
    w, h = img.size

    # Icon is the top portion of the stacked logo (hide mark above wordmark).
    icon_h = int(h * 0.58)
    icon = img.crop((0, 0, w, icon_h))

    # Trim near-white padding so the favicon fills the tab nicely.
    bg = img.getpixel((w // 2, 4))
    if isinstance(bg, tuple) and len(bg) >= 3:
        threshold = 245
        bbox = None
        pixels = icon.load()
        iw, ih = icon.size
        for y in range(ih):
            for x in range(iw):
                r, g, b, *rest = pixels[x, y]
                a = rest[0] if rest else 255
                if a < 16:
                    continue
                if r < threshold or g < threshold or b < threshold:
                    if bbox is None:
                        bbox = [x, y, x, y]
                    else:
                        bbox[0] = min(bbox[0], x)
                        bbox[1] = min(bbox[1], y)
                        bbox[2] = max(bbox[2], x)
                        bbox[3] = max(bbox[3], y)
        if bbox:
            pad = max(4, int(min(iw, ih) * 0.03))
            left = max(0, bbox[0] - pad)
            top = max(0, bbox[1] - pad)
            right = min(iw, bbox[2] + pad + 1)
            bottom = min(ih, bbox[3] + pad + 1)
            icon = icon.crop((left, top, right, bottom))

    BRAND.mkdir(parents=True, exist_ok=True)
    icon.save(ICON, format="PNG", optimize=True)
    print(f"Wrote {ICON} ({icon.size[0]}x{icon.size[1]})")


if __name__ == "__main__":
    main()
