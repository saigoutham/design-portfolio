"""Photoreal watermelon (Crimson Sweet style) built procedurally in Blender.

Run headless (from the site folder):
  python3 assets-src/watermelon.py --shot whole --out docs/watermelon/whole-v1.png
  python3 assets-src/watermelon.py --shot cut   --out docs/watermelon/cut-v1.png
Options: --samples 128  --size 1600x1000  --seed 7

Object axes: the fruit's long axis is local +x (stem end at +x). Metres.
The outer surface is a parametric ellipsoid P(u, phi) with radial-only deformation, so
the meridians phi=0 and phi=pi stay in the plane z=0: that plane is the lengthwise cut.
Each half is one closed mesh: half the skin plus a cut face built as rings that run in
from the cut outline to its centre. The cut face's UV.x stores depth from the skin in
metres, which the flesh shader turns into skin / rind band / pink / red.
"""

import argparse
import math
import random
import sys

import bpy  # must come first: it provides bmesh and mathutils
import bmesh  # noqa: E402
from mathutils import Matrix, Vector, noise  # noqa: E402

A = 0.150  # half-length (long axis)
B = 0.120  # half-width  -> 1.25 : 1
GROUND_SPOT = Vector((0.0, -0.55, -0.835)).normalized()  # object space, pale patch
NU, NPHI = 141, 200  # pole-to-pole rings, segments around the full fruit

# ---------------------------------------------------------------- helpers


def srgb(hex_):
    h = hex_.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


class G:
    """Tiny node-graph builder."""

    def __init__(self, mat):
        mat.use_nodes = True
        self.nt = mat.node_tree
        self.nodes = self.nt.nodes
        self.links = self.nt.links
        for n in list(self.nodes):
            self.nodes.remove(n)

    def node(self, kind, **props):
        n = self.nodes.new(kind)
        for k, v in props.items():
            setattr(n, k, v)
        return n

    def set(self, sock, val):
        if isinstance(val, bpy.types.NodeSocket):
            self.links.new(val, sock)
        elif val is not None:
            sock.default_value = val

    def math(self, op, a, b=None, clamp=False):
        n = self.node("ShaderNodeMath", operation=op, use_clamp=clamp)
        self.set(n.inputs[0], a)
        if b is not None:
            self.set(n.inputs[1], b)
        return n.outputs[0]

    def vmath(self, op, a, b=None, out=0):
        n = self.node("ShaderNodeVectorMath", operation=op)
        self.set(n.inputs[0], a)
        if b is not None:
            self.set(n.inputs[1], b)
        return n.outputs[out]

    def noise(self, vec, scale, detail=4.0, rough=0.5, distortion=0.0, out="Fac"):
        n = self.node("ShaderNodeTexNoise")
        self.set(n.inputs["Vector"], vec)
        n.inputs["Scale"].default_value = scale
        n.inputs["Detail"].default_value = detail
        n.inputs["Roughness"].default_value = rough
        n.inputs["Distortion"].default_value = distortion
        return n.outputs[out]

    def voronoi(self, vec, scale, feature="F1", out="Distance", randomness=1.0):
        n = self.node("ShaderNodeTexVoronoi", feature=feature)
        self.set(n.inputs["Vector"], vec)
        n.inputs["Scale"].default_value = scale
        n.inputs["Randomness"].default_value = randomness
        return n.outputs[out]

    def ramp(self, fac, stops, interp="LINEAR"):
        n = self.node("ShaderNodeValToRGB")
        cr = n.color_ramp
        cr.interpolation = interp
        while len(cr.elements) > 1:
            cr.elements.remove(cr.elements[-1])
        cr.elements[0].position = stops[0][0]
        cr.elements[0].color = stops[0][1] if len(stops[0][1]) == 4 else (*stops[0][1], 1.0)
        for pos, col in stops[1:]:
            e = cr.elements.new(pos)
            e.color = col if len(col) == 4 else (*col, 1.0)
        self.set(n.inputs[0], fac)
        return n.outputs["Color"], n.outputs["Alpha"]

    def mix(self, fac, a, b):
        n = self.node("ShaderNodeMix", data_type="RGBA", blend_type="MIX")
        self.set(n.inputs["Factor"], fac)
        self.set(n.inputs[6], a)
        self.set(n.inputs[7], b)
        return n.outputs[2]

    def mixf(self, fac, a, b):
        n = self.node("ShaderNodeMix", data_type="FLOAT")
        self.set(n.inputs["Factor"], fac)
        self.set(n.inputs[2], a)
        self.set(n.inputs[3], b)
        return n.outputs[0]

    def maprange(self, val, a, b, c=0.0, d=1.0, interp="SMOOTHSTEP"):
        n = self.node("ShaderNodeMapRange", interpolation_type=interp)
        self.set(n.inputs["Value"], val)
        n.inputs["From Min"].default_value = a
        n.inputs["From Max"].default_value = b
        n.inputs["To Min"].default_value = c
        n.inputs["To Max"].default_value = d
        return n.outputs[0]

    def bump(self, height, strength, distance, normal=None):
        n = self.node("ShaderNodeBump")
        self.set(n.inputs["Height"], height)
        n.inputs["Strength"].default_value = strength
        n.inputs["Distance"].default_value = distance
        if normal is not None:
            self.set(n.inputs["Normal"], normal)
        return n.outputs[0]

    def bsdf(self, **inputs):
        b = self.node("ShaderNodeBsdfPrincipled")
        for k, v in inputs.items():
            self.set(b.inputs[k.replace("_", " ")], v)
        out = self.node("ShaderNodeOutputMaterial")
        self.links.new(b.outputs[0], out.inputs[0])
        return b


