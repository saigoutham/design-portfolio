"""Owner's stills -> texture maps for the coded 3D melon (council verdict B-hybrid).
rind: whole.png cropped to the fruit bbox, background replaced by nearest fruit colour (no white fringe at silhouettes).
cap:  cut-face.png cropped to the oval face, same edge extension; stretched to a square for the round cap."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

def matte(a):
    mx, mn = a.max(2), a.min(2); sat = (mx - mn) / np.maximum(mx, 1) * 255; lum = a.mean(2)
    bg = ((sat < 16) & (lum > 175)) | ((sat < 10) & (lum > 120))
    lab, _ = ndi.label(bg)
    border = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    fruit = ~np.isin(lab, list(border))
    fruit = ndi.binary_opening(fruit, iterations=6); fruit = ndi.binary_fill_holes(fruit)
    lab, n = ndi.label(fruit); sizes = ndi.sum(fruit, lab, range(1, n + 1))
    return lab == (np.argmax(sizes) + 1)

def extend(a, m):
    _, (iy, ix) = ndi.distance_transform_edt(~m, return_indices=True)
    return a[iy, ix]

def build(src, out, size, shrink=0.0, keep_h=1.0):
    a = np.asarray(Image.open(src).convert("RGB")).astype(float)
    a[1530:, :] = a[1529:1530, :]                  # drop the Gemini sparkle row band
    m = matte(a)
    mx, mn = a.max(2), a.min(2); sat = (mx - mn) / np.maximum(mx, 1) * 255
    m &= sat > 24                                  # floor shadow is grey, fruit is not
    m = ndi.binary_opening(m, iterations=4); m = ndi.binary_fill_holes(m)
    lab, n = ndi.label(m); m = lab == (np.argmax(ndi.sum(m, lab, range(1, n + 1))) + 1)
    m = ndi.binary_erosion(m, iterations=6)         # stay inside the silhouette
    ys, xs = np.where(m); x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()
    dx, dy = int((x1 - x0) * shrink), int((y1 - y0) * shrink)
    e = extend(a, m)[y0 + dy:y1 - dy, x0 + dx:x1 - dx]
    e = e[: int(e.shape[0] * keep_h)]               # cut the grey floor band the mask kept under the fruit
    Image.fromarray(e.clip(0, 255).astype("uint8")).resize(size, Image.LANCZOS).save(out, quality=90)
    print(out, (x1 - x0, y1 - y0))

build("assets-src/photos/whole.png", "animatic/assets/tex/rind.jpg", (2048, 1024), 0.0, 0.965)
build("assets-src/photos/cut-face.png", "animatic/assets/tex/cap.jpg", (1024, 1024), 0.0, 0.868)
