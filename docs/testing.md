# Running the site checks

The site has no `package.json`, because a root `package.json` could change how Vercel
builds the static site. Install test-only tools outside the repo and point `NODE_PATH`
at them.

```bash
mkdir -p ~/magnolia-qa-tools && cd ~/magnolia-qa-tools
npm init -y
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install playwright@1.55.0 sharp@0.33.5
```

The checks use the installed Microsoft Edge (`PLAYWRIGHT_CHANNEL=msedge`, the default).
`check-final-acceptance.cjs` also needs ripgrep (`rg`) on `PATH`.

```bash
node tools/static-server.cjs 3017
```

In a second terminal, from the repo root:

```bash
node tools/check-resource-pages.cjs
NODE_PATH=~/magnolia-qa-tools/node_modules node tools/check-navigation.cjs
MAGNOLIA_FINAL_QA_DIR=/tmp/magnolia-final-qa NODE_PATH=~/magnolia-qa-tools/node_modules node tools/check-final-acceptance.cjs
```

Set `MAGNOLIA_FINAL_QA_DIR` so the run does not overwrite the evidence in
`qa/final-acceptance/`. The WebKit smoke test reports NOT TESTED unless the Playwright
WebKit browser is installed (`npx playwright install webkit`).

After editing `assets/js/resources-data.js` or the sitemap list, run
`node tools/generate-resource-pages.cjs`. It rewrites the resource pages and `sitemap.xml`.