def rgb(hex_):
    return srgb(hex_)


# ---------------------------------------------------------------- materials


def mat_rind():
    m = bpy.data.materials.new("rind")
    g = G(m)
    p = g.node("ShaderNodeTexCoord").outputs["Object"]
    sep = g.node("ShaderNodeSeparateXYZ")
    g.set(sep.inputs[0], p)
    x, y, z = sep.outputs
    theta = g.math("ARCTAN2", z, y)
    # Anisotropic coordinates: squash along x so jagged "teeth" run across the stripes.
    pt = g.vmath("MULTIPLY", p, (2.2, 1.0, 1.0))
    warp_lo = g.math("SUBTRACT", g.noise(p, 7.0, 3.0, 0.5), 0.5)
    warp_mid = g.math("SUBTRACT", g.noise(p, 16.0, 5.0, 0.55), 0.5)
    teeth = g.math("SUBTRACT", g.noise(pt, 22.0, 8.0, 0.62, distortion=0.8), 0.5)
    width_var = g.math("SUBTRACT", g.noise(p, 3.0, 2.0), 0.5)
    phase = g.math("ADD", g.math("MULTIPLY", theta, 11.0), g.math("MULTIPLY", warp_lo, 6.0))
    phase = g.math("ADD", phase, g.math("MULTIPLY", warp_mid, 2.6))
    s = g.math("SINE", phase)
    s = g.math("ADD", s, g.math("MULTIPLY", teeth, 1.6))
    s = g.math("ADD", s, g.math("MULTIPLY", width_var, 0.9))
    stripe = g.maprange(s, -0.3, -0.12)  # 1 = dark stripe

    mott = g.noise(p, 45.0, 6.0, 0.6)
    vein = g.noise(pt, 120.0, 4.0, 0.6)
    base_col, _ = g.ramp(mott, [(0.3, rgb("#3a5a24")), (0.5, rgb("#47692c")), (0.72, rgb("#5a7b38"))])
    base_col = g.mix(g.maprange(vein, 0.55, 0.7, 0.0, 0.35), base_col, rgb("#5f8a45"))
    dark_col, _ = g.ramp(mott, [(0.3, rgb("#0a1c0c")), (0.6, rgb("#112913")), (0.8, rgb("#1a3818"))])
    # Organic veins: ridged noise stretched along the fruit, strongest near stripe edges.
    vn = g.noise(g.vmath("MULTIPLY", p, (0.45, 1.0, 1.0)), 28.0, 6.0, 0.55, distortion=0.3)
    ridge = g.math("ABSOLUTE", g.math("SUBTRACT", vn, 0.5))
    edge_near = g.maprange(s, -1.1, -0.5)
    netm = g.math("MULTIPLY", g.maprange(ridge, 0.035, 0.0), g.math("MULTIPLY", edge_near, 0.75))
    base_col = g.mix(netm, base_col, rgb("#24461d"))
    col = g.mix(stripe, base_col, dark_col)

    # Ground spot: creamy yellow patch where the fruit lay in the field.
    dirn = g.vmath("NORMALIZE", p)
    d = g.vmath("DOT_PRODUCT", dirn, tuple(GROUND_SPOT), out=1)
    d = g.math("ADD", d, g.math("MULTIPLY", g.math("SUBTRACT", g.noise(p, 7.0, 5.0, 0.6), 0.5), 0.45))
    spot = g.maprange(d, 0.74, 0.95)
    spot_col, _ = g.ramp(g.noise(p, 30.0, 5.0), [(0.3, rgb("#a89a4c")), (0.7, rgb("#c4b468"))])
    spot_col = g.mix(g.math("MULTIPLY", stripe, 0.35), spot_col, rgb("#8e9a55"))
    col = g.mix(spot, col, spot_col)

    # Stem scar (+x) and blossom scar (-x).
    radial = g.math("SQRT", g.math("ADD", g.math("MULTIPLY", y, y), g.math("MULTIPLY", z, z)))
    endx = g.math("GREATER_THAN", x, 0.0)
    scar = g.maprange(radial, 0.016, 0.010)
    blossom = g.math("MULTIPLY", g.maprange(radial, 0.011, 0.006), g.math("SUBTRACT", 1.0, endx))
    stem = g.math("MULTIPLY", scar, endx)
    col = g.mix(stem, col, rgb("#5a5530"))
    col = g.mix(blossom, col, rgb("#6e6040"))

    rough = g.maprange(g.noise(p, 35.0, 5.0), 0.3, 0.7, 0.42, 0.55)
    rough = g.mixf(spot, rough, 0.55)
    pits = g.voronoi(p, 260.0)
    h = g.math("ADD", g.math("MULTIPLY", pits, 0.25), g.math("MULTIPLY", g.noise(p, 40.0, 4.0), 0.6))
    nrm = g.bump(h, 0.2, 0.0006)
    g.bsdf(
        Base_Color=col,
        Roughness=rough,
        Normal=nrm,
        Coat_Weight=0.12,
        Coat_Roughness=0.4,
        Sheen_Weight=0.04,
        Sheen_Roughness=0.45,
        Sheen_Tint=(0.75, 0.8, 0.75, 1.0),
        Specular_IOR_Level=0.45,
    )
    return m


