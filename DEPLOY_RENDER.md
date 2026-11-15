# MatruCare AI — Render Deployment Guide

This guide walks you through deploying both the **Backend API** and **Frontend Client** of the **MatruCare AI Hackathon Registration Portal** to [Render](https://render.com).

---

## 1. Prerequisites Checklist

Before beginning deployment, ensure you have:
1. **Render Account**: Sign up at [render.com](https://render.com) (free).
2. **MongoDB Atlas Database**:
   - Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - In **Network Access**: Add IP Address `0.0.0.0/0` ("Allow Access from Anywhere") so Render's cloud servers can connect.
   - In **Database Access**: Create a database user and password.
   - In **Clusters > Connect > Drivers**: Copy the connection string, e.g.:
     ```text
     mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/matrucare_hackathon?retryWrites=true&w=majority
     ```
3. **Gmail App Password (16 characters)**:
   - For `bansalashish346@gmail.com` or `matrucareai@gmail.com`:
   - Enable **2-Step Verification** on Google Account.
   - Navigate to [Google Account > Security > App Passwords](https://myaccount.google.com/apppasswords).
   - Generate a 16-character App Password (e.g. `tnut lxtu ukji xbch`).
4. **GitHub Repository**:
   - Push this monorepo to your GitHub account (public or private).

---

## 2. Deployment Options

You have two simple ways to deploy on Render:
- **Option A (Recommended & Automated)**: Using Render Blueprints (`render.yaml` included in this repo).
- **Option B (Manual)**: Step-by-step setup in the Render Dashboard.

---

## Option A: One-Click Deploy via Render Blueprint (`render.yaml`)

This repository includes a pre-configured `render.yaml` Blueprint that automatically sets up both the Backend Web Service and Frontend Static Site.

1. Log into your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** (top right) and select **Blueprint**.
3. Connect your GitHub repository.
4. Render will detect `render.yaml` and show:
   - `matrucare-backend` (Web Service)
   - `matrucare-frontend` (Static Site)
5. Fill in the prompted secret variables:
   - `MONGO_URI`: Your MongoDB Atlas URI.
   - `EMAIL_PASS`: Your 16-character Gmail App Password.
   - `EMAIL_USER`: `bansalashish346@gmail.com` (or your configured email).
   - `EMAIL_FROM_ADDRESS`: `matrucareai@gmail.com` (or your sending address).
   - `CONTACT_RECEIVER_EMAIL`: `matrucareai@gmail.com` (or your email).
6. Click **Apply**.
7. Render will build and deploy both services!
8. **Final link step**:
   - Once the backend is deployed, copy its URL: `https://matrucare-backend.onrender.com`.
   - In the frontend service settings, set `VITE_API_BASE_URL` to `https://matrucare-backend.onrender.com/api` and trigger a re-deploy.
   - In the backend service settings, set `CLIENT_URL` to `https://matrucare-frontend.onrender.com`.

---

## Option B: Step-by-Step Manual Deployment on Render

### Step 1: Deploy Backend Web Service (`/server`)

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Select your GitHub repository.
4. Configure the service settings:
   - **Name**: `matrucare-backend` (or any name you prefer)
   - **Region**: Oregon (US West) or Frankfurt (EU)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Click **Advanced** and set:
   - **Health Check Path**: `/health`
6. Add the following **Environment Variables**:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production security & optimizations |
| `PORT` | `10000` | Render standard port (Render also auto-injects `PORT`) |
| `MONGO_URI` | `mongodb+srv://...` | Your MongoDB Atlas connection string |
| `JWT_SECRET` | *(At least 32 random characters)* | Cryptographic key for signing JWTs |
| `OTP_SECRET` | *(At least 32 random characters)* | Cryptographic HMAC key for OTP hashing |
| `CLIENT_URL` | `http://localhost:5173` *(Update with live frontend URL in Step 3)* | Allowed CORS origin & cookie domain |
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP host |
| `EMAIL_PORT` | `587` | SMTP port |
| `EMAIL_USER` | `bansalashish346@gmail.com` | SMTP login account |
| `EMAIL_PASS` | `tnut lxtu ukji xbch` | 16-character Gmail App Password |
| `EMAIL_FROM_NAME` | `MatruCare AI` | Sender display name |
| `EMAIL_FROM_ADDRESS` | `matrucareai@gmail.com` | From email address |
| `CONTACT_RECEIVER_EMAIL` | `matrucareai@gmail.com` | Inquiries destination email |

7. Click **Create Web Service**.
8. Wait for build and deployment to complete. When active, test the health check:
   ```text
   https://<your-backend-name>.onrender.com/health
   ```
   Should return:
   ```json
   {
     "success": true,
     "message": "MatruCare AI Hackathon 2026 API is healthy and operational",
     "environment": "production"
   }
   ```
9. **Copy your backend URL**: `https://<your-backend-name>.onrender.com`.

---

### Step 2: Deploy Frontend (`/client`)

You can deploy the frontend as a **Render Static Site** (or on **Vercel** / **Netlify**).

#### Option 1: On Render (Static Site)
1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** > **Static Site**.
3. Select the same GitHub repository.
4. Configure settings:
   - **Name**: `matrucare-portal`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. In **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://<your-backend-name>.onrender.com/api`
6. In **Redirects / Rewrites** (crucial for React Router client-side navigation):
   - Click **Add Rule**
   - **Type**: `Rewrite`
   - **Source**: `/*`
   - **Destination**: `/index.html`
7. Click **Create Static Site**.
8. Wait for the Vite build to complete.
9. **Copy your frontend live URL**: `https://matrucare-portal.onrender.com`.

#### Option 2: On Vercel (Alternative per PDF Brief)
1. Go to [vercel.com](https://vercel.com) and import the GitHub repo.
2. Set **Root Directory** to `client`.
3. Framework Preset: `Vite`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://<your-backend-name>.onrender.com/api`
5. Click **Deploy** (Vercel automatically detects `client/vercel.json` for SPA rewrites).

---

### Step 3: Link Backend and Frontend (CORS & Cookies)

Now that both URLs are live:
1. Return to your **Backend Service** on Render (`matrucare-backend`).
2. Go to **Environment** tab.
3. Update `CLIENT_URL` to your live frontend URL (e.g. `https://matrucare-portal.onrender.com` or `https://matrucare-ai.vercel.app`).
4. Render will automatically redeploy the backend with the updated CORS origin.

---

## 3. Post-Deployment Verification Checklist

Once both services are running:
- [ ] **Health Check**: Open `https://<backend>.onrender.com/health` → returns status `200`.
- [ ] **Home Page**: Open frontend URL → hero section, navbar, tracks, prizes, and countdown timer load.
- [ ] **Signup**: Register a new user at `/signup` → receives 6-digit OTP email from `matrucareai@gmail.com`.
- [ ] **OTP Verification**: Enter code at `/verify-otp` → verifies account, celebrates with confetti, redirects to `/login`.
- [ ] **Login**: Sign in at `/login` → receives JWT and HttpOnly cookie, redirects to `/dashboard`.
- [ ] **Dashboard**: Displays profile and "Register Now" CTA.
- [ ] **Hackathon Registration**: Fill 4-step registration form at `/register` → submits successfully, receives registration confirmation email with project and team roster details.
- [ ] **Dashboard Registered View**: Refresh `/dashboard` → shows project details, deliverables links, and team roster.
- [ ] **Edit Deliverables**: Click "Edit Links" on Dashboard → updates links successfully (`PUT /api/hackathon/:id`).
- [ ] **Contact Form**: Submit message at `/contact` → dispatches inquiry email.

---

## 4. Key Notes for Render Free Tier

1. **Free Tier Inactivity Sleep**:
   - Render's free tier web services spin down after 15 minutes of inactivity.
   - When a new request arrives, it takes approximately 30–45 seconds for the container to spin back up.
   - Subsequent requests run at normal fast speed.
2. **MongoDB Atlas IP Whitelist**:
   - Ensure `0.0.0.0/0` is active in MongoDB Atlas Network Access, as cloud instances use dynamic IP addresses.
3. **Cross-Origin HttpOnly Cookies**:
   - In production (`NODE_ENV=production`), cookies are set with `SameSite: None` and `Secure: true` to support cross-site requests between `onrender.com` subdomains or between Vercel and Render.
   - The client also passes `Authorization: Bearer <token>` fallback automatically in Axios interceptors.
