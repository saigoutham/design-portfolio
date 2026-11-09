# Research: Healthy Watermelon Soda

Stage 2, 2026-11-10. Reads: docs/brief.md, PRODUCT.md, system/lessons.md. Sources are listed at the end of each lane. Findings only; no raw scrapes kept.

## 1. Audience

Two audiences: Awwwards jurors first, and the Indian Gen Z drinker the concept brand speaks to.

- **The category is real and moving.** Zero- and low-sugar drink sales in India hit a five-year high in 2025, led by Gen Z (lapaas / indiabusinesstrade). Mintel's India 2026 report says the winners will be taste-first and multisensory, and that brands should "capture Gen Z's attention by offering interactive experiences". That is an argument for an interactive site, not only a pretty one.
- **The tone that works is fun, not diet.** Gen Z shuns sugar but doesn't connect with calorie counting or diet culture (ThePrint, March 2026). Misfits found that people link "healthy drink" with compromised taste and no personality. So the site must feel indulgent and playful; nutrition stays in the background.
- **Transparency earns trust.** Misfits publishes lab tests on its site, which no other Indian soda brand does. For a concept brand the honest version is: no invented numbers at all, and a plain "concept" label.
- **The claim wall.** FSSAI "sugar-free" means at most 0.5 g of total sugars per 100 ml, natural sugars included. The site uses "no added sugar" plus "contains naturally occurring sugars".

## 2. Competitors: the sameness map (own track, from Awwwards and press, no scraping)

Beverage sites that place on Awwwards (Johnny Dirty Soda, YOOY Drinks, DO YOU g?, Mahou x Squid Game, Done Drinks, Drink Cann, Seedlip), and the approved PERKFORM site in scroll-craft's collection, repeat the same moves:

| Move | How common |
|---|---|
| A product can or bottle as the hero, spinning or floating | Nearly all |
| Fruit slices floating in parallax at different speeds | Most fruit or juice sites |
| A liquid splash around the can | Common (PERKFORM: the can travels through a coffee splash) |
| Bold flat brand colour per flavour, swapped by a carousel | Common |
| Flavour carousel, then a shop grid | Nearly all real brands |

**The opening:** none of them makes the fruit the hero, and none makes the visitor *do* the transformation. The can is always the object; fruit is garnish. Our signature (scroll slices a real watermelon, which becomes soda) attacks exactly that.

**Indian healthy-soda brands** (Misfits, DRIX, Bubz, Hadō, Chini Kum, Paper Boat Zero) sell on prebiotic fibre and gut health. None leads with a single real fruit. "Real watermelon" is a free lane.

## 3. Taste: exact values from references

From the MotionSites examples (closest: `3d-collectible-hero.md`, `mostar-guide.md`) and scroll-craft's approved collection. Values to learn from, not to copy:

**3D Collectible Hero** (object-as-hero, colour per item)
- Ghost display word behind the object: Anton, `clamp(90px, 28vw, 380px)`, tracking `-0.02em`, line-height 1. The object overlaps the type, which gives depth without extra 3D.
- All state changes move together: 650 ms, `cubic-bezier(0.4, 0, 0.2, 1)`.
- Grain overlay: fractal noise at 0.08 inside the SVG, container opacity 0.4, 200 px tile. Kills the flat-render look cheaply.
- The object is scaled 1.68 on desktop and 1.25 on mobile, and repositioned for mobile rather than shrunk.

**Mostar Guide** (cinematic sticky scroll, one stage)
- One sticky stage, `height: calc(100vh + 3700px)`: the whole story is about 4.7 viewports of scroll. A good length band for one scene.
- Display serif title at 14rem, line-height 0.78: very tight leading reads as confident.
- Body copy at 1.14–1.18rem, weight 500, line-height 1.18, with a soft text shadow (`0 2px 18px rgba(0,0,0,0.42)`) to stay readable over imagery.
- Panels fade in with a 58 px rise; horizontal moves use 640 ms `cubic-bezier(0.22, 1, 0.36, 1)`.

**scroll-craft approved collection** (the standard, not a template)
- Write a layer contract before making assets: far environment, focal subject, near foreground, atmosphere, typography. Only use the planes the scene needs.
- Write the opening, midpoint and resolved exit in plain words; scroll must change a spatial relationship ("whole becomes open, open becomes soda").
- An invented brand still needs an honest, complete visitor flow for its state.
- WebGL must have exact desktop and phone posters as fallbacks, cap pixel density, and pause offscreen.
- Mobile is art-directed separately, checked at a typical phone and at 360 × 640.

## 4. Technique (notes only)

- **Unseen Studio, Superlist** (Awwwards SOTD and SOTM, FWA SOTD): bespoke 3D tied to scroll, kept fast with baked animations and lightweight matcap textures. This is the performance route for our watermelon: bake the slice in Blender, play it back by scroll, light it cheaply.
- **Unseen Studio, Casa di Solare:** an intro scroll WebGL scene with a liquid simulation. Shows the fizz can be a shader on the cut face rather than a real fluid sim.
- REA on one effect: skipped (time budget; the two notes above answer the "how").

## 5. Lessons carried forward (system/lessons.md)

- Diwali: code-drawn art and one-agent builds produced a prototype-grade hero. Here: the watermelon is a Blender model with photo textures, built and reviewed as its own track, and run through the quality-floor check before anyone sees it.

## Three opportunities

1. **Make the fruit the hero and the visitor the cause.** Every beverage site shows a can; none lets you open the fruit. The slice-by-scroll is the whole idea, and it answers Mintel's "interactive, multisensory" call. *This is the one to build the concept on.*
2. **"Real watermelon" as the brand lane.** Indian healthy sodas all sell gut health; none owns a single real fruit. Copy and visuals stay on watermelon, never on fibre or gut claims we can't back.
3. **Be fast enough to be fun on a phone.** Juror usability scores sink with heavy WebGL (The Spark won SOTD at 7.29 with Usability at 6.58, the lowest of its four scores). Baked animation, matcaps, a capped DPR and a real phone poster can make this one of the few 3D drink sites that's smooth on a mid-range Android.

## Sources
- Awwwards: Johnny Dirty Soda, DO YOU g? (HM Aug 2026), YOOY Drinks, Mahou x Squid Game, Done Drinks, The Spark (SOTD 7.29), Casa di Solare element; unseen.co/projects/superlist
- yourstory.com (Misfits, Oct 2025); restaurantindia.in (DRIX); mediainfoline.com (Bubz, Chini Kum); indianretailer.com (Hadō); klinegroup.com (Paper Boat Zero)
- store.mintel.com (India Non-alcoholic Beverage Trends 2026); theprint.in (Gen Z and zero-sugar, Mar 2026); voice.lapaas.com (2025 zero-sugar sales)
- kashmiril.com and adgully.com (FSSAI sugar claims)
- library/motionsites/examples (3d-collectible-hero, mostar-guide); library/scroll-craft/references/approved-collection.md