def mat_flesh():
    m = bpy.data.materials.new("flesh")
    g = G(m)
    tc = g.node("ShaderNodeTexCoord")
    p = tc.outputs["Object"]
    uv = g.node("ShaderNodeSeparateXYZ")
    g.set(uv.inputs[0], tc.outputs["UV"])
    depth = uv.outputs[0]
    wob = g.math("ADD", g.math("MULTIPLY", g.math("SUBTRACT", g.noise(p, 60.0, 3.0), 0.5), 0.0016),
                 g.math("MULTIPLY", g.math("SUBTRACT", g.noise(p, 10.0, 2.0), 0.5), 0.004))
    d = g.math("ADD", depth, g.math("MULTIPLY", wob, g.maprange(depth, 0.0015, 0.004)))
    f = g.math("DIVIDE", d, 0.03)
    layers, _ = g.ramp(f, [
        (0.000, rgb("#132a15")),
        (0.040, rgb("#1d3d1d")),
        (0.075, rgb("#7fa35f")),
        (0.140, rgb("#cfe0ad")),
        (0.240, rgb("#e9eecf")),
        (0.300, rgb("#f0dcc0")),
        (0.360, rgb("#f09a8a")),
        (0.450, rgb("#e34a4c")),
        (0.560, rgb("#d6202e")),
        (1.000, rgb("#cc1426")),
    ])
    # Crystalline granules: ~2.5 mm cells, each a touch lighter or darker.
    pw = g.vmath("ADD", p, g.vmath("MULTIPLY", g.vmath("SUBTRACT", g.noise(p, 90.0, 2.0, out="Color"), (0.5, 0.5, 0.5)), (0.004, 0.004, 0.004)))
    cell_rand = g.node("ShaderNodeSeparateColor")
    g.set(cell_rand.inputs[0], g.voronoi(pw, 330.0, out="Color"))
    flesh = g.maprange(d, 0.011, 0.018)
    var = g.math("MULTIPLY", g.math("SUBTRACT", cell_rand.outputs[0], 0.5), 0.22)
    hsv = g.node("ShaderNodeHueSaturation")
    g.set(hsv.inputs["Color"], layers)
    g.set(hsv.inputs["Value"], g.math("ADD", 1.0, g.math("MULTIPLY", var, flesh)))
    col = hsv.outputs[0]
    # Fibrous pale streaks along the long axis.
    streak = g.noise(g.vmath("MULTIPLY", p, (0.15, 1.0, 1.0)), 90.0, 3.0, 0.5)
    streak = g.math("MULTIPLY", g.maprange(streak, 0.66, 0.78, 0.0, 0.12), flesh)
    col = g.mix(streak, col, rgb("#f6a3a0"))

    sss = g.maprange(d, 0.008, 0.014)
    edges = g.voronoi(pw, 330.0, feature="DISTANCE_TO_EDGE")
    domes = g.voronoi(pw, 330.0)
    h = g.math("ADD", g.math("MULTIPLY", g.maprange(edges, 0.0, 0.08), 0.6), g.math("MULTIPLY", domes, -0.4))
    h = g.math("ADD", g.math("MULTIPLY", h, flesh), g.math("MULTIPLY", g.noise(p, 600.0, 2.0), 0.3))
    nrm = g.bump(h, 0.22, 0.0003)
    rough = g.mixf(flesh, 0.35, g.maprange(cell_rand.outputs[1], 0.0, 1.0, 0.04, 0.16))
    g.bsdf(
        Base_Color=col,
        Roughness=rough,
        Normal=nrm,
        Subsurface_Weight=sss,
        Subsurface_Radius=(1.0, 0.12, 0.08),
        Subsurface_Scale=0.003,
        Coat_Weight=0.25,
        Coat_Roughness=0.05,
        Coat_Normal=nrm,
        Coat_IOR=1.34,
        Specular_IOR_Level=0.28,
    )
    return m


