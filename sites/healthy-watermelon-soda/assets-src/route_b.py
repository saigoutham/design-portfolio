# Route B: rendered "The Cut". Run: python3 assets-src/route_b.py  (from site root)
import bpy, bmesh, math, os, random
from mathutils import Vector, geometry
random.seed(7)
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, "assets-src/fonts/BricolageGrotesque-800.ttf")
OUT = os.path.join(ROOT, "docs/art/route-b-still.png")
SAMPLES = int(os.environ.get("SAMPLES", 80))
SIZE, DEPTH, SPREAD, GAP = 2.0, 0.9, 34, 0.1

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
def hexc(h, a=1):
    h = h.lstrip('#'); r = [int(h[i:i+2], 16)/255 for i in (0, 2, 4)]
    r = [(c/12.92 if c <= 0.04045 else ((c+0.055)/1.055)**2.4) for c in r]
    return (*r, a)

# ---------- text ----------
def make_text(s):
    c = bpy.data.curves.new("t", 'FONT'); c.body = s
    c.font = bpy.data.fonts.load(FONT); c.size = SIZE
    c.extrude = DEPTH/2; c.bevel_depth = 0.025; c.bevel_resolution = 3
    c.align_x = 'LEFT'
    o = bpy.data.objects.new("t_"+s, c); scene.collection.objects.link(o); return o
def mesh_of(o):
    dg = bpy.context.evaluated_depsgraph_get()
    me = bpy.data.meshes.new_from_object(o.evaluated_get(dg))
    n = bpy.data.objects.new("w", me); scene.collection.objects.link(n); return n
t_all = make_text("WATERMELON"); t_pre = make_text("WATERM"); t_pre2 = make_text("WATER")
bpy.context.view_layer.update()
def width(o): return o.dimensions.x
# cut through the middle of the letter M
xcut_raw = width(t_pre) + float(os.environ.get('STEM', 0.3))  # through the E stem: big cut face
W = width(t_all)
word = mesh_of(t_all)
for o in (t_all, t_pre, t_pre2): bpy.data.objects.remove(o)
# centre word, stand it up (face toward -Y), base on floor
me = word.data
bb = [Vector(v) for v in word.bound_box]
cx = (min(v.x for v in bb)+max(v.x for v in bb))/2
cz = min(v.z for v in bb)
cy = (min(v.y for v in bb)+max(v.y for v in bb))/2
for v in me.vertices: v.co -= Vector((cx, 0, 0))
xcut = xcut_raw - cx
# text lies in XY w/ extrude on Z: stand up
word.rotation_euler = (math.radians(90), 0, 0)
bpy.context.view_layer.objects.active = word; word.select_set(True)
bpy.ops.object.transform_apply(rotation=True)
for v in me.vertices: v.co.y = v.co.y; 
zmin = min(v.co.z for v in me.vertices); ymid = sum(v.co.y for v in me.vertices)/len(me.vertices)
for v in me.vertices: v.co += Vector((-xcut, -ymid, -zmin))   # cut plane now at x=0
print("word width", W, "height", SIZE)

# ---------- materials ----------
def principled(name):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes["Principled BSDF"]; return m, nt, b
def setp(b, **kw):
    for k, v in kw.items():
        if k in b.inputs: b.inputs[k].default_value = v
rind, nt, b = principled("rind")
tc = nt.nodes.new("ShaderNodeTexCoord"); mp = nt.nodes.new("ShaderNodeMapping")
mp.inputs["Scale"].default_value = (7, 1.2, 0.5)   # stripes run along Z, wobbly
n1 = nt.nodes.new("ShaderNodeTexNoise"); n1.inputs["Scale"].default_value = 3.2; n1.inputs["Detail"].default_value = 6; n1.inputs["Distortion"].default_value = 0.6
w1 = nt.nodes.new("ShaderNodeTexWave"); w1.inputs["Scale"].default_value = 5; w1.inputs["Distortion"].default_value = 6; w1.inputs["Detail"].default_value = 3
cr = nt.nodes.new("ShaderNodeValToRGB")
cr.color_ramp.elements[0].position = 0.35; cr.color_ramp.elements[0].color = hexc("#0F3A1F")
cr.color_ramp.elements[1].position = 0.65; cr.color_ramp.elements[1].color = hexc("#2E7D43")
mx = nt.nodes.new("ShaderNodeMix"); mx.data_type = 'RGBA'
mx.inputs[0].default_value = 0.55
mx.inputs[6].default_value = hexc("#1E5631")
nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
nt.links.new(mp.outputs["Vector"], w1.inputs["Vector"]); nt.links.new(tc.outputs["Object"], n1.inputs["Vector"])
nt.links.new(n1.outputs["Fac"], cr.inputs["Fac"])
nt.links.new(cr.outputs["Color"], mx.inputs[7])
nt.links.new(mx.outputs[2], b.inputs["Base Color"])
setp(b, Roughness=0.32, **{"Coat Weight": 0.8, "Coat Roughness": 0.05, "Specular IOR Level": 0.6})
bump = nt.nodes.new("ShaderNodeBump"); bump.inputs["Strength"].default_value = 0.08
nt.links.new(w1.outputs["Fac"], bump.inputs["Height"]); nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])

