# Magnolia Static Website Deployment Guide

This guide deploys the static Magnolia Senior Care WA website to Vercel and connects:

`magnoliaseniorcarewa.com`

The site is plain HTML/CSS/JS, so no build step is required.

## 1. Push This Project To GitHub

### Option A: Put Only This Website In Its Own GitHub Repo

Recommended for clean deployment.

1. Create a new GitHub repository, for example:
   - `magnolia-senior-care-wa`

2. Copy the `afh-premium-website` folder contents into a new local repo folder.

3. Initialize Git:

```bash
git init
git add .
git commit -m "Initial Magnolia Senior Care WA website"
```

4. Add the GitHub remote:

```bash
git remote add origin https://github.com/YOUR-USERNAME/magnolia-senior-care-wa.git
git branch -M main
git push -u origin main
```

### Option B: Keep It Inside The Current Repo

If you keep this folder inside the current Cytrea repo:

1. Commit only the website folder:

```bash
git add afh-premium-website
git commit -m "Add Magnolia Senior Care WA static website"
git push
```

2. In Vercel, set the project root directory to:

```text
afh-premium-website
```

## 2. Deploy To Vercel

1. Go to `https://vercel.com`.
2. Click `Add New Project`.
3. Import the GitHub repo.
4. Configure project settings:
   - Framework preset: `Other`
   - Root directory:
     - If standalone repo: leave blank / root
     - If inside Cytrea repo: `afh-premium-website`
   - Build command: leave empty
   - Output directory: leave empty
   - Install command: leave empty
5. Click `Deploy`.
6. Open the temporary Vercel URL and test:
   - Homepage
   - Burien page
   - Des Moines page
   - Services
   - Gallery
   - Referrals
   - Contact
   - Blog template

## 3. Connect `magnoliaseniorcarewa.com`

1. In Vercel, open the Magnolia project.
2. Go to `Settings` -> `Domains`.
3. Add:

```text
magnoliaseniorcarewa.com
```

4. Also add:

```text
www.magnoliaseniorcarewa.com
```

5. Choose the primary domain.

Recommended primary:

```text
https://magnoliaseniorcarewa.com
```

6. Redirect `www` to the apex/root domain:

```text
www.magnoliaseniorcarewa.com -> magnoliaseniorcarewa.com
```

## 4. Set DNS Records

DNS settings depend on where the domain is registered.

### Apex Domain

For:

```text
magnoliaseniorcarewa.com
```

Add this `A` record:

```text
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto / Default
```

### WWW Subdomain

For:

```text
www.magnoliaseniorcarewa.com
```

Add this `CNAME` record:

```text
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto / Default
```

### DNS Cleanup

Remove conflicting records for the same host:

- Old `A` records for `@`
- Old `AAAA` records for `@`, unless Vercel specifically provides them
- Old `CNAME` records for `www`
- Parking records
- Forwarding records that conflict with Vercel

DNS can take a few minutes to 48 hours to fully propagate.

## 5. Redirect Old Domains To Correct Location Pages

Legacy location domains should use permanent redirects into the current Magnolia source-of-truth website.

Recommended redirect targets:

- Legacy Burien homepage -> `https://magnoliaseniorcarewa.com/burien-adult-family-home.html`
- Legacy Des Moines homepage -> `https://magnoliaseniorcarewa.com/des-moines-adult-family-home.html`
- Legacy about pages -> `https://magnoliaseniorcarewa.com/about.html`
- Legacy gallery pages -> `https://magnoliaseniorcarewa.com/rooms-photos.html`
- Legacy contact pages -> `https://magnoliaseniorcarewa.com/contact.html`

Use `301` permanent redirects if the old domain host supports them.

If the old sites are still on Google Sites:

1. Keep ownership of each old domain.
2. Check whether the domain registrar supports URL forwarding.
3. Forward each old domain or path to the correct new page.
4. If path-level redirects are not available, redirect:
   - the legacy Burien domain to the Burien page
   - the legacy Des Moines domain to the Des Moines page
5. Leave redirects active for at least 12 months.

## 6. Verify After Launch

### SSL

Open:

```text
https://magnoliaseniorcarewa.com
https://www.magnoliaseniorcarewa.com
```

Confirm:

- [ ] Both load over HTTPS.
- [ ] No browser security warnings.
- [ ] `www` redirects to the chosen primary domain.
- [ ] Vercel shows the domain as valid.

### Sitemap

Open:

```text
https://magnoliaseniorcarewa.com/sitemap.xml
```

Confirm it includes:

- [ ] Homepage
- [ ] About
- [ ] Services
- [ ] Gallery
- [ ] Referral agents
- [ ] Contact
- [ ] Burien location page
- [ ] Des Moines location page
- [ ] Blog template

Submit sitemap in Google Search Console.

### Robots

Open:

```text
https://magnoliaseniorcarewa.com/robots.txt
```

Confirm it contains:

```text
User-agent: *
Allow: /

Sitemap: https://magnoliaseniorcarewa.com/sitemap.xml
```

### Canonical URLs

View page source for every major page and confirm canonical URLs use:

```text
https://magnoliaseniorcarewa.com/
```

Check:

- [ ] `/`
- [ ] `/about.html`
- [ ] `/services.html`
- [ ] `/rooms-photos.html`
- [ ] `/referral-agents.html`
- [ ] `/contact.html`
- [ ] `/burien-adult-family-home.html`
- [ ] `/des-moines-adult-family-home.html`
- [ ] `/blog/afh-education-template.html`

### Structured Data

Use Google Rich Results Test or Schema Markup Validator.

Check:

- [ ] Homepage organization schema.
- [ ] Burien local business schema.
- [ ] Des Moines local business schema.
- [ ] Contact page schema.
- [ ] Gallery schema.
- [ ] Article schema.

### Functional QA

- [ ] Navigation works.
- [ ] Mobile menu works.
- [ ] Mobile sticky CTA bar works.
- [ ] `tel:` links open the phone app on mobile.
- [ ] `mailto:` links open email.
- [ ] Contact form opens a pre-filled email.
- [ ] Burien Google Business Profile points to `/burien-adult-family-home.html`.
- [ ] Des Moines Google Business Profile points to `/des-moines-adult-family-home.html`.
- [ ] Old domains redirect to the correct new pages.

## 7. Search Console And Analytics

1. Create Google Search Console property for:

```text
magnoliaseniorcarewa.com
```

2. Verify domain ownership through DNS.
3. Submit:

```text
https://magnoliaseniorcarewa.com/sitemap.xml
```

4. Set up Google Analytics 4.
5. Track:
   - Call clicks
   - Email clicks
   - Schedule tour clicks
   - Referral inquiry clicks
   - Contact form handoff

## 8. Final Launch Notes

- Keep old domains active and redirecting.
- Do not publish duplicate copies of the site on multiple domains.
- Use one canonical domain: `magnoliaseniorcarewa.com`.
- Update Google Business Profiles as soon as the new site is live.
- Replace placeholder photos with approved real Magnolia home photos before major marketing pushes.