def mat_seed():
    m = bpy.data.materials.new("seed")
    g = G(m)
    p = g.node("ShaderNodeTexCoord").outputs["Object"]
    col, _ = g.ramp(g.noise(p, 900.0, 4.0), [(0.35, rgb("#120b08")), (0.6, rgb("#24150d")), (0.8, rgb("#3d2615"))])
    g.bsdf(Base_Color=col, Roughness=0.3, Coat_Weight=0.7, Coat_Roughness=0.08,
           Normal=g.bump(g.noise(p, 1500.0, 2.0), 0.15, 0.0001))
    return m


def mat_pale_seed():
    m = bpy.data.materials.new("pale_seed")
    g = G(m)
    g.bsdf(Base_Color=rgb("#efe4c9"), Roughness=0.35, Subsurface_Weight=0.4,
           Subsurface_Radius=(1.0, 0.8, 0.6), Subsurface_Scale=0.001, Coat_Weight=0.6, Coat_Roughness=0.08)
    return m


def mat_juice():
    m = bpy.data.materials.new("juice")
    g = G(m)
    g.bsdf(Base_Color=(1.0, 0.85, 0.85, 1.0), Roughness=0.0, Transmission_Weight=1.0, IOR=1.34)
    return m


def mat_stem():
    m = bpy.data.materials.new("stem")
    g = G(m)
    p = g.node("ShaderNodeTexCoord").outputs["Object"]
    col, _ = g.ramp(g.noise(p, 400.0, 5.0), [(0.3, rgb("#4a4426")), (0.7, rgb("#7a6f3e"))])
    g.bsdf(Base_Color=col, Roughness=0.7, Normal=g.bump(g.noise(g.vmath("MULTIPLY", p, (1, 8, 8)), 300.0), 0.5, 0.0005))
    return m


def mat_backdrop():
    m = bpy.data.materials.new("backdrop")
    g = G(m)
    p = g.node("ShaderNodeTexCoord").outputs["Object"]
    col, _ = g.ramp(g.noise(p, 3.0, 2.0), [(0.3, rgb("#ece3d6")), (0.7, rgb("#f1e9de"))])
    g.bsdf(Base_Color=col, Roughness=0.85, Normal=g.bump(g.noise(p, 800.0, 2.0), 0.03, 0.001))
    return m


# ---------------------------------------------------------------- geometry


