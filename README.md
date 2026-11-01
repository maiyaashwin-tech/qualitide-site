# qualitidestudio.com

The Qualitide website. Static files only, no build step.

- index.html: the homepage (styles and scripts inline): launch films + monthly motion, pricing sliders, details, free storyboard form
- work.html: the films page (all samples, filters, lightbox)
- terms.html, privacy.html: legal pages linked from the footer and the brief form
- web/: the films (*.mp4) and their posters (*.jpg); reel_m.mp4 is the lighter hero film for phones
- _headers: caching for the films (Netlify and Cloudflare Pages both read it)

Hosting: build command empty, output / publish directory "/".
The free storyboard form posts to the intake Apps Script (INTAKE_URL in index.html). Visitor counts: GoatCounter (cookie-free), code `qualitide`.
Prices must match `studio/PRICES.md` in qualitide-intake (monthly: 4 = $900, 6 = $1,500, 8 = $2,000, +$200 a reel up to 24).

Unzipping: the site comes in 5 zips. Unzip all of them into the same folder (say "yes" to merging the web folder); you then have index.html plus web/ with 11 films and 11 posters.
