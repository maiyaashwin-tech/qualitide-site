# qualitidestudio.com

The Qualitide website. Static files only, no build step.

- index.html: the whole site (styles and scripts inline)
- terms.html, privacy.html: legal pages linked from the footer and the brief form
- web/: the films (*.mp4) and their posters (*.jpg); reel_m.mp4 is the lighter hero film for phones
- _headers: caching for the films (Netlify and Cloudflare Pages both read it)

Hosting: build command empty, output / publish directory "/".
Before launch: set INTAKE_URL in index.html once the intake Worker is deployed; update SEATS_TAKEN as seats sell.

Unzipping: the site comes in 5 zips. Unzip all of them into the same folder (say "yes" to merging the web folder); you then have index.html plus web/ with 11 films and 11 posters.