def radius_scale(dirv, cos_u):
    """Radial deformation (no change of phi, so cut meridians stay planar)."""
    r = 1.0
    r += 0.03 * noise.noise(dirv * 1.4 + Vector((3.1, 0.7, 1.9)))
    r += 0.004 * noise.noise(dirv * 6.0 + Vector((1.0, 5.0, 2.0)))
    r += 0.035 * cos_u  # stem end a touch fuller
    flat = max(0.0, dirv.dot(GROUND_SPOT) - 0.75)
    r -= 0.35 * flat * flat  # flattened where it lay in the field
    return r


def surface_point(u, phi):
    cu, su = math.cos(u), math.sin(u)
    dirv = Vector((cu, su * math.cos(phi), su * math.sin(phi)))
    r = radius_scale(dirv, cu)
    xs = 1.0 + 0.01 * noise.noise(dirv * 2.0 + Vector((7.0, 1.0, 3.0)))
    return Vector((A * cu * xs, B * r * su * math.cos(phi), B * r * su * math.sin(phi)))


def build_shell(bm, phi0, phi1, nphi, closed):
    """Skin from pole (+x) to pole (-x). Returns (grid[i][j], north, south)."""
    north = bm.verts.new(surface_point(0.0, 0.0))
    south = bm.verts.new(surface_point(math.pi, 0.0))
    cols = nphi if closed else nphi + 1
    grid = []
    for i in range(1, NU - 1):
        u = math.pi * i / (NU - 1)
        row = []
        for j in range(cols):
            phi = phi0 + (phi1 - phi0) * j / nphi
            row.append(bm.verts.new(surface_point(u, phi)))
        grid.append(row)
    span = cols if closed else cols - 1
    for j in range(span):
        j2 = (j + 1) % cols
        bm.faces.new((north, grid[0][j], grid[0][j2]))
        bm.faces.new((south, grid[-1][j2], grid[-1][j]))
        for i in range(len(grid) - 1):
            bm.faces.new((grid[i][j], grid[i + 1][j], grid[i + 1][j2], grid[i][j2]))
    return grid, north, south


RING_T = [0.0, 0.004, 0.009, 0.015, 0.022, 0.03, 0.039, 0.049, 0.06, 0.072, 0.086, 0.102,
          0.12, 0.145, 0.175, 0.21, 0.25, 0.3, 0.36, 0.43, 0.51, 0.6, 0.7, 0.8, 0.9]


def build_cut_face(bm, loop, uv_layer):
    """Rings from the cut outline in to the centre; UV.x = depth from the skin (m)."""
    c = sum((v.co for v in loop), Vector()) / len(loop)
    rings = [loop]
    depths = [[0.0] * len(loop)]
    for t in RING_T[1:]:
        ring, ds = [], []
        for v in loop:
            ring.append(bm.verts.new(v.co + (c - v.co) * t))
            ds.append((c - v.co).length * t)
        rings.append(ring)
        depths.append(ds)
    centre = bm.verts.new(c)
    cdepth = min((c - v.co).length for v in loop)
    faces = []
    n = len(loop)
    for k in range(len(rings) - 1):
        for j in range(n):
            j2 = (j + 1) % n
            f = bm.faces.new((rings[k][j], rings[k][j2], rings[k + 1][j2], rings[k + 1][j]))
            dd = (depths[k][j], depths[k][j2], depths[k + 1][j2], depths[k + 1][j])
            faces.append((f, dd))
    for j in range(n):
        j2 = (j + 1) % n
        f = bm.faces.new((rings[-1][j], rings[-1][j2], centre))
        faces.append((f, (depths[-1][j], depths[-1][j2], cdepth)))
    for f, dd in faces:
        f.material_index = 1
        for loop_, dv in zip(f.loops, dd):
            loop_[uv_layer].uv = (dv, 0.0)
    return c


def make_object(name, bm, mats):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for mt in mats:
        me.materials.append(mt)
    ob = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(ob)
    return ob


def build_whole(M):
    bm = bmesh.new()
    build_shell(bm, 0.0, 2 * math.pi, NPHI, closed=True)
    for f in bm.faces:
        f.smooth = True
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    return make_object("watermelon", bm, [M["rind"]])


