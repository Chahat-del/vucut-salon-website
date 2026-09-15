# vuCut Website — Deploy Guide (100% Free)

## What you get
- Public website with booking form → https://yourdomain.com
- Admin panel → https://yourdomain.com/admin
- Form submissions stored by Netlify (free tier: 100/month)
- Admin login via Netlify Identity (free)
- Custom domain support

---

## Step 1 — Push to GitHub

1. Go to https://github.com/new and create a new repository (e.g. `vucut-website`)
2. Open a terminal in this folder and run:

```bash
git init
git add .
git commit -m "Initial vuCut website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vucut-website.git
git push -u origin main
```

---

## Step 2 — Deploy on Netlify (free)

1. Go to https://app.netlify.com → **Add new site → Import from Git**
2. Connect GitHub → select your `vucut-website` repo
3. Build settings (leave as-is, netlify.toml handles it):
   - **Publish directory:** `.` (just a dot)
   - **Build command:** (leave empty)
4. Click **Deploy site** — your site will be live in ~1 minute

---

## Step 3 — Enable Netlify Forms

Forms work automatically on Netlify — nothing extra to do.
After your first real form submission, go to:
**Netlify Dashboard → Your Site → Forms** — you'll see all bookings there.

---

## Step 4 — Enable Netlify Identity (for Admin Panel)

1. In Netlify dashboard: **Site → Identity → Enable Identity**
2. Under **Registration**: set to **Invite only** (so only you can log in)
3. Click **Invite users** → enter your email → you'll get a link to set your password
4. That's it — visit `yourdomain.com/admin`, click Login, and sign in with your email

---

## Step 5 — Connect Custom Domain (vucut.in)

1. Netlify dashboard → **Domain settings → Add custom domain**
2. Type `vucut.in` → Netlify will show you DNS records
3. Log in to your domain registrar (GoDaddy / Namecheap / wherever you bought vucut.in)
4. Add these DNS records:
   - **A record:** `@` → `75.2.60.5` (Netlify's load balancer)
   - **CNAME:** `www` → `YOUR-SITE-NAME.netlify.app`
5. Wait 5–30 minutes for DNS to propagate
6. Netlify auto-issues a free SSL certificate (HTTPS)

---

## Admin Panel Usage

- URL: `https://vucut.in/admin`
- Login with your Netlify Identity email/password
- See all booking requests in a table
- Search by name, phone, or service
- Filter by status: New / Confirmed / Done / Cancelled
- Click any row's eye icon to see full details and update status
- Phone numbers are clickable WhatsApp links
- Status changes are saved in your browser (localStorage)

---

## File Structure

```
vucut-website/
  index.html       ← Public website (Home, Offers, Services, Social + Booking form)
  admin.html       ← Admin dashboard
  style.css        ← All styles
  script.js        ← Navbar, animations, tab filter
  netlify.toml     ← Netlify configuration
  images/          ← Put your images here
    qr-instagram.png
    qr-location.png
    salon-hero.jpg
    offers-hero.jpg
    offer-149.jpg
    offer-199.jpg
```

---

## Updating the Site

Just push changes to GitHub — Netlify auto-redeploys in ~30 seconds.

```bash
git add .
git commit -m "Update content"
git push
```
