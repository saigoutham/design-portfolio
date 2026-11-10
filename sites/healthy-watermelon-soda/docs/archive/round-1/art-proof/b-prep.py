"""Route B texture prep: matte white bg, drop floor shadow + watermark, extend edge colours, crop to fruit bbox.
Run from the site folder: python3 docs/art-proof/b-prep.py"""
import json, numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = 'assets-src/photos/'; OUT = 'docs/art-proof/b-tex/'

def matte(name, out, width, erode=5):
    im = np.asarray(Image.open(SRC + name).convert('RGB')).astype(np.float32) / 255
    h, w, _ = im.shape
    mx, mn = im.max(2), im.min(2)
    sat = (mx - mn) / np.maximum(mx, 1e-3)
    # fruit = saturated (rind green, flesh red) or clearly darker than the white sweep but not neutral grey (shadow)
    m = (sat > 0.13) | ((mx < 0.55) & (sat > 0.06))
    m[int(h * 0.88):, int(w * 0.88):] = False            # Gemini sparkle watermark corner
    m = ndi.binary_closing(m, iterations=6)
    m = ndi.binary_fill_holes(m)
    lab, n = ndi.label(m)
    m = lab == (np.argmax(ndi.sum(m, lab, range(1, n + 1))) + 1)  # largest blob = the fruit
    m = ndi.binary_opening(m, iterations=4)
    # the floor shadow fuses to the underside; the fruit is an ellipse, so mirror the clean top half:
    # centre row = widest row, bottom = centre + (centre - top), then clip the mask to that ellipse
    rows = m.sum(1); ys, xs = np.where(m)
    x0, x1, y0 = xs.min(), xs.max() + 1, ys.min()
    cy = int(np.median(np.where(rows >= rows.max() * 0.995)[0])); y1 = 2 * cy - y0
    yy, xx = np.mgrid[0:h, 0:w]
    ell = ((xx - (x0 + x1) / 2) / ((x1 - x0) / 2)) ** 2 + ((yy - cy) / ((y1 - y0) / 2)) ** 2 <= 1
    m = ndi.binary_erosion(m & ell, iterations=erode)     # lose the anti-aliased white fringe
    # extend edge colours outward: every outside pixel takes its nearest inside pixel
    _, (iy, ix) = ndi.distance_transform_edt(~m, return_indices=True)
    ext = im[iy, ix]
    crop = ext[y0:y1, x0:x1]
    hh = round(width * (y1 - y0) / (x1 - x0))
    Image.fromarray((crop * 255).round().astype(np.uint8)).resize((width, hh), Image.LANCZOS).save(OUT + out)
    return dict(src=name, bbox=[int(x0), int(y0), int(x1), int(y1)], aspect=(x1 - x0) / (y1 - y0), size=[width, hh])

meta = {'rind': matte('whole.png', 'rind.png', 2048), 'face': matte('cut-face.png', 'face.png', 1536, erode=3)}
json.dump(meta, open(OUT + 'meta.json', 'w'), indent=1)
print(json.dumps(meta))