def build_half(M, side):
    """side=+1: phi in [0, pi] (z >= 0); side=-1: phi in [pi, 2pi]. Cut plane z=0."""
    bm = bmesh.new()
    uv = bm.loops.layers.uv.new("UVMap")
    phi0 = 0.0 if side > 0 else math.pi
    half = NPHI // 2
    grid, north, south = build_shell(bm, phi0, phi0 + math.pi, half, closed=False)
    # Cut outline: meridian at phi0 (north->south) then meridian at phi0+pi (south->north).
    loop = [north] + [row[0] for row in grid] + [south] + [row[-1] for row in reversed(grid)]
    for f in bm.faces:
        f.smooth = True
        for l in f.loops:
            l[uv].uv = (-1.0, 0.0)
    c = build_cut_face(bm, loop, uv)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    for e in bm.edges:
        if len(e.link_faces) == 2 and e.link_faces[0].material_index != e.link_faces[1].material_index:
            e.smooth = False
    ob = make_object(f"half_{'a' if side > 0 else 'b'}", bm, [M["rind"], M["flesh"]])
    return ob, [v.co.copy() for v in []], c


def seed_mesh(name, length, width, thick, mat):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=28, v_segments=14, radius=1.0)
    for v in bm.verts:
        x, y, z = v.co
        taper = 1.0 - 0.42 * (x + 1.0) / 2.0  # narrow end at +x
        xs = x * (1.0 + 0.22 * max(x, 0.0))
        # Flat faces with a slightly thicker rim.
        zf = z * (0.75 + 0.25 * min(1.0, abs(y) * 1.3))
        v.co = Vector((xs * length / 2, y * width / 2 * taper, zf * thick / 2))
    for f in bm.faces:
        f.smooth = True
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    return me


def bead_mesh(mat):
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=20, v_segments=10, radius=1.0)
    for f in bm.faces:
        f.smooth = True
    me = bpy.data.meshes.new("bead")
    bm.to_mesh(me)
    bm.free()
    me.materials.append(mat)
    return me


_OUTLINE = []


def outline_point(c, s, side=None):
    """Point on the cut outline (plane z=0) nearest the ray from c at angle s."""
    if not _OUTLINE:
        for i in range(NU):
            u = math.pi * i / (NU - 1)
            for phi in (0.0, math.pi):
                q = surface_point(u, phi)
                _OUTLINE.append(Vector((q.x, q.y, 0.0)))
    best, bd = None, 9.0
    for q in _OUTLINE:
        a = math.atan2(q.y - c.y, q.x - c.x)
        d = abs((a - s + math.pi) % (2 * math.pi) - math.pi)
        if d < bd:
            best, bd = q, d
    return best


def dress_cut_face(ob, side, M, rng, seed_me, pale_me, bead_me):
    """Seeds in the loose ring about 2/3 out, a few pale immature seeds, juice beads."""
    c = Vector((0.0, 0.0, 0.0))
    inward = 1.0 if side > 0 else -1.0  # +z is into the flesh for half a
    kids = []

    def place(me, pos, ang, depth_into, tilt=0.0, scale=1.0):
        o = bpy.data.objects.new(me.name, me)
        bpy.context.scene.collection.objects.link(o)
        rot = Matrix.Rotation(ang, 4, "Z") @ Matrix.Rotation(tilt, 4, "X")
        o.matrix_world = ob.matrix_world @ (Matrix.Translation(Vector((pos.x, pos.y, inward * depth_into))) @ rot
                                            @ Matrix.Diagonal((scale, scale, scale, 1.0)))
        o.parent = ob
        o.matrix_parent_inverse = ob.matrix_world.inverted()
        kids.append(o)
        return o

    n_seeds = 70
    for k in range(n_seeds):
        s = (k + rng.uniform(-0.35, 0.35)) / n_seeds * 2 * math.pi
        if rng.random() < 0.15:
            continue
        frac = rng.gauss(0.6, 0.12)
        edge = outline_point(c, s, side)
        pos = c + (edge - c) * frac
        pos.x *= 0.97
        ang = s + math.pi + rng.uniform(-0.6, 0.6)  # narrow tip roughly toward the centre
        depth = rng.uniform(0.25, 0.85) * 0.0012
        tilt = rng.uniform(-0.25, 0.25) if rng.random() < 0.7 else rng.uniform(0.5, 1.1)
        place(seed_me, pos, ang, depth, tilt, rng.uniform(0.85, 1.12))
    for k in range(10):  # strays nearer the heart
        s = rng.uniform(0, 2 * math.pi)
        edge = outline_point(c, s, side)
        pos = c + (edge - c) * rng.uniform(0.25, 0.5)
        place(seed_me, pos, rng.uniform(0, 6.28), rng.uniform(0.4, 0.85) * 0.0012, rng.uniform(-0.3, 0.3),
              rng.uniform(0.8, 1.05))
    for k in range(14):
        s = rng.uniform(0, 2 * math.pi)
        edge = outline_point(c, s, side)
        pos = c + (edge - c) * rng.uniform(0.35, 0.7)
        place(pale_me, pos, rng.uniform(0, 6.28), 0.0002, rng.uniform(-0.2, 0.2), rng.uniform(0.6, 1.0))
    # Juice beads: a few clusters on the face.
    for _ in range(5):
        s = rng.uniform(0, 2 * math.pi)
        edge = outline_point(c, s, side)
        cpos = c + (edge - c) * rng.uniform(0.15, 0.8)
        for _ in range(rng.randint(2, 6)):
            r = rng.uniform(0.0006, 0.0022)
            pos = cpos + Vector((rng.gauss(0, 0.008), rng.gauss(0, 0.008), 0))
            o = bpy.data.objects.new("bead", bead_me)
            bpy.context.scene.collection.objects.link(o)
            o.matrix_world = ob.matrix_world @ Matrix.Translation(Vector((pos.x, pos.y, inward * r * 0.25))) \
                @ Matrix.Diagonal((r, r, r * 0.55, 1.0))
            o.parent = ob
            o.matrix_parent_inverse = ob.matrix_world.inverted()
    return kids


