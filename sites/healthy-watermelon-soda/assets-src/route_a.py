"""Route A hero art: "The Cut". Pure-numpy procedural shader + Pillow text mask.
  python3 assets-src/route_a.py still|clip|all      (run from the site folder)
All shading is in per-pixel functions over coordinate grids so it ports to GLSL.
Everything is authored in a 1600x1000 reference space and scaled by S.
Static layers live in SOURCE space (before the halves part); per frame only a row-wise
x gather, the reveal front, shadows, knife and bubbles change."""
import math, os, sys, time, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import distance_transform_edt, gaussian_filter

HERE = os.path.dirname(os.path.abspath(__file__))
FONT = os.path.join(HERE, "fonts", "BricolageGrotesque-800.ttf")
OUT = os.path.join(HERE, "..", "docs", "art")
hexc = lambda h: np.array([int(h[i:i+2], 16) / 255 for i in (1, 3, 5)], np.float32)
GL, GR = hexc("#DDEBC8"), hexc("#FFF0F2")
RIND, FL0, FL1 = hexc("#1E5631"), hexc("#C41E3A"), hexc("#E8344E")
PINK, INK, JUICE = hexc("#FF8FA3"), hexc("#2A0E12"), hexc("#FFE9A8")
F32 = np.float32

# ---------------- math helpers (GLSL-style) ----------------
def sstep(a, b, x):
    t = np.clip((x - a) / (b - a), 0, 1); return (t * t * (3 - 2 * t)).astype(F32)
def mix(a, b, t): return a + (b - a) * t[..., None] if np.ndim(t) else a + (b - a) * t
def hash2(ix, iy, seed):
    h = (ix * 374761393 + iy * 668265263 + seed * 2147483647) & 0xFFFFFFFF
    h = ((h ^ (h >> 13)) * 1274126177) & 0xFFFFFFFF
    return ((h ^ (h >> 16)) & 0xFFFFFF).astype(F32) / 16777215.0
def vnoise(x, y, seed):
    xi, yi = np.floor(x), np.floor(y); fx, fy = (x - xi).astype(F32), (y - yi).astype(F32)
    xi, yi = xi.astype(np.int64), yi.astype(np.int64)
    ux, uy = fx * fx * (3 - 2 * fx), fy * fy * (3 - 2 * fy)
    a, b = hash2(xi, yi, seed), hash2(xi + 1, yi, seed)
    c, d = hash2(xi, yi + 1, seed), hash2(xi + 1, yi + 1, seed)
    return (a + (b - a) * ux) + ((c + (d - c) * ux) - (a + (b - a) * ux)) * uy
def fbm(x, y, octs, seed):
    s, amp, tot = 0, 0.5, 0
    for o in range(octs):
        s = s + amp * vnoise(x, y, seed + o); tot += amp; x, y, amp = x * 2.03 + 17.3, y * 2.03 + 5.1, amp * 0.5
    return s / tot

