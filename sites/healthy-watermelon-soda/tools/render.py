"""Render a WebGL/HTML proof page to PNG frames with headless Chrome (software GL).

  python3 tools/render.py <page.html> <out-prefix> [t1 t2 ...]

Serves the site folder over http (ES modules and textures need it), opens the page at 1920x1080,
waits for window.__ready (a Promise or true), then for each t calls window.renderAt(t) and saves
<out-prefix>-<t>.png. With no times it saves one frame after window.__ready as <out-prefix>.png.
Page contract: import three from /node_modules/three/build/three.module.js (importmap), set
window.renderAt = (t) => {...draw...}, set window.__ready = Promise. Console errors are printed.
"""
import sys, threading, http.server, socketserver, functools, os, time
from playwright.sync_api import sync_playwright

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
page_rel = os.path.relpath(os.path.abspath(sys.argv[1]), root)
out = sys.argv[2]; times = [float(x) for x in sys.argv[3:]]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
H = functools.partial(Quiet, directory=root)
srv = socketserver.TCPServer(("127.0.0.1", 0), H); port = srv.server_address[1]
threading.Thread(target=srv.serve_forever, daemon=True).start()
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/usr/bin/google-chrome", args=["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"])
    pg = b.new_page(viewport={"width": 1920, "height": 1080})
    errs = []
    pg.on("console", lambda m: errs.append(m.text) if m.type == "error" and "favicon" not in m.text and "404" not in m.text else None)
    pg.on("pageerror", lambda e: errs.append(str(e)))
    t0 = time.time()
    pg.goto(f"http://127.0.0.1:{port}/{page_rel}")
    pg.wait_for_function("window.__ready !== undefined", timeout=120000)
    pg.evaluate("Promise.resolve(window.__ready)")
    if not times:
        pg.wait_for_timeout(300); pg.screenshot(path=f"{out}.png"); print(f"{out}.png")
    for t in times:
        pg.evaluate(f"Promise.resolve(window.renderAt({t}))"); pg.wait_for_timeout(150)
        f = f"{out}-{t:g}.png"; pg.screenshot(path=f); print(f)
    print(f"done in {time.time()-t0:.0f}s; errors: {errs[:5] or 'none'}")
    b.close()
srv.shutdown()