def build_stem(M, ob):
    pts = [Vector((A * 0.97, 0, 0)), Vector((A + 0.008, 0.001, 0.002)), Vector((A + 0.014, 0.003, 0.005))]
    cu = bpy.data.curves.new("stem", "CURVE")
    cu.dimensions = "3D"
    sp = cu.splines.new("POLY")
    sp.points.add(len(pts) - 1)
    for i, p in enumerate(pts):
        sp.points[i].co = (*p, 1.0)
        sp.points[i].radius = 1.0 - 0.35 * i / (len(pts) - 1)
    cu.bevel_depth = 0.0045
    cu.bevel_resolution = 4
    cu.use_fill_caps = True
    st = bpy.data.objects.new("stem", cu)
    bpy.context.scene.collection.objects.link(st)
    st.data.materials.append(M["stem"])
    st.parent = ob
    return st


# ---------------------------------------------------------------- stage


def lowest_z(ob):
    mw = ob.matrix_world
    return min((mw @ v.co).z for v in ob.data.vertices)


def stage(scene, M, size, samples, target, cam_loc, lens):
    # Seamless cove: floor running back into a curved wall.
    bm = bmesh.new()
    prof = []
    for i in range(30):
        prof.append((-3.0 + i * (3.0 + 0.9) / 29, 0.0))
    R = 0.8
    for i in range(1, 21):
        a = (math.pi / 2) * i / 20
        prof.append((0.9 + R * math.sin(a), R - R * math.cos(a)))
    prof.append((0.9 + R, 3.5))
    rows = []
    for yy, zz in prof:
        rows.append([bm.verts.new((xx, yy, zz)) for xx in (-4.0, -1.3, 1.3, 4.0)])
    for i in range(len(rows) - 1):
        for j in range(3):
            bm.faces.new((rows[i][j], rows[i][j + 1], rows[i + 1][j + 1], rows[i + 1][j]))
    for f in bm.faces:
        f.smooth = True
    make_object("backdrop", bm, [M["backdrop"]])

    world = bpy.data.worlds.new("world")
    scene.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes.get("Background")
    bg.inputs["Color"].default_value = (0.92, 0.86, 0.78, 1.0)
    bg.inputs["Strength"].default_value = 0.18

    def area(name, loc, size_, energy, color=(1.0, 0.97, 0.92)):
        ld = bpy.data.lights.new(name, "AREA")
        ld.shape = "DISK"
        ld.size = size_
        ld.energy = energy
        ld.color = color
        lo = bpy.data.objects.new(name, ld)
        scene.collection.objects.link(lo)
        lo.location = loc
        lo.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        return lo

    area("key", (-1.15, -0.75, 1.35), 1.0, 150.0)
    area("fill", (1.5, -1.3, 0.45), 2.0, 14.0, (0.95, 0.97, 1.0))
    area("rim", (0.7, 1.0, 0.75), 0.6, 55.0)

    cd = bpy.data.cameras.new("cam")
    cd.lens = lens
    cd.dof.use_dof = True
    cd.dof.aperture_fstop = 8.0
    cam = bpy.data.objects.new("cam", cd)
    scene.collection.objects.link(cam)
    cam.location = cam_loc
    cam.rotation_euler = (Vector(target) - Vector(cam_loc)).to_track_quat("-Z", "Y").to_euler()
    cd.dof.focus_distance = (Vector(target) - Vector(cam_loc)).length
    scene.camera = cam

    w, h = size
    r = scene.render
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    r.engine = "CYCLES"
    r.image_settings.file_format = "PNG"
    c = scene.cycles
    c.device = "CPU"
    c.samples = samples
    c.use_adaptive_sampling = True
    c.adaptive_threshold = 0.03
    c.use_denoising = True
    c.max_bounces = 8
    c.diffuse_bounces = 3
    c.glossy_bounces = 4
    c.transmission_bounces = 8
    c.transparent_max_bounces = 8
    c.caustics_reflective = False
    c.caustics_refractive = False
    r.threads_mode = "FIXED"
    r.threads = 2
    scene.view_settings.view_transform = "AgX"
    scene.view_settings.look = "AgX - Punchy"


