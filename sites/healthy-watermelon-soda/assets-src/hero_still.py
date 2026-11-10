"""Hero art proof for The Cut: two real halves (supplied photo) split by the divider.
Run from the site folder: python3 assets-src/hero_still.py [out.png] [W] [H]"""
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = sys.argv[1] if len(sys.argv) > 1 else "docs/art/hero-proof.png"
W, H = (int(sys.argv[2]), int(sys.argv[3])) if len(sys.argv) > 3 else (1600, 1000)
S = 2  # supersample
w, h = W * S, H * S
FRUIT, FIZZ, INK, MUTED, RIND = "#DDEBC8", "#FFF0F2", "#2A0E12", "#5B4A4D", "#1E5631"
F = "assets-src/fonts/"
disp = lambda px: ImageFont.truetype(F + "BricolageGrotesque-800.ttf", px * S)
body = lambda px, wt=400: ImageFont.truetype(F + f"InstrumentSans-{wt}.ttf", px * S)

img = Image.new("RGB", (w, h), FRUIT)
d = ImageDraw.Draw(img)
mid = w // 2
d.rectangle([mid, 0, w, h], fill=FIZZ)

def place(path, edge, cy, height, side):
    """side 'left': the half's right edge sits at `edge`; 'right': its left edge does."""
    p = Image.open(path).convert("RGBA")
    k = height / p.height
    p = p.resize((int(p.width * k), int(p.height * k)), Image.LANCZOS)
    x = int(edge - p.width) if side == "left" else int(edge)
    y = int(cy - p.height / 2)
    # contact shadow: the cut-out's own alpha, flattened, blurred, offset down
    a = p.split()[3]
    sh = Image.new("L", (w, h), 0)
    flat = a.resize((p.width, int(p.height * 0.32)))
    sh.paste(flat, (x + int(p.width * 0.04), y + int(p.height * 0.80)))
    sh = sh.filter(ImageFilter.GaussianBlur(28 * S)).point(lambda v: int(v * 0.42))
    img.paste(Image.new("RGB", (w, h), "#3A2A20"), (0, 0), sh)
    img.paste(p, (x, y), p)

# the halves sit against the knife line, parted by a hair
GAP = 30 * S  # the halves have just parted along the knife
# a real cut leaves two mirror-image faces: one half and its mirror, same light, scale and shadow
place("assets-src/cutouts/half-front-mirror.png", mid - GAP, h * 0.60, 540 * S, "left")
place("assets-src/cutouts/half-front.png", mid + GAP, h * 0.60, 540 * S, "right")

# the knife: the divider, with the cut's progress tick
d = ImageDraw.Draw(img)
d.rectangle([mid - S, 0, mid + S, h], fill=INK)

pad = 56 * S
d.text((pad, pad - 6 * S), "kallangadi", font=disp(28), fill=INK)  # working wordmark
hy = pad + 58 * S
d.text((pad, hy), "Real fruit.", font=disp(104), fill=INK)
rt = "Real fizz."
d.text((w - pad - d.textlength(rt, font=disp(104)), hy), rt, font=disp(104), fill=INK)
d.text((pad, h - pad - 70 * S), "A concept watermelon soda.", font=body(20, 500), fill=INK)
d.text((pad, h - pad - 42 * S), "No added sugar.", font=body(20), fill=MUTED)
# CTA pill, bottom right
label = "See how it was made"
f = body(18, 500); tw = d.textlength(label, font=f)
bx1, by1 = w - pad, h - pad - 8 * S
bx0, by0 = bx1 - tw - 56 * S, by1 - 52 * S
d.rounded_rectangle([bx0, by0, bx1, by1], radius=26 * S, fill=RIND)
d.text((bx0 + 28 * S, by0 + 15 * S), label, font=f, fill="#FFFFFF")

img = img.resize((W, H), Image.LANCZOS)
# fine grain so the flat grounds don't band
rng = np.random.default_rng(7)
arr = np.asarray(img).astype(np.int16) + rng.normal(0, 2.2, (H, W, 1)).astype(np.int16)
Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(OUT)
print(OUT)
