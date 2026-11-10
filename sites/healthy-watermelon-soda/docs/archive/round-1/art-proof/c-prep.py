"""Proof C texture prep: full-bleed flesh crop, seed mask, height map, seed sites.
Run from the site folder: python3 docs/art-proof/c-prep.py"""
import json, numpy as np
from PIL import Image
from scipy import ndimage as ndi

src = Image.open('assets-src/photos/cut-face.png').convert('RGB')
# Largest 16:9 rectangle inside the red-flesh ellipse (centre ~1262,838; semi-axes ~640x548).
# Excludes the white background, the rind and the Gemini sparkle (bottom right corner).
cx, cy, W, H = 1262, 842, 1104, 621
box = (cx - W // 2, cy - H // 2, cx + W // 2, cy + H // 2)
crop = src.crop(box).resize((2048, 1152), Image.LANCZOS)
a = np.asarray(crop).astype(np.float32) / 255.0
r, g, b = a[..., 0], a[..., 1], a[..., 2]
# fill any pale pith that slipped into the corners with blurred flesh
mx, mn = a.max(-1), a.min(-1); sat = (mx - mn) / (mx + 1e-4)
pale = np.zeros(a.shape[:2], bool)  # checked: crop is all flesh; pale fibres are real, keep them
if pale.any():
    fill = ndi.gaussian_filter(a * (~pale)[..., None], (40, 40, 0)) / (ndi.gaussian_filter((~pale).astype(np.float32), 40)[..., None] + 1e-4)
    a = np.where(pale[..., None], fill, a)
Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8)).save('docs/art-proof/c-tex/flesh.png')

lum = 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]
mx, mn = a.max(-1), a.min(-1); sat = (mx - mn) / (mx + 1e-4)
seed = (r < 0.30) & (lum < 0.22)
seed = ndi.binary_closing(seed, iterations=3)
seed = ndi.binary_fill_holes(seed)
seed = ndi.binary_opening(seed, iterations=2)
lab, n = ndi.label(seed)
sizes = ndi.sum(seed, lab, range(1, n + 1))
keep = np.zeros(n + 1, bool); keep[1:] = sizes > 120
seed = keep[lab]
lab, n = ndi.label(seed)
cents = ndi.center_of_mass(seed, lab, range(1, n + 1))
szs = ndi.sum(seed, lab, range(1, n + 1))
sites = [{'u': float(c[1] / 2048), 'v': float(1 - c[0] / 1152), 'r': float(np.sqrt(s / np.pi) / 1152)} for c, s in zip(cents, szs)]
soft = ndi.gaussian_filter(seed.astype(np.float32), 2.0)
Image.fromarray((np.clip(soft, 0, 1) * 255).astype(np.uint8)).save('docs/art-proof/c-tex/seed-mask.png')

# height: fine luminance detail (pulp cells, juice beads) + seeds sit slightly proud
hp = lum - ndi.gaussian_filter(lum, 18)
h = 0.5 + 1.6 * ndi.gaussian_filter(hp, 2.2) + 0.10 * ndi.gaussian_filter(seed.astype(np.float32), 5)
Image.fromarray((np.clip(h, 0, 1) * 255).astype(np.uint8)).save('docs/art-proof/c-tex/height.png')
json.dump({'crop': box, 'size': [2048, 1152], 'seeds': sites}, open('docs/art-proof/c-tex/seeds.json', 'w'))
print('seeds', len(sites), 'pale px', int(pale.sum()))
