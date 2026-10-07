# atomus.io (static copy of the Webflow site)

The current atomus.io page exported from Webflow and hosted as plain static files on Cloudflare Pages. Same design, animations and interactions; no Webflow account needed.

- `public/index.html`: the page.
- `public/assets/`: the Webflow CSS and interactions runtime (`webflow.js`), jQuery, fonts and images. Everything that used to load from Webflow's CDN now loads from here.
- GSAP, ScrollTrigger, Matter.js and the StanVision library scripts and GIFs still load from jsDelivr and cdnjs, as before.

Cloudflare Pages settings: root directory `sites/atomus-io`, framework preset None, no build command, build output directory `public`.

To change copy, edit `public/index.html` directly.
