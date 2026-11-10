# Animatic v1 review (2026-11-10)

Scope: a coded animatic of the healthy-watermelon-soda site, 27 s at 1920x1080, every frame drawn in code (three.js melon, seeds, juice, glass; DOM type).

Checked: `hyperframes check` passes (0 errors). Warnings kept on purpose:
- film_silent: the site has no sound, so the animatic is silent. Add a music bed only if it goes to a client as a pitch film.
- text_below_floor: the CTA (20 px) and How body (24 px) use the site's real sizes. Kept so the animatic shows the site as it will ship.

Weak spots seen in frames:
- Rind reads as a regular zebra pattern; real melons are more irregular and mottled.
- Liquid is a flat pink, glass has no real refraction (a transparent canvas has nothing to refract).
- Bubbles draw over the wedge (depthTest off so they show through the liquid).
- 3D frames render on software GL in this workspace: 7 min for 27 s.