flesh, nt, b = principled("flesh")
tc = nt.nodes.new("ShaderNodeTexCoord")
n = nt.nodes.new("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = 3; n.inputs["Detail"].default_value = 4
cr = nt.nodes.new("ShaderNodeValToRGB")
cr.color_ramp.elements[0].color = hexc("#C41E3A"); cr.color_ramp.elements[1].color = hexc("#E8344E")
cr.color_ramp.elements[0].position = 0.3; cr.color_ramp.elements[1].position = 0.7
vo = nt.nodes.new("ShaderNodeTexVoronoi"); vo.inputs["Scale"].default_value = 160
bm_ = nt.nodes.new("ShaderNodeBump"); bm_.inputs["Strength"].default_value = 0.15; bm_.inputs["Distance"].default_value = 0.01
nt.links.new(tc.outputs["Object"], n.inputs["Vector"]); nt.links.new(tc.outputs["Object"], vo.inputs["Vector"])
nt.links.new(n.outputs["Fac"], cr.inputs["Fac"]); nt.links.new(cr.outputs["Color"], b.inputs["Base Color"])
nt.links.new(vo.outputs["Distance"], bm_.inputs["Height"]); nt.links.new(bm_.outputs["Normal"], b.inputs["Normal"])
setp(b, Roughness=0.25, **{"Subsurface Weight": 0.6, "Coat Weight": 1.0, "Coat Roughness": 0.03})
setp(b, **{"Subsurface Radius": (1.0, 0.25, 0.2), "Subsurface Scale": 0.15})

band, nt, b = principled("band"); setp(b, **{"Base Color": hexc("#DDEBC8"), "Roughness": 0.35, "Coat Weight": 0.6})
seedm, nt, b = principled("seed"); setp(b, **{"Base Color": hexc("#2A0E12"), "Roughness": 0.12, "Coat Weight": 1.0})

# ---------- boolean cut into halves ----------
def half(side):
    o = word.copy(); o.data = word.data.copy(); scene.collection.objects.link(o)
    box = bpy.data.objects.new("box", bpy.data.meshes.new("box")); scene.collection.objects.link(box)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1); bm.to_mesh(box.data); bm.free()
    box.scale = (60, 60, 60); box.location = (-side*30, 0, 0)  # side=-1 -> keeps x<0
    box.location.x = side*30 * -1 if False else (-30 if side < 0 else 30)
    md = o.modifiers.new("b", 'BOOLEAN'); md.operation = 'INTERSECT'; md.object = box; md.solver = 'EXACT'
    bpy.context.view_layer.objects.active = o; o.select_set(True)
    bpy.ops.object.modifier_apply(modifier="b"); bpy.data.objects.remove(box)
    me = o.data
    me.materials.clear()
    for m in (rind, flesh, band, seedm): me.materials.append(m)
    bm = bmesh.new(); bm.from_mesh(me); bm.faces.ensure_lookup_table()
    cut = [f for f in bm.faces if abs(f.normal.x) > 0.99 and all(abs(v.co.x) < 1e-4 for v in f.verts)]
    for f in bm.faces: f.material_index = 0
    for f in cut: f.material_index = 1
    ring = bmesh.ops.inset_region(bm, faces=cut, thickness=0.05, depth=0, use_even_offset=True)["faces"]
    for f in ring: f.material_index = 2
    inner = [f for f in bm.faces if f.material_index == 1]
    pts = []
    for f in inner:
        for tri in geometry.tessellate_polygon([[v.co.copy() for v in f.verts]]):
            pts.append([f.verts[i].co.copy() for i in tri])
    bm.to_mesh(me); bm.free()
    return o, pts, (1 if side < 0 else -1)
halves = []
for side in (-1, 1):
    o, tris, nx = half(side)
    # seeds on cut face
    area = lambda t: ((t[1]-t[0]).cross(t[2]-t[0])).length/2
    placed = []
    for _ in range(400):
        if len(placed) >= 9: break
        t = random.choices(tris, weights=[area(t) for t in tris])[0]
        a, c = random.random(), random.random()
        if a + c > 1: a, c = 1-a, 1-c
        p = t[0] + (t[1]-t[0])*a + (t[2]-t[0])*c
        if any((p-q).length < 0.3 for q in placed): continue
        # keep away from boundary: check via triangle edges roughly
        placed.append(p)
    for p in placed:
        bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1, location=(0, 0, 0))
        s = bpy.context.active_object; s.data.materials.append(seedm)
        s.scale = (0.012, 0.045, 0.085); s.rotation_euler = (random.uniform(-.3, .3), 0, random.uniform(-.5, .5))
        s.location = Vector((0.004*nx*-1+0.0, p.y, p.z)); s.location.x = 0.0
        s.parent = o
        # taper to teardrop
        bpy.ops.object.shade_smooth()
    # part halves: pivot at cut line, open like a book toward camera
    ang = math.radians(SPREAD) * (-1 if nx > 0 else 1)
    o.rotation_euler = (0, 0, ang); o.location.x = GAP * (-1 if nx > 0 else 1)
    halves.append(o)