# ---------------- static layers ----------------
def build(W, H, ss):
    S = ss * W / 1600.0; w, h = int(W * ss), int(H * ss); cx = w // 2
    L = dict(W=W, H=H, ss=ss, S=S, w=w, h=h, cx=cx)
    # text mask: WATER / MELON, cut passes through T and L
    f0 = ImageFont.truetype(FONT, 400)
    wid = max(f0.getbbox(t)[2] - f0.getbbox(t)[0] for t in ("WATER", "MELON"))
    fs = int(400 * 0.86 * w / wid); f = ImageFont.truetype(FONT, fs)
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    cap = f.getbbox("H")[3] - f.getbbox("H")[1]; gap = int(cap * 0.13)
    top = (h - (2 * cap + gap)) // 2 - int(0.01 * h)
    for i, t in enumerate(("WATER", "MELON")):
        bb = f.getbbox(t); tw = bb[2] - bb[0]
        d.text((cx - tw // 2 - bb[0], top + i * (cap + gap) - f.getbbox("H")[1]), t, font=f, fill=255)
    M = np.asarray(im, F32) / 255; L["M"] = M
    e = distance_transform_edt(M > 0.5).astype(F32) / S; L["e"] = e   # inside distance in ref px
    L["text_box"] = (top, top + 2 * cap + gap)
    yy, xx = np.mgrid[0:h, 0:w].astype(F32); px, py = xx / S, yy / S
    # --- flesh height field: warped fibrous grain + granules + wet droplets
    wp = (fbm(px / 90, py / 90, 3, 3) - .5) * 40
    g1 = fbm((px + wp) / 15, (py + wp) / 8, 4, 11)
    c = fbm(px / 55, py / 70, 3, 23); fine = vnoise(px / 2.2, py / 2.2, 5)
    hf = 0.5 * g1 + 0.35 * c + 0.15 * fine
    rng = np.random.default_rng(4)
    ys, xs_ = np.nonzero(M[::int(8 * S), ::int(8 * S)] > .5)
    for k in rng.permutation(len(ys))[:700]:       # wet beads
        y0, x0 = ys[k] * int(8 * S), xs_[k] * int(8 * S)
        if e[y0, x0] < 14 or abs(x0 - cx) < 6 * S: continue
        r = rng.uniform(2.5, 7) * S; a, b, c2, d2 = int(y0 - r), int(y0 + r) + 1, int(x0 - r), int(x0 + r) + 1
        g = np.mgrid[a:b, c2:d2]; q = ((g[0] - y0) ** 2 + (g[1] - x0) ** 2) / r ** 2
        hf[a:b, c2:d2] += 0.9 * np.sqrt(np.clip(1 - q, 0, 1)) * (0.6 + .4 * rng.random())
    gy, gx = np.gradient(hf)
    K = 9.0 * S
    n = np.stack([-gx * K, -gy * K, np.ones_like(gx)], -1); n /= np.linalg.norm(n, axis=-1, keepdims=True)
    Ld = np.array([-.45, -.6, .66], F32); Ld /= np.linalg.norm(Ld)
    Hv = Ld + np.array([0, 0, 1], F32); Hv /= np.linalg.norm(Hv)
    diff = np.clip(n @ Ld, 0, 1); spec = np.clip(n @ Hv, 0, 1) ** 70
    wet = sstep(.3, .6, fbm(px / 70, py / 50, 2, 31))
    dx = np.abs(xx - cx) / S
    # --- flesh colour
    t = np.clip(.5 + 1.2 * (c - .5) + .9 * (g1 - .5), 0, 1)
    flesh = mix(FL0, FL1, t) * (0.82 + 0.3 * diff)[..., None]
    pale = np.exp(-np.clip(e - 11, 0, None) / 20) * .5             # paler toward the rind
    flesh = mix(flesh, PINK * .98 + .02, pale)
    glow = np.exp(-dx / 38) * .55                                      # subsurface glow at cut face
    flesh = mix(flesh, PINK, glow * .7) + JUICE * (glow * .08)[..., None]
    # seeds: AO halo, then body with glossy highlight
    seeds = []
    for gy_ in range(8, h, int(54 * S)):
        for gx_ in range(8, w, int(54 * S)):
            y0, x0 = gy_ + rng.uniform(-14, 14) * S, gx_ + rng.uniform(-14, 14) * S
            yi, xi = int(np.clip(y0, 0, h - 1)), int(np.clip(x0, 0, w - 1))
            if M[yi, xi] > .5 and e[yi, xi] > 19 and abs(xi - cx) > 16 * S and rng.random() < .75:
                seeds.append((x0, y0, rng.normal(0, .5) + math.pi / 2, rng.uniform(.8, 1.15)))
    halo = np.zeros((h, w), F32); body = np.zeros((h, w), F32); hl = np.zeros((h, w), F32)
    for x0, y0, ang, sc in seeds:
        R = int(30 * S * sc); a, b, c2, d2 = max(int(y0) - R, 0), min(int(y0) + R, h), max(int(x0) - R, 0), min(int(x0) + R, w)
        gy2, gx2 = np.mgrid[a:b, c2:d2].astype(F32); u, v = (gx2 - x0) / S, (gy2 - y0) / S
        ca, sa = math.cos(ang), math.sin(ang); lu, lv = (u * ca + v * sa) / sc, (-u * sa + v * ca) / sc
        pin = 1 - .35 * np.clip(lu / 14 + .5, 0, 1) * 0 - .3 * sstep(-2, 14, lu)  # teardrop: narrows to one end
        q = np.sqrt((lu / 14) ** 2 + (lv / (7.2 * pin)) ** 2)
        cov = 1 - sstep(1 - 1.2 / (7 * S / 2), 1, q) ; cov = (1 - sstep(.96, 1.0, q))
        halo[a:b, c2:d2] = np.maximum(halo[a:b, c2:d2], np.exp(-np.clip(q - 1, 0, None) * 2.2) * .8)
        body[a:b, c2:d2] = np.maximum(body[a:b, c2:d2], cov)
        hq = np.sqrt(((lu + 4) / 6) ** 2 + ((lv + 2.2) / 1.4) ** 2)        # glossy streak
        hl[a:b, c2:d2] = np.maximum(hl[a:b, c2:d2], (np.exp(-hq ** 2 * 2.5) * cov * .8))
    flesh *= (1 - .45 * halo)[..., None]
    flesh = flesh + JUICE * (spec * wet * .9 + spec * .35)[..., None]
    flesh = mix(flesh, INK * (1 + .8 * diff[..., None]), body)
    flesh = flesh + hl[..., None] * np.array([1, .93, .8], F32) * .8
    flesh += (np.exp(-dx / 1.6) * .55)[..., None] * JUICE * (e > 8)[..., None]   # wet cut edge
    # --- rind: banded outline + wavy-stripe solid rind
    ex = np.clip(e, 0, None)
    band = mix(RIND * .9, hexc("#3E8A4A"), sstep(0, 8, ex))
    gey, gex = np.gradient(distance_transform_edt(M > .5).astype(F32))
    bevel = (1 - sstep(0, 4.5, ex)) * np.clip(-(gex * -.6 + gey * -.8) * -1, 0, 1) * .45
    pith = sstep(7, 8.5, ex) * (1 - sstep(10, 11.5, ex))
    flesh_l = mix(band, flesh, sstep(9.5, 12, ex)); flesh_l = mix(flesh_l, hexc("#EEF5D6"), pith * .85)
    stripe = .5 + .5 * np.sin((px + 60 * (fbm(py / 160, px / 400, 3, 41) - .5)) / 11.0 + 2.5 * fbm(px / 30, py / 30, 2, 9))
    solid = mix(RIND * 1.05, hexc("#3A8548"), sstep(.2, .9, stripe) * .8 + .12 * (vnoise(px / 3, py / 3, 8) - .5))
    rind_l = mix(band, solid, sstep(6, 13, ex))
    for A in (flesh_l, rind_l): A += (bevel + .0)[..., None] * np.array([.9, 1, .8], F32)
    rind_l -= (np.exp(-dx / 22) * .12)[..., None] * 0                                    # (kept neutral)
    L.update(flesh=np.clip(flesh_l, 0, 1).astype(F32), rind=np.clip(rind_l, 0, 1).astype(F32), seeds=seeds,
             noise_edge=fbm(px / 30, py / 60, 3, 51).astype(F32), yy=yy[:, :1].copy())
    # --- ground (paper-like, two tones, soft light)
    gnd = np.where((xx < cx)[..., None], GL, GR).astype(F32)
    vign = 1 - .16 * (((xx / w - .5) * 1.1) ** 2 + ((yy / h - .45) * 1.2) ** 2)
    gnd = gnd * vign[..., None] * (1 + .018 * (fbm(px / 4, py / 4, 2, 61) - .5))[..., None]
    L["gnd"] = gnd.astype(F32)
    # --- bubbles in ref space
    r2 = np.random.default_rng(12); NB = 74; B = []
    for i in range(NB):
        r = float(np.clip(r2.lognormal(math.log(15), .55), 4, 66))
        B.append(dict(y0=r2.uniform(.12, .98) * 1000, x0=800 + r2.normal(0, 16), r=r, v=62 + 2.4 * r + r2.uniform(0, 44),
                      wob=r2.uniform(5, 22), fr=r2.uniform(1.2, 3.0), ph=r2.uniform(0, 6.28), spread=r2.uniform(-1, 1) * 150 * (.4 + r / 66),
                      lag=r2.uniform(0, .45), seed=(r2.random() < .38 and r > 14), sang=r2.uniform(0, 6.28)))
    B.sort(key=lambda b: b["r"]); L["B"] = B
    return L

# ---------------- timeline ----------------
def ease(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)
def knife_y(t): return -0.10 + 1.30 * ease((t - 0.25) / 2.1)          # fraction of H
def part(t): return 0.03 * (ease((t - .5) / 2.7) * 1.06 - .06 * ease((t - 2.2) / 1.2)) if t > .5 else 0

# ---------------- bubble sprite ----------------
def draw_bubble(img, cx, cy, r, alpha, S, seed_ang=None):
    h, w = img.shape[:2]; R = int(r * 1.5 + 4)
    a, b, c, d = max(int(cy) - R, 0), min(int(cy) + R, h), max(int(cx) - R, 0), min(int(cx) + R, w)
    if b <= a or d <= c or r < 1: return
    yy, xx = np.mgrid[a:b, c:d].astype(F32)
    # soft shadow
    sd = np.hypot(xx - (cx + .3 * r), yy - (cy + .5 * r)) / (1.05 * r)
    img[a:b, c:d] *= (1 - .16 * alpha * np.exp(-sd ** 2 * 1.6) * (1 - .5 * (r < 8)))[..., None] * np.array([1, .985, .99], F32)
    u, v = (xx - cx) / r, (yy - cy) / r; rr2 = u * u + v * v; rr = np.sqrt(rr2)
    ins = 1 - sstep(1 - 1.5 / r, 1.0, rr)
    off = .5 * r * rr2                                                # lens refraction, inverted
    sx = np.clip(xx - u * off, 0, w - 1).astype(int); sy = np.clip(yy - v * off, 0, h - 1).astype(int)
    col = img[sy, sx] * .94 + PINK * .08
    if seed_ang is not None:
        ca, sa = math.cos(seed_ang), math.sin(seed_ang); lu, lv = u * ca + v * sa, -u * sa + v * ca
        q = np.sqrt((lu / .42) ** 2 + (lv / (.2 * (1 - .3 * sstep(-.1, .4, lu)))) ** 2)
        cov = 1 - sstep(.92, 1.0, q); hq = np.hypot((lu + .1) / .2, (lv + .06) / .05)
        col = mix(col, INK * 1.3, cov * .92) + (np.exp(-hq ** 2) * cov * .7)[..., None]
    fres = rr ** 3.5
    col = col + (mix(np.ones(3, F32), JUICE, .3) - col) * (fres * .5)[..., None]
    col = col * (1 - .22 * sstep(.82, .97, rr) * (1 - sstep(.97, 1.0, rr)))[..., None] * np.array([1, .93, .95], F32) ** (sstep(.82, .97, rr))[..., None]
    sp = np.exp(-(np.hypot(u + .4, v + .44) / .16) ** 2) * .95 + np.exp(-(np.hypot(u + .22, v + .62) / .06) ** 2) * .4
    cres = np.exp(-((rr - .8) / .08) ** 2) * np.clip(.6 * u + .8 * v, 0, 1) * .5
    col = col + sp[..., None] * (rr < 1)[..., None] + (cres[..., None] * JUICE)
    m = (ins * alpha)[..., None]; img[a:b, c:d] = img[a:b, c:d] * (1 - m) + np.clip(col, 0, 1.3) * m

# ---------------- frame ----------------
def render(L, t):
    S, w, h, cx, W, H, ss = L["S"], L["w"], L["h"], L["cx"], L["W"], L["H"], L["ss"]
    gnd = L["gnd"].copy(); y = L["yy"][:, 0]
    k = knife_y(t) * h; D = part(t) * w
    u = ease_arr((k - y) / (.30 * h)); s = (D / 2 * u).astype(np.int64)          # per-row half offset
    xs = np.arange(w)[None, :]
    left = xs < (cx - s[:, None]); right = xs >= (cx + s[:, None])
    src = np.where(left, xs + s[:, None], xs - s[:, None]).clip(0, w - 1)
    cov = np.take_along_axis(L["M"], src, 1) * (left | right)
    # soft shadows from coverage (computed at 1/4 res)
    q = 4; small = cov.reshape(h // q, q, w // q, q).mean((1, 3))
    sh_big = np.roll(gaussian_filter(small, 7 * S / q * 1.0), int(22 * S / q), 0)
    sh_tight = np.roll(gaussian_filter(small, 1.6 * S / q), int(5 * S / q), 0)
    up = lambda a: np.repeat(np.repeat(a, q, 0), q, 1)
    shade = 1 - .26 * up(sh_big) - .22 * up(sh_tight)
    img = gnd * shade[..., None] * np.array([1, .96, .98], F32)
    # juice glow in the gap
    gapw = np.maximum(2 * s, 2).astype(F32)[:, None]
    gl = np.exp(-(np.abs(xs - cx) / (gapw * .8 + 3 * S)) ** 2) * (s[:, None] > 0) * (.35 * u[:, None])
    img = mix(img, PINK, np.clip(gl, 0, 1))
    # letters: reveal front moves out from the cut face as the knife passes
    dxs = np.abs(src - cx).astype(F32) / S
    front = 900 * ease((t - .3) / 2.6) * u[:, None]
    qf = front - dxs + (np.take_along_axis(L["noise_edge"], src, 1) - .5) * 26
    wgt = sstep(0, 40, qf)
    wgt = wgt * (1 - .0)
    colr = np.where(wgt[..., None] > 0, mix(np.take_along_axis(L["rind"], src[..., None].repeat(3, 2), 1),
                                            np.take_along_axis(L["flesh"], src[..., None].repeat(3, 2), 1), wgt),
                    np.take_along_axis(L["rind"], src[..., None].repeat(3, 2), 1))
    img = img * (1 - cov[..., None]) + colr * cov[..., None]
    # knife: thin steel line, bright tip
    xk = np.abs(xs - cx)
    line = (1 - sstep(.5 * S, 1.8 * S, xk.astype(F32))) * 1
    above = (y < k)[:, None]
    img = mix(img, INK, (line * .35 * ~above + line * .8 * above))
    tip = np.exp(-(((xs - cx) / (6 * S)) ** 2 + ((y[:, None] - k) / (34 * S)) ** 2)) * (-.2 * h < k) * (k < 1.1 * h)
    img = img + tip[..., None] * JUICE * .8
    img = img + (line * above * np.exp(-np.abs(y[:, None] - k + 20 * S) / (60 * S)) * .0)[..., None]
    # bubbles
    for b in L["B"]:
        tsp = (b["y0"] / 1000 - -0.10) / 1.30            # approx time knife passes y0
        ts = .25 + 2.1 * (lambda p: 0.5 - math.sin(math.asin(1 - 2 * min(max(p, 0), 1)) / 3) if True else 0)(tsp) + b["lag"]
        age = t - ts
        if age <= 0: continue
        r = b["r"] * S * ease(age / .35)
        dist = b["v"] * age * S; cyb = b["y0"] * S - dist
        cxb = cx + (b["x0"] - 800) * S + b["spread"] * S * min(dist / (500 * S), 1.4) + b["wob"] * S * math.sin(b["fr"] * age * 2 + b["ph"]) * ease(age / .8)
        if cyb < -r * 2: continue
        al = .9 if b["r"] > 12 else .7
        draw_bubble(img, cxb, cyb, r, al, S, b["sang"] if b["seed"] else None)
    # downsample + finish
    img = img.reshape(H, ss, W, ss, 3).mean((1, 3))
    rg = np.random.default_rng(int(t * 1000) + 1)
    img = img + (rg.normal(0, .012, (H, W, 1))).astype(F32)
    return (np.clip(img, 0, 1) * 255 + .5).astype(np.uint8)

def ease_arr(x): x = np.clip(x, 0, 1); return (x * x * (3 - 2 * x)).astype(F32)

# ---------------- entry ----------------
_L = None
def _init(W, H, ss):
    global _L; _L = build(W, H, ss)
def _frame(a):
    i, t, path = a; Image.fromarray(render(_L, t)).save(path, compress_level=1); return i

if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"; os.makedirs(OUT, exist_ok=True); t0 = time.time()
    if mode in ("still", "all"):
        L = build(1600, 1000, 2); tp = float(os.environ.get("PEAK", 3.3))
        Image.fromarray(render(L, tp)).save(os.path.join(OUT, "route-a-still.png"))
        print("still", round(time.time() - t0, 1), "s")
    if mode in ("clip", "all"):
        import multiprocessing as mp, tempfile
        tmp = tempfile.mkdtemp(prefix="wm_"); jobs = [(i, i / 30, f"{tmp}/f{i:04d}.png") for i in range(120)]
        with mp.Pool(2, initializer=_init, initargs=(1280, 800, 2)) as p: list(p.imap_unordered(_frame, jobs, 4))
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-framerate", "30", "-i", f"{tmp}/f%04d.png", "-c:v", "libx264",
                        "-preset", "veryfast", "-pix_fmt", "yuv420p", "-crf", "18", os.path.join(OUT, "route-a-clip.mp4")], check=True)
        print("clip", round(time.time() - t0, 1), "s")