def shot_whole(scene, M, args):
    ob = build_whole(M)
    build_stem(M, ob)
    ob.rotation_euler = (0.0, 0.0, math.radians(-38))
    bpy.context.view_layer.update()
    ob.location.z = -lowest_z(ob) - 0.0015
    stage(scene, M, args.size, args.samples, target=(0.0, 0.0, 0.105), cam_loc=(-0.3, -1.3, 0.66), lens=80)


def place_half(ob, n_world, side):
    n = Vector(n_world).normalized()
    L = n.cross(Vector((0, 0, 1))).normalized()
    Z = -n if side > 0 else n  # half a's cut face points to local -z
    X = L
    Y = Z.cross(X)
    rot = Matrix((X, Y, Z)).transposed().to_4x4()
    ob.matrix_world = rot


def shot_cut(scene, M, args):
    rng = random.Random(args.seed)
    seed_me = seed_mesh("seed", 0.0115, 0.0072, 0.0024, M["seed"])
    pale_me = seed_mesh("pale_seed", 0.006, 0.0036, 0.0008, M["pale_seed"])
    bead_me = bead_mesh(M["juice"])
    a, _, _ = build_half(M, +1)
    b, _, _ = build_half(M, -1)
    place_half(a, (0.42, -0.62, 0.66), +1)
    place_half(b, (-0.12, -0.72, 0.68), -1)
    bpy.context.view_layer.update()
    for ob, x in ((a, -0.18), (b, 0.18)):
        ob.matrix_world.translation = Vector((x, 0.0, 0.0))
        bpy.context.view_layer.update()
        ob.matrix_world.translation.z = -lowest_z(ob) - 0.0015
        bpy.context.view_layer.update()
    dress_cut_face(a, +1, M, rng, seed_me, pale_me, bead_me)
    dress_cut_face(b, -1, M, rng, seed_me, pale_me, bead_me)
    stage(scene, M, args.size, args.samples, target=(0.0, 0.0, 0.08), cam_loc=(0.0, -1.55, 0.75), lens=70)


def main():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument("--shot", choices=["whole", "cut"], required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--samples", type=int, default=80)
    ap.add_argument("--size", default="1600x1000")
    ap.add_argument("--seed", type=int, default=7)
    ap.add_argument("--blend", help="also save the .blend here")
    args = ap.parse_args(argv)
    args.size = tuple(int(v) for v in args.size.split("x"))

    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    M = {
        "rind": mat_rind(),
        "flesh": mat_flesh(),
        "seed": mat_seed(),
        "pale_seed": mat_pale_seed(),
        "juice": mat_juice(),
        "stem": mat_stem(),
        "backdrop": mat_backdrop(),
    }
    (shot_whole if args.shot == "whole" else shot_cut)(scene, M, args)
    if args.blend:
        bpy.ops.wm.save_as_mainfile(filepath=args.blend)
    scene.render.filepath = args.out
    bpy.ops.render.render(write_still=True)
    print("wrote", args.out)


main()