bpy.data.objects.remove(word)

# floating seeds between halves
for i, (x, y, z, r) in enumerate([(-0.05, -0.6, 3.0, 1), (0.2, -0.9, 2.4, .8), (-0.25, -0.4, 3.7, .9), (0.1, -0.8, 1.6, .7), (0.3, -0.5, 3.3, .8)]):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, radius=1, location=(x, y, z))
    s = bpy.context.active_object; s.data.materials.append(seedm)
    s.scale = (0.045*r, 0.03*r, 0.085*r); s.rotation_euler = (random.uniform(-.6, .6), random.uniform(-.6, .6), random.uniform(-.6, .6))
    bpy.ops.object.shade_smooth()

# ---------- backdrop (curved sweep, two colours split at x=0) ----------
me = bpy.data.meshes.new("bg"); bm = bmesh.new()
bmesh.ops.create_grid(bm, x_segments=2, y_segments=120, size=1)
bm.verts.ensure_lookup_table()
for v in bm.verts:
    v.co.x *= 40; t = (v.co.y*40 + 40)/80*80 - 40   # y from -40..40
    y = t; R = 6.0; y0 = 5.0
    if y <= y0: v.co.y, v.co.z = y, 0
    elif y <= y0 + R*math.pi/2:
        a = (y-y0)/R; v.co.y, v.co.z = y0 + R*math.sin(a), R - R*math.cos(a)
    else: v.co.y, v.co.z = y0 + R + (y-y0-R*math.pi/2)*0, R + (y-y0-R*math.pi/2)
bm.to_mesh(me); bm.free()
bg = bpy.data.objects.new("bg", me); scene.collection.objects.link(bg)
for p in me.polygons: p.use_smooth = True
m, nt, b = principled("bg")
g = nt.nodes.new("ShaderNodeNewGeometry"); sp = nt.nodes.new("ShaderNodeSeparateXYZ")
gt = nt.nodes.new("ShaderNodeMath"); gt.operation = 'GREATER_THAN'; gt.inputs[1].default_value = 0.0
mix = nt.nodes.new("ShaderNodeMix"); mix.data_type = 'RGBA'
mix.inputs[6].default_value = hexc("#DDEBC8"); mix.inputs[7].default_value = hexc("#FFF0F2")
nt.links.new(g.outputs["Position"], sp.inputs[0]); nt.links.new(sp.outputs["X"], gt.inputs[0])
nt.links.new(gt.outputs[0], mix.inputs[0]); nt.links.new(mix.outputs[2], b.inputs["Base Color"])
setp(b, Roughness=0.8); bg.data.materials.append(m)

# ---------- lights ----------
def area(name, loc, size, energy, col=(1, 1, 1), target=Vector((0, 0, 1.2))):
    l = bpy.data.lights.new(name, 'AREA'); l.energy = energy; l.size = size; l.color = col
    o = bpy.data.objects.new(name, l); scene.collection.objects.link(o); o.location = loc
    d = target - Vector(loc); o.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler(); return o
area("key", (-7, -9, 9), 8, 700, (1, .97, .94))
area("rimR", (8, 5, 5), 2.5, 600, (1, 1, 1))
area("rimL", (-8, 4, 4), 2, 300, (1, .98, .95))
area("fill", (6, -10, 2.5), 10, 160, (1, .95, .96))
w = bpy.data.worlds.new("w"); scene.world = w; w.use_nodes = True
w.node_tree.nodes["Background"].inputs[0].default_value = hexc("#F4F6EA"); w.node_tree.nodes["Background"].inputs[1].default_value = 0.2

# ---------- camera ----------
cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam")); scene.collection.objects.link(cam); scene.camera = cam
cam.data.lens = 55; cam.data.dof.use_dof = True; cam.data.dof.focus_distance = 17; cam.data.dof.aperture_fstop = 11
cam.location = (1.8, -16.0, 3.4)
tgt = Vector((0, 0, 1.0)); cam.rotation_euler = (tgt - cam.location).to_track_quat('-Z', 'Y').to_euler()

# ---------- render ----------
scene.render.engine = 'CYCLES'; c = scene.cycles; c.device = 'CPU'; c.samples = SAMPLES
c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'; c.max_bounces = 6; c.glossy_bounces = 4; c.caustics_reflective = False; c.caustics_refractive = False
scene.render.threads_mode = 'FIXED'; scene.render.threads = 2
scene.render.resolution_x, scene.render.resolution_y, scene.render.resolution_percentage = 1600, 1000, 100
scene.view_settings.view_transform = 'AgX' if 'AgX' in scene.view_settings.bl_rna.properties['view_transform'].enum_items else 'Standard'
scene.view_settings.look = 'None'
scene.render.filepath = OUT; scene.render.image_settings.file_format = 'PNG'
os.makedirs(os.path.dirname(OUT), exist_ok=True)
bpy.ops.render.render(write_still=True)
