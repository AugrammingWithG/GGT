# Gourmet Getaway Tours

Marketing site + interactive tour builder for Gourmet Getaway Tours, converted
from the original HTML mockup to **Next.js (App Router) + TypeScript**, with a
**Firebase** backend and deployment on **Vercel**.

## What's here

- **Homepage** (`app/page.tsx`) — sticky header, hero, two doors, sticky
  stacking cards, the interactive tour builder, Jimmy bio, footer. Styling is
  the original mockup CSS, ported verbatim into `app/globals.css`.
- **Tour builder** (`components/TourBuilder.tsx`) — destination select, guest
  stepper, per-person add-ons, live price bill, and a "Send enquiry" modal.
- **Enquiries** — submitted to `POST /api/enquiries`, validated with `zod`,
  saved to Firestore via the Admin SDK, and emailed to the business (Resend).
- **Tours in Firestore** — read server-side with a fallback to `SEED_TOURS`
  (`lib/tours.ts`) so the site always renders. Seed with `npm run seed`.
- **Admin** (`/admin`) — Firebase Auth login + dashboard to view/handle
  enquiries and edit tours. Access restricted to the `ADMIN_EMAILS` allowlist.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a Firebase project; enable **Firestore** and **Authentication →
   Email/Password**.
3. Copy `.env.local.example` to `.env.local` and fill in all values (web app
   config + service-account JSON + admin email; Resend is optional).
4. Create the Firebase Authentication user whose email is in `ADMIN_EMAILS`:
   ```
   npm run admin:create -- you@example.com "choose-a-strong-password"
   ```
   Re-running this command resets that user's password and re-enables the
   account. Alternatively, create the user under **Authentication → Users** in
   Firebase Console.
5. Seed tour data:
   ```
   npm run seed
   ```
6. Run locally:
   ```
   npm run dev
   ```

## Firestore security rules

`firestore.rules` denies all direct client access — every read of enquiries and
all writes go through the Admin SDK in API routes. Deploy with the Firebase CLI:
```
firebase deploy --only firestore:rules
```

## Deploy to Vercel

1. Push this repo to GitHub and import it into Vercel with the **Next.js**
   framework preset. The default build command (`next build`) and output
   settings are sufficient; no `vercel.json` is required.
2. Add every variable from `.env.local.example` under **Project Settings →
   Environment Variables**. Add them to Production and any Preview or
   Development environments that need them. Set `FIREBASE_SERVICE_ACCOUNT` to
   the complete service-account JSON value.
3. Deploy, then add `gourmetgetawaytours.com.au` under **Project Settings →
   Domains** and update its DNS records as directed by Vercel. Firebase remains
   responsible for Firestore and Authentication.

## Notes

- Image placeholders are CSS gradients (matching the mockup); swap in real
  photos via `next/image` as a follow-up.
- Email uses Resend. To use the pure-Firebase "Trigger Email" extension instead,
  remove `sendNotification` from `app/api/enquiries/route.ts` and write to a
  `mail` collection / install the extension.
