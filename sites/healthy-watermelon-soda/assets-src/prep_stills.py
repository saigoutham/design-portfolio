"""Turn the generated white-background stills into transparent web layers.
Fruit alpha: flood-fill the near-white, low-saturation background from the borders.
Shadow: the grey left in that background becomes a soft ink-coloured alpha layer, so it sits on any ground.
Sparkle watermark (bottom right) is zeroed first."""
import sys, numpy as np
from PIL import Image
from scipy import ndimage as ndi

SRC = "assets-src/photos/"; OUT = "public/img/"
W = 2000

def load(f):
    return np.asarray(Image.open(SRC + f).convert("RGB")).astype(np.float32)

def level(a):
    # estimate the uneven backdrop with a smooth plane fitted to bright, unsaturated pixels, then divide it out
    h, w, _ = a.shape
    lum = a.mean(2); sat = a.max(2) - a.min(2)
    m = (lum > 232) & (sat < 8)
    yy, xx = np.mgrid[0:h, 0:w]
    X = np.stack([np.ones(m.sum()), xx[m] / w, yy[m] / h, (xx[m] / w) ** 2, (yy[m] / h) ** 2, xx[m] * yy[m] / (w * h)], 1)
    c, *_ = np.linalg.lstsq(X, lum[m], rcond=None)
    Xf = np.stack([np.ones(h * w), xx.ravel() / w, yy.ravel() / h, (xx.ravel() / w) ** 2, (yy.ravel() / h) ** 2, (xx * yy).ravel() / (w * h)], 1)
    bg = (Xf @ c).reshape(h, w)
    return a / np.clip(bg[..., None], 1, None) * 255.0, lum / bg

def process(name, out, split=None, keep_shadow=True):
    a = load(name)[:1530, :]  # crop away the sparkle watermark (bottom right, below y=1540)
    a, ratio = level(a)
    a = np.clip(a, 0, 255)
    lum = a.mean(2); sat = a.max(2) - a.min(2)
    bgish = ((sat < 20) & (lum > 150) & (lum < 236)) | ((lum > 222) & (sat < 16)) | ((sat < 9) & (lum > 150))
    lab, n = ndi.label(bgish)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    bg = np.isin(lab, list(border))
    fruit = ~bg
    fruit = ndi.binary_opening(fruit, iterations=9)
    fruit = ndi.binary_fill_holes(fruit)
    rows = np.where(fruit.any(1))[0]; yb = rows.max()
    band = np.zeros_like(fruit); band[yb - 130:, :] = True
    fruit = fruit & ~(band & (sat < 24))  # grey contact-shadow remnants under the fruit
    fruit = ndi.binary_opening(fruit, iterations=6)
    fruit = ndi.binary_fill_holes(fruit)
    if split:  # pink floor bounce between the halves reads as a pale blob
        R, G, B = a[..., 0], a[..., 1], a[..., 2]
        pink = (R - G > 6) & (B >= G - 4) & (lum > 195) & (sat < 60)
        pink[: yb - 200, :] = False
        fruit = ndi.binary_opening(fruit & ~pink, iterations=4)
        fruit[1452:, 1000:1290] = False  # floor bounce under the gap, below both rind tips (source px)
        fruit[1405:, 1105:1290] = False
    lab3, n3 = ndi.label(fruit)
    if n3 > 1:
        sz = ndi.sum(fruit, lab3, range(1, n3 + 1)); fruit = np.isin(lab3, np.argsort(sz)[::-1][: (2 if split else 1)] + 1)
    lab2, n2 = ndi.label(fruit)
    if n2:
        sizes = ndi.sum(fruit, lab2, range(1, n2 + 1)); keep = np.argsort(sizes)[::-1][: (2 if split else 1)] + 1
        fruit = np.isin(lab2, keep)
    alpha = ndi.gaussian_filter(fruit.astype(np.float32), 1.1)
    alpha = np.clip((alpha - 0.15) / 0.7, 0, 1)
    shade = np.clip((1 - lum / 255.0) * 2.2, 0, 0.55) * (~fruit)
    shade = ndi.gaussian_filter(shade, 2.0)
    hh, ww = shade.shape
    ramp = np.minimum(np.minimum(np.arange(ww)[None, :], ww - 1 - np.arange(ww)[None, :]) / 140.0, np.minimum(np.arange(hh)[:, None], hh - 1 - np.arange(hh)[:, None]) / 140.0)
    shade = shade * np.clip(ramp, 0, 1)
    ink = np.array([42, 14, 18], np.float32)
    rgb = np.where(alpha[..., None] > 0, a, ink)
    A = alpha  # fruit only; the contact shadow is drawn in the page
    rgba = np.dstack([np.where((alpha > 0.02)[..., None], a, ink), A * 255]).astype(np.uint8)
    img = Image.fromarray(rgba, "RGBA")
    if split:
        h, w = rgba.shape[:2]
        cx = split
        for nm, box in (("L", (0, 0, cx, h)), ("R", (cx, 0, w, h))):
            part = img.crop(box); part.thumbnail((W // 2 + 200, 4000)); part.save(OUT + out + nm + ".webp", quality=90, method=6)
    else:
        img.thumbnail((W, 4000)); img.save(OUT + out + ".webp", quality=90, method=6)
    return fruit

if __name__ == "__main__":
    process("whole.png", "whole")
    process("halves-parted.png", "halves-", split=1264)
    process("cut-face.png", "cut-face")
    print("ok")
