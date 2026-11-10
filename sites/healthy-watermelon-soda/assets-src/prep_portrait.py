"""Matte the 2:3 portrait stills and compose them on one shared canvas (CW x CH) so whole and halves share scale.
Outputs public/img/p-whole-*.webp, p-halves-L/R-*.webp. Shadow is drawn in the page, not baked."""
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

CW, CH, FH, BOT = 1000, 1300, 900, 1180   # canvas, fruit height, fruit bottom line

def matte(path):
    im = Image.open(path).convert("RGB")
    a = np.asarray(im).astype(float)
    a[2380:, 1480:] = 250                       # Gemini sparkle
    mx, mn = a.max(2), a.min(2)
    sat = (mx - mn) / np.maximum(mx, 1) * 255
    lum = a.mean(2)
    shadow = (a[..., 0] - a[..., 1] >= -2) & (a[..., 0] - a[..., 1] < 24) & (sat < 28) & (lum > 130)   # pinkish floor shadow
    bg = shadow | ((sat < 15) & (lum > 180)) | ((sat < 10) & (lum > 110))
    lab, n = ndi.label(bg)
    border = set(np.unique(np.r_[lab[0], lab[-1], lab[:, 0], lab[:, -1]])) - {0}
    bgm = np.isin(lab, list(border))
    fruit = ~bgm
    fruit = ndi.binary_opening(fruit, iterations=5)
    # drop grey floor-shadow remnants hugging the underside of each fruit
    ys = np.where(fruit.any(1))[0]; yb = ys.max(); band = np.zeros_like(fruit); band[yb - 160:] = True
    fruit &= ~(band & (sat < 34) & (lum < 215))
    fruit = ndi.binary_opening(fruit, iterations=7)
    yy, xx = np.ogrid[-18:19, -18:19]; disk = (xx * xx + yy * yy) <= 18 * 18
    op = ndi.binary_opening(fruit, structure=disk)
    fruit[yb - 220:] = op[yb - 220:]
    tail = np.zeros_like(fruit); tail[yb - 60:] = True
    fruit &= ~(tail & (((sat < 75) & (lum < 150)) | ((sat < 48) & (lum < 205))))
    fruit = ndi.binary_opening(fruit, iterations=4)
    fruit = ndi.binary_fill_holes(fruit)
    lab, n = ndi.label(fruit)
    sizes = ndi.sum(fruit, lab, range(1, n + 1))
    keep = [i + 1 for i, s in enumerate(sizes) if s > 40000]
    fruit = np.isin(lab, keep)
    alpha = ndi.gaussian_filter(ndi.binary_erosion(fruit, iterations=1).astype(float), 1.2)
    rgba = np.dstack([np.asarray(im), (alpha * 255).astype("uint8")])
    return Image.fromarray(rgba, "RGBA"), fruit

def bbox(m):
    ys, xs = np.where(m); return xs.min(), ys.min(), xs.max() + 1, ys.max() + 1

def place(img, m, scale, cx, canvas, anchor="bottom"):
    x0, y0, x1, y1 = bbox(m)
    crop = img.crop((x0, y0, x1, y1))
    w, h = round(crop.width * scale), round(crop.height * scale)
    crop = crop.resize((w, h), Image.LANCZOS)
    canvas.alpha_composite(crop, (round(cx - w / 2), BOT - h))

whole, wm = matte("assets-src/photos/p-whole.png")
x0, y0, x1, y1 = bbox(wm)
s_whole = FH / (y1 - y0)
canvas = Image.new("RGBA", (CW, CH), (0, 0, 0, 0)); place(whole, wm, s_whole, CW / 2, canvas)
canvas.save("/tmp/p-whole-full.png")
for W in (1000, 600):
    canvas.resize((W, round(CH * W / CW)), Image.LANCZOS).save(f"public/img/p-whole-{W}.webp", quality=88, method=6)

halves, hm = matte("assets-src/photos/p-halves.png")
lab, n = ndi.label(hm); sizes = ndi.sum(hm, lab, range(1, n + 1))
ids = sorted(np.argsort(sizes)[-2:] + 1, key=lambda i: ndi.center_of_mass(lab == i)[1])
parts = [lab == i for i in ids]
top = min(bbox(p)[1] for p in parts); bot = max(bbox(p)[3] for p in parts)
s_h = FH / (bot - top)
gap_c = (bbox(parts[0])[2] + bbox(parts[1])[0]) / 2
out = Image.new("RGBA", (CW, CH), (0, 0, 0, 0))
for p in parts:
    x0, y0, x1, y1 = bbox(p)
    crop = halves.crop((x0, top, x1, bot))
    mk = Image.fromarray((p[top:bot, x0:x1] * 255).astype("uint8"))
    # keep matte alpha only where this part exists
    r = np.asarray(crop).copy(); r[..., 3] = np.minimum(r[..., 3], np.asarray(mk))
    crop = Image.fromarray(r, "RGBA")
    w, h = round(crop.width * s_h), round(crop.height * s_h)
    crop = crop.resize((w, h), Image.LANCZOS)
    px = round(CW / 2 + ((x0 + x1) / 2 - gap_c) * s_h - w / 2)
    out.alpha_composite(crop, (px, BOT - h))
out.save("/tmp/p-halves-full.png")
L = out.crop((0, 0, CW // 2, CH)); R = out.crop((CW // 2, 0, CW, CH))
for nm, im in (("L", L), ("R", R)):
    for W in (500, 300):
        im.resize((W, round(CH * W / CW)), Image.LANCZOS).save(f"public/img/p-halves-{nm}-{W}.webp", quality=88, method=6)
print("ok", s_whole, s_h)
