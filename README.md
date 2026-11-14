# 24 Clothes — Website + Admin Panel

This project keeps the existing 24 Clothes storefront design and adds a private mobile-friendly admin panel.

## Features
- Existing 24 Clothes storefront look and product detail / WhatsApp order flow.
- `/admin` private login.
- Add, edit, delete and hide/show products.
- Upload product photos from a phone. The browser resizes them and stores the image data in MongoDB, so no separate image-hosting account is needed.
- Product details are stored in MongoDB database `24clothes`, collection `products`.
- The first database visit automatically seeds the four original demo products if the collection is empty.

## Required environment variables
Set these in Vercel → Project → Settings → Environment Variables:

- `MONGODB_URI` — your MongoDB Atlas connection string.
- `ADMIN_PASSWORD` — a long, unique password for `/admin`.

Do not put real values in GitHub, source files, screenshots or chat messages. Do not commit `.env.local`.

## MongoDB Atlas setup
1. Create an Atlas database user with read/write access to the cluster.
2. In Network Access, add `0.0.0.0/0` so Vercel serverless functions can connect. Use a strong, unique database-user password; the database still requires authentication.
3. Copy the Atlas connection string. Replace the username and password placeholders with the database user's credentials. Keep the `mongodb+srv://` prefix.
4. Add the full string as the `MONGODB_URI` environment variable in Vercel.
5. Add a long unique `ADMIN_PASSWORD` environment variable in Vercel.
6. Redeploy the project after saving environment variables.

## Deploy
1. Upload the complete contents of this folder to a GitHub repository (the `package.json` must be in the repository root).
2. Import that repository into Vercel.
3. In Vercel project settings, set the two environment variables above for Production (and Preview if needed).
4. Deploy. The homepage remains at `/`; the admin panel is at `/admin`.

## Local development
1. Copy `.env.example` to `.env.local` and fill in real values.
2. Run `npm install`.
3. Run `npm run dev`.

## Image storage note
Uploaded photos are resized to JPEG (max 1200px on the longest edge) and stored in MongoDB as data URLs. This is convenient for a small starter catalogue. Keep images reasonably sized and avoid uploading very large catalogues to a free database tier. An image URL can also be used instead of uploading a file.
