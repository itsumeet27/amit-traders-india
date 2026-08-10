#!/usr/bin/env python3
"""Download catalog images into frontend/public/catalog for GitHub Pages hosting."""

from __future__ import annotations

import json
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "scripts" / "catalog-image-sources.json"
OUT_CATEGORIES = ROOT / "frontend" / "public" / "catalog" / "categories"
OUT_PRODUCTS = ROOT / "frontend" / "public" / "catalog" / "products"


def download(url: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "amit-traders-catalog-sync/1.0"})
    with urllib.request.urlopen(req, timeout=60) as response:
        data = response.read()
    dest.write_bytes(data)
    print(f"  saved {dest.relative_to(ROOT)} ({len(data)} bytes)")


def main() -> int:
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))

    print("Downloading category images...")
    for slug, url in manifest["categories"].items():
        download(url, OUT_CATEGORIES / f"{slug}.jpg")

    print("Downloading product images...")
    for slug, url in manifest["products"].items():
        download(url, OUT_PRODUCTS / f"{slug}.jpg")

    print("Done.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
