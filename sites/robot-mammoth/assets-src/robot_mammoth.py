"""Robot mammoth: a polar survey machine, modelled as hard-surface parts in Blender.

Run headless:
  python3 assets-src/robot_mammoth.py --render lab/render/still.png [--samples 48] [--size 1440x900]
  python3 assets-src/robot_mammoth.py --glb public/models/robot-mammoth.glb

Blender axes: +x is where the head points, +y is the mammoth's left, +z is up. Metres.
Look (decided 2026-11-09): white ceramic armour, dark graphite joints, a segmented trunk,
titanium tusks, one amber light. Colours come from design-system/robot-mammoth/MASTER.md
where a token exists.
"""

import argparse
import math
import sys

import bpy  # must come first: it provides bmesh and mathutils
import bmesh  # noqa: E402
from mathutils import Euler, Vector  # noqa: E402

# ---------------------------------------------------------------- scene reset


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = "METRIC"
    return scene


# ---------------------------------------------------------------- materials


def srgb(hex_):
    h = hex_.lstrip("#")
    c = [int(h[i : i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


def principled(name, color, metallic=0.0, roughness=0.5, coat=0.0, coat_roughness=0.1, emission=None, strength=0.0):
    m = bpy.data.materials.new(name)
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = srgb(color)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    if "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = coat_roughness
    if emission:
        b.inputs["Emission Color"].default_value = srgb(emission)
        b.inputs["Emission Strength"].default_value = strength
    return m


def materials():
    return {
        # Ceramic armour sits a step below the snow's white so the two separate in light.
        "ceramic": principled("ceramic", "#EEF1F4", roughness=0.34, coat=0.35, coat_roughness=0.18),
        "graphite": principled("graphite", "#1F242B", metallic=0.55, roughness=0.42),
        "titanium": principled("titanium", "#B8BDC4", metallic=1.0, roughness=0.26),
        "ivory": principled("ivory", "#F2EEE6", roughness=0.28, coat=0.5, coat_roughness=0.1),
        "glass": principled("glass", "#05070A", roughness=0.04, coat=1.0, coat_roughness=0.02),
        "amber": principled("amber", "#B45309", emission="#FF8A1F", strength=18.0),  # MASTER accent
        "snow": principled("snow", "#F8FAFC", roughness=0.62),  # MASTER background
    }


# ---------------------------------------------------------------- mesh helpers

COLLECTION = None


def link(ob):
    COLLECTION.objects.link(ob)
    return ob


def mesh_object(name, bm, mat, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = smooth
    me.materials.append(mat)
    return link(bpy.data.objects.new(name, me))


def bevel(ob, width, segments=3, angle=35):
    m = ob.modifiers.new("bevel", "BEVEL")
    m.width = width
    m.segments = segments
    m.limit_method = "ANGLE"
    m.angle_limit = math.radians(angle)
    m.harden_normals = True
    return ob


def rbox(name, size, loc, mat, round_=0.08, rot=(0, 0, 0), segments=4):
    """A rounded box: the basic armour plate."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    bmesh.ops.scale(bm, vec=Vector(size), verts=bm.verts)
    ob = mesh_object(name, bm, mat)
    ob.location = loc
    ob.rotation_euler = Euler([math.radians(a) for a in rot])
    return bevel(ob, round_, segments)


def cyl(name, r, depth, loc, axis, mat, verts=40, round_=0.02, r2=None):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=depth)
    q = Vector((0, 0, 1)).rotation_difference(Vector(axis).normalized())
    bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=q.to_matrix())
    ob = mesh_object(name, bm, mat)
    ob.location = loc
    if round_:
        bevel(ob, round_, 2)
    return ob


def catmull(points, n):
    """Sample a Catmull-Rom curve through points: n positions and tangents."""
    pts = [Vector(p) for p in points]
    pts = [pts[0] * 2 - pts[1]] + pts + [pts[-1] * 2 - pts[-2]]
    segs = len(pts) - 3
    out = []
    for k in range(n):
        u = k / (n - 1) * segs
        i = min(int(u), segs - 1)
        t = u - i
        p0, p1, p2, p3 = pts[i : i + 4]
        t2, t3 = t * t, t * t * t
        pos = 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)
        tan = 0.5 * ((-p0 + p2) + 2 * (2 * p0 - 5 * p1 + 4 * p2 - p3) * t + 3 * (-p0 + 3 * p1 - 3 * p2 + p3) * t2)
        out.append((pos, tan.normalized()))
    return out


def tube(name, points, r0, r1, mat, n=64, sides=20, power=1.0):
    """A tapered tube along a curve: tusks and cables."""
    samples = catmull(points, n)
    bm = bmesh.new()
    rings = []
    ref = Vector((0, 0, 1))
    for k, (pos, tan) in enumerate(samples):
        t = k / (n - 1)
        r = r0 + (r1 - r0) * (t**power)
        side = tan.cross(ref)
        if side.length < 1e-4:
            side = tan.cross(Vector((0, 1, 0)))
        side.normalize()
        up = side.cross(tan).normalized()
        ring = []
        for j in range(sides):
            a = j / sides * math.tau
            ring.append(bm.verts.new(pos + (side * math.cos(a) + up * math.sin(a)) * r))
        rings.append(ring)
    for a, b in zip(rings, rings[1:]):
        for j in range(sides):
            bm.faces.new((a[j], a[(j + 1) % sides], b[(j + 1) % sides], b[j]))
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    return mesh_object(name, bm, mat)



def curve1d(pts, x):
    """Smooth value through (x, v) control points (Catmull-Rom)."""
    i = 0
    while i < len(pts) - 2 and x > pts[i + 1][0]:
        i += 1
    p0 = pts[max(0, i - 1)][1]
    p1 = pts[i][1]
    p2 = pts[i + 1][1]
    p3 = pts[min(len(pts) - 1, i + 2)][1]
    t = min(1.0, max(0.0, (x - pts[i][0]) / (pts[i + 1][0] - pts[i][0])))
    t2, t3 = t * t, t * t * t
    return 0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3)


# One continuous silhouette for the armour: high shoulder hump, back sloping to small
# hips. It is then cut into plates, so the outline stays an animal's while the seams
# say machine.
ARMOUR_TOP = [(-3.15, 2.7), (-2.7, 3.5), (-1.9, 3.95), (-0.8, 4.28), (0.4, 4.62), (1.3, 4.88), (2.05, 4.72), (2.6, 4.15)]
ARMOUR_HALF_WIDTH = [(-3.15, 0.75), (-2.6, 1.05), (-1.5, 1.16), (0.5, 1.24), (1.8, 1.22), (2.6, 0.95)]
ARMOUR_BOTTOM = 2.5


def armour_plate(name, x0, x1, mat, rings=28, sides=48, e=0.55):
    bm = bmesh.new()
    loops = []
    for i in range(rings + 1):
        x = x0 + (x1 - x0) * i / rings
        top = curve1d(ARMOUR_TOP, x)
        hw = curve1d(ARMOUR_HALF_WIDTH, x)
        mid = (top + ARMOUR_BOTTOM) / 2
        hh = (top - ARMOUR_BOTTOM) / 2
        ring = []
        for j in range(sides):
            a = j / sides * math.tau
            c, sn = math.cos(a), math.sin(a)
            y = hw * math.copysign(abs(c) ** e, c)
            z = mid + hh * math.copysign(abs(sn) ** e, sn)
            ring.append(bm.verts.new((x, y, z)))
        loops.append(ring)
    for a, b in zip(loops, loops[1:]):
        for j in range(sides):
            bm.faces.new((a[j], b[j], b[(j + 1) % sides], a[(j + 1) % sides]))
    bm.faces.new(list(reversed(loops[0])))
    bm.faces.new(loops[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_object(name, bm, mat)
    return bevel(ob, 0.05, 3, angle=50)


# ---------------------------------------------------------------- the machine


def build(M):
    parts = []
    add = parts.append

    # Frame and belly: the graphite skeleton that shows between plates. The body rides
    # high on long legs, shoulders above hips, so the back slopes like a mammoth's.
    add(rbox("frame", (4.4, 1.8, 1.5), (0.2, 0, 3.15), M["graphite"], 0.1, rot=(0, -4, 0)))
    add(rbox("belly", (3.4, 1.5, 0.45), (0.1, 0, 2.42), M["graphite"], 0.08, rot=(0, -4, 0)))

    # Armour: five plates cut from one silhouette, with small gaps between them.
    add(rbox("chest", (0.9, 2.0, 1.6), (2.3, 0, 3.15), M["ceramic"], 0.24, rot=(0, -14, 0)))
    cuts = [-3.15, -2.0, -0.75, 0.55, 1.6, 2.6]
    for k, (a, b) in enumerate(zip(cuts, cuts[1:])):
        add(armour_plate(f"armour_{k}", a + 0.025, b - 0.025, M["ceramic"]))

    for s in (1, -1):
        add(rbox(f"flank_{s}", (3.0, 0.1, 0.62), (0.1, 1.2 * s, 2.86), M["graphite"], 0.04))
        # Heat vents: five dark slots on each flank. Its breath leaves through these.
        for k in range(5):
            add(rbox(f"vent_{s}_{k}", (0.1, 0.06, 0.46), (-0.9 + k * 0.26, 1.26 * s, 2.86), M["ceramic"], 0.02, segments=2))

    # Neck: concertina rings.
    for k in range(3):
        add(cyl(f"neck_{k}", 0.72 - k * 0.04, 0.16, (2.6 + k * 0.2, 0, 3.85), (1, 0, 0), M["graphite"]))

    # Head: a high domed skull (its highest point, as on a real mammoth) and a sloping face.
    add(rbox("skull", (1.45, 1.5, 1.85), (3.4, 0, 4.42), M["ceramic"], 0.5, segments=6))
    add(rbox("face", (0.95, 1.25, 1.4), (4.02, 0, 3.52), M["ceramic"], 0.3, rot=(0, -24, 0), segments=5))
    add(rbox("visor", (0.32, 1.32, 0.2), (4.12, 0, 4.2), M["graphite"], 0.06, rot=(0, -24, 0)))
    add(rbox("status", (0.05, 0.26, 0.06), (4.27, 0, 4.22), M["amber"], 0.01, rot=(0, -24, 0), segments=2))  # the one amber light

    for s in (1, -1):
        # The lens: hex housing, dark glass.
        add(cyl(f"lens_housing_{s}", 0.21, 0.14, (3.76, 0.8 * s, 4.04), (0, s, 0), M["graphite"], verts=6, round_=0.015))
        add(cyl(f"lens_glass_{s}", 0.15, 0.05, (3.76, 0.88 * s, 4.04), (0, s, 0), M["glass"], round_=0.01))
        # Ears as radiator fins, small, as a mammoth's are.
        add(rbox(f"ear_{s}", (0.55, 0.12, 0.85), (2.92, 0.98 * s, 4.34), M["ceramic"], 0.05, rot=(0, 0, 14 * s)))
        for k in range(4):
            add(rbox(f"fin_{s}_{k}", (0.04, 0.05, 0.62), (2.74 + k * 0.12, 1.05 * s, 4.34), M["graphite"], 0.01, segments=2))

        # Tusks: titanium, sweeping down, out, then up and in. Graphite collar at the root.
        path = [(4.1, 0.5 * s, 3.05), (4.7, 0.72 * s, 2.35), (5.6, 0.98 * s, 1.95), (6.5, 0.95 * s, 2.35), (6.95, 0.7 * s, 3.2), (6.85, 0.35 * s, 3.85)]
        add(tube(f"tusk_{s}", path, 0.23, 0.012, M["ivory"], n=90, sides=28, power=0.8))
        add(cyl(f"tusk_sleeve_{s}", 0.245, 0.5, (4.3, 0.57 * s, 2.82), (0.6, 0.25 * s, -0.75), M["titanium"], round_=0.02))
        add(cyl(f"tusk_collar_{s}", 0.25, 0.22, (4.1, 0.5 * s, 3.05), (0.6, 0.25 * s, -0.75), M["graphite"]))

    # Trunk: tapering ceramic shells over a graphite cable core, like an industrial arm.
    trunk_path = [(4.3, 0, 3.25), (4.6, 0, 2.6), (4.7, 0, 1.8), (4.72, 0, 1.1), (4.9, 0, 0.62), (5.25, 0, 0.5), (5.45, 0, 0.75)]
    add(tube("trunk_core", trunk_path, 0.21, 0.08, M["graphite"], n=90, sides=16))
    shells = 22
    for k, (pos, tan) in enumerate(catmull(trunk_path, shells)):
        t = k / (shells - 1)
        r = 0.3 + (0.11 - 0.3) * t
        add(cyl(f"trunk_shell_{k}", r, 0.13, pos, tan, M["ceramic"], round_=0.025, r2=r * 0.88))

    # Legs: thick columns, as a mammoth's are. Ceramic thigh and shin shells, a graphite
    # knee drum and ankle, pistons behind the shin, a wide foot.
    # Hind legs are shorter, which is what tips the back down toward the tail.
    for x, thigh_z, thigh in ((1.6, 2.5, (1.0, 0.86, 1.5)), (-1.95, 2.3, (1.1, 0.88, 1.35))):
        knee_z = thigh_z - 0.86
        for s in (1, -1):
            y = 0.72 * s
            add(rbox(f"thigh_{x}_{s}", thigh, (x, y, thigh_z), M["ceramic"], 0.24, segments=5))
            add(cyl(f"knee_{x}_{s}", 0.36, 0.92, (x, y, knee_z), (0, 1, 0), M["graphite"]))
            shin_top = knee_z - 0.2
            shin_len = shin_top - 0.5
            add(cyl(f"shin_core_{x}_{s}", 0.3, shin_len + 0.3, (x, y, 0.45 + shin_len / 2), (0, 0, 1), M["graphite"], round_=0.03))
            add(cyl(f"shin_{x}_{s}", 0.44, shin_len * 0.78, (x, y, shin_top - shin_len * 0.39), (0, 0, 1), M["ceramic"], round_=0.08, r2=0.4))
            for dy in (0.22, -0.22):
                add(cyl(f"piston_{x}_{s}_{dy}", 0.05, shin_len, (x - 0.4, y + dy, 0.5 + shin_len / 2), (0, 0, 1), M["titanium"], verts=16, round_=0.0))
            add(cyl(f"ankle_{x}_{s}", 0.36, 0.16, (x, y, 0.45), (0, 0, 1), M["graphite"], round_=0.03))
            add(cyl(f"foot_{x}_{s}", 0.56, 0.36, (x, y, 0.21), (0, 0, 1), M["ceramic"], round_=0.07, r2=0.48))
            add(cyl(f"sole_{x}_{s}", 0.58, 0.06, (x, y, 0.03), (0, 0, 1), M["graphite"], round_=0.01))

    # Unit marking on the near haunch.
    txt = bpy.data.curves.new("unit_id", type="FONT")
    txt.body = "M-01  SURVEY"
    txt.size = 0.15
    txt.extrude = 0.004
    label = link(bpy.data.objects.new("unit_id", txt))
    label.data.materials.append(M["graphite"])
    label.location = (-2.55, -1.13, 3.0)
    label.rotation_euler = Euler((math.radians(90), 0, 0))
    add(label)

    # Tail: a short cable with a ceramic cap.
    add(tube("tail", [(-3.0, 0, 3.05), (-3.2, 0, 2.7), (-3.28, 0, 2.3)], 0.07, 0.05, M["graphite"], n=20, sides=12))
    add(cyl("tail_cap", 0.09, 0.14, (-3.29, 0, 2.25), (0, 0, 1), M["ceramic"]))
    return parts


# ---------------------------------------------------------------- stage


def stage_scene(scene, M, size, samples):
    # Snow ground with a low drift.
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=160, y_segments=160, size=40)
    ground = mesh_object("ground", bm, M["snow"])
    tex = bpy.data.textures.new("drift", type="CLOUDS")
    tex.noise_scale = 3.5
    d = ground.modifiers.new("drift", "DISPLACE")
    d.texture = tex
    d.strength = 0.35
    d.mid_level = 0.6

    world = bpy.data.worlds.new("sky")
    scene.world = world
    nt = world.node_tree
    bg = nt.nodes.get("Background")
    bg.inputs["Strength"].default_value = 0.75
    coord = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.0
    ramp.color_ramp.elements[0].color = srgb("#E9EEF5")  # MASTER muted: haze at the horizon
    ramp.color_ramp.elements[1].position = 0.6
    ramp.color_ramp.elements[1].color = srgb("#C7D3E0")
    nt.links.new(coord.outputs["Generated"], sep.inputs[0])
    nt.links.new(coord.outputs["Window"], sep.inputs[0])
    nt.links.new(sep.outputs["Y"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])

    sun_data = bpy.data.lights.new("sun", type="SUN")
    sun_data.energy = 4.4
    sun_data.color = (1.0, 0.95, 0.88)
    sun_data.angle = math.radians(2.0)
    sun = link(bpy.data.objects.new("sun", sun_data))
    sun.rotation_euler = Euler((math.radians(66), 0, math.radians(24)))

    cam_data = bpy.data.cameras.new("cam")
    cam_data.lens = 35
    cam = link(bpy.data.objects.new("cam", cam_data))
    cam.location = (10.6, -9.2, 1.7)
    direction = Vector((1.7, 0, 2.75)) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    scene.camera = cam

    w, h = size
    scene.render.resolution_x = w
    scene.render.resolution_y = h
    scene.render.engine = "CYCLES"
    scene.cycles.device = "CPU"
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.cycles.max_bounces = 6
    try:
        scene.view_settings.view_transform = "AgX"
        scene.view_settings.look = "AgX - Base Contrast"
    except Exception:
        pass


def main():
    argv = sys.argv[sys.argv.index("--") + 1 :] if "--" in sys.argv else sys.argv[1:]
    ap = argparse.ArgumentParser()
    ap.add_argument("--render")
    ap.add_argument("--glb")
    ap.add_argument("--samples", type=int, default=48)
    ap.add_argument("--size", default="1440x900")
    args = ap.parse_args(argv)

    global COLLECTION
    scene = reset()
    COLLECTION = bpy.data.collections.new("robot_mammoth")
    scene.collection.children.link(COLLECTION)
    M = materials()
    build(M)

    if args.glb:
        bpy.ops.export_scene.gltf(filepath=args.glb, export_format="GLB", export_apply=True, use_selection=False)
        print("wrote", args.glb)
    if args.render:
        w, h = (int(v) for v in args.size.split("x"))
        stage_scene(scene, M, (w, h), args.samples)
        scene.render.filepath = args.render
        bpy.ops.render.render(write_still=True)
        print("wrote", args.render)


main()
