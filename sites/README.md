# Sites

One folder per site, created with `npm run new-site -- <site> --client|--own`. Each folder is a standalone Next.js app with its own context files (PRODUCT.md, DESIGN.md, docs/). On Vercel, set the project's Root Directory to `sites/<site>`.

A site that lives in its own repo (`--repo <url>`) gets a pointer file here instead, `sites/<site>.md`, so `npm run status` still lists it.
