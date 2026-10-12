# STAR Plus Matka — mobile website starter

## What is included
- Responsive neon-style dashboard for phones and desktop
- 00–99 chart
- Three-digit sum calculator
- Random number picker
- Front-end checks `/api/results` every 60 seconds
- Backend proxy keeps any provider API key on the server, not in the public page

## Important
The dashboard starts with explicitly marked demo preview values. They are not real results.
Live results require a public/authorized provider that permits reuse and an endpoint schema that is adapted in `normalizeResults()`.

## Run locally
1. Install Node.js 18+.
2. In this folder run `npm install`.
3. Set `RESULT_API_URL` to the provider's documented JSON endpoint.
4. If required, set `RESULT_API_KEY` as a server environment variable.
5. Run `npm start` and open the shown local address.

## Hosting
This project includes a Node/Express backend. Static-only hosting such as Cloudflare Pages cannot run `server.js` as-is. Deploy the full app to a Node-capable free tier if available, or split the static site and backend into separate services. Check current free-tier limits before deploying; providers may change them.

Never put secret API keys in `public/index.html` or a public GitHub repository. Obtain written permission before republishing third-party results.
