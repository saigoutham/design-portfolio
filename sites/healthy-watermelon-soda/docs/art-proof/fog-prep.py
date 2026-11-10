"""Prepare the photo layer for fog-proof.html.

Crops the owner's cut-face still full-bleed to the red flesh (largest 16:9 rectangle that is all flesh,
so no white background, no rind, no Gemini sparkle), resizes to 1920x1080 and writes:
  fog-tex/photo.jpg   colour (sRGB), lightly sharpened
  fog-tex/normal.png  tangent-space normal from a luminance height (data, NoColorSpace) for the wet relight
and copies the Bricolage Grotesque 700 woff2 into fog-tex/.
Run from the site folder: python3 docs/art-proof/fog-prep.py
"""
import os, shutil
import numpy as np
from PIL import Image, ImageFilter

here = os.path.dirname(os.path.abspath(__file__))
site = os.path.dirname(os.path.dirname(here))
out = os.path.join(here, "fog-tex"); os.makedirs(out, exist_ok=True)

im = Image.open(os.path.join(site, "assets-src/photos/cut-face.png")).convert("RGB")
a = np.asarray(im).astype(np.float32)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
flesh = ((r > 95) & (r > g * 1.25) & (r > b * 1.2)) | (np.maximum(np.maximum(r, g), b) < 95)  # flesh or seed
# seeds are dark: close them into the flesh with a blur-threshold
m = Image.fromarray((flesh * 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(24))
flesh = np.asarray(m) > 120
H, W = flesh.shape
ii = flesh.astype(np.int64).cumsum(0).cumsum(1)
def full(x0, y0, w, h):
    x1, y1 = x0 + w - 1, y0 + h - 1
    s = ii[y1, x1] - (ii[y0 - 1, x1] if y0 else 0) - (ii[y1, x0 - 1] if x0 else 0) + (ii[y0 - 1, x0 - 1] if x0 and y0 else 0)
    return s == w * h
best = None
for w in range(1900, 600, -16):
    h = int(w * 9 / 16)
    for y0 in range(0, H - h, 12):
        for x0 in range(0, W - w, 12):
            if full(x0, y0, w, h):
                best = (x0, y0, w, h); break
        if best: break
    if best: break
x0, y0, w, h = best
pad = int(w * 0.02)  # stay a little inside the flesh edge
box = (x0 + pad, y0 + pad, x0 + w - pad, y0 + pad + int((w - 2 * pad) * 9 / 16))
print("crop", box)
crop = im.crop(box).resize((1920, 1080), Image.LANCZOS)
crop = crop.filter(ImageFilter.UnsharpMask(radius=2.2, percent=90, threshold=2))
crop.save(os.path.join(out, "photo.jpg"), quality=93)

# height from luminance (seeds sit low, pulp grain high), smoothed; normal via Sobel
lum = np.asarray(crop.convert("L").filter(ImageFilter.GaussianBlur(1.6))).astype(np.float32) / 255
gx = np.zeros_like(lum); gy = np.zeros_like(lum)
gx[:, 1:-1] = lum[:, 2:] - lum[:, :-2]; gy[1:-1, :] = lum[2:, :] - lum[:-2, :]
k = 6.0
n = np.stack([-gx * k, gy * k, np.ones_like(lum)], -1)  # +y up in texture space (image rows go down)
n /= np.linalg.norm(n, axis=-1, keepdims=True)
Image.fromarray(((n * 0.5 + 0.5) * 255).astype(np.uint8)).save(os.path.join(out, "normal.png"))

shutil.copy(os.path.join(site, "docs/archive/round-1/art-proof/c-tex/bricolage-grotesque-latin-700-normal.woff2"), out)
print("wrote", os.listdir(out))
