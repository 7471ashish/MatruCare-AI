# MatruCare AI — Hackathon Registration Portal 2026

> **Official Hackathon Registration Portal for MatruCare AI**  
> A production-grade, enterprise-hardened full-stack MERN application featuring custom Nodemailer delivery, 6-digit cryptographic HMAC OTP verification, HttpOnly cookie-based JWT authentication, responsive human-crafted UI, and comprehensive automated test coverage.

---

## 1. Project Overview

**MatruCare AI Hackathon 2026** is a 36-hour flagship hackathon registration portal engineered for student developers, system architects, and researchers to register their teams, pitch innovative projects, and submit deliverables.

### Key Capabilities & Architectural Highlights
- **Branding**: Dedicated **MatruCare AI** branding across navigation, footers, badge credentials, and correspondence.
- **Strict Email Security & Standards**:
  - All outgoing system emails strictly use sender name `"MatruCare AI"` and from-address `matrucareai@gmail.com`.
  - Zero candidate or personal contact phone numbers exposed in email templates.
  - User-supplied values are HTML-escaped using a dedicated `escapeHtml` utility to eliminate XSS injection risks.
  - Automated retry mechanism with backoff (`sendWithRetry`) and delivery tracking (`pending`, `sent`, `failed`) on registrations.
  - In development without a Gmail App Password, an in-memory JSON test transport logs full email previews safely to the console.
- **Cryptographic HMAC OTP Verification**:
  - 6-digit one-time passcode generated via `crypto.randomInt()`.
  - Protected using HMAC-SHA256 with server-side secret (`OTP_SECRET`), never stored in plaintext.
  - Verified using constant-time `crypto.timingSafeEqual()` comparison.
  - Valid for exactly 10 minutes; automatically invalidated after first use.
  - **Brute-Force Hardening**: After 5 failed attempts, the OTP is atomically invalidated, blocking brute-force guessing.
  - 45-second rate-limiting cooldown on resend attempts.
  - Verification marks the account `isVerified = true` and redirects to `/login` (no token is issued during verification).
- **Hardened Password & JWT Security**:
  - Minimum 15-character password requirement enforced by regex requiring uppercase, lowercase, digit, and special symbol.
  - bcrypt hashing with cost factor 12 (~344ms work factor benchmarked to resist offline cracking).
  - Account lockout after 5 consecutive failed login attempts (locks account for 15 minutes via `lockUntil`).
  - Primary authentication via **HttpOnly cookies** (`token`, `SameSite=Lax`, `path=/`, `secure` in production) with dual-mode fallback to `Authorization: Bearer <token>`.
  - Dedicated `POST /api/auth/logout` endpoint that safely clears authentication cookies.
  - Client Axios instance configured with `withCredentials: true` and custom `X-Requested-With: XMLHttpRequest` CSRF protection header.
- **Multi-Step Progressive Registration Wizard**:
  - 4 stages: Personal Details → Academic Institution → Project Pitch & Deliverables → Team Roster.
  - Logged-in participant is displayed separately as "Team Lead (You)".
  - **Team Size Logic**:
    - Team Size = 1: Solo participant (0 additional member boxes).
    - Team Size = 2: Exactly 2 additional member entry boxes.
    - Team Size = 3: Exactly 3 additional member entry boxes.
    - Team Size = 4: Exactly 4 additional member entry boxes.
    - Team Size = 5: Exactly 5 additional member entry boxes.
  - Validates Indian mobile numbers (`/^[6-9]\d{9}$/`), safe HTTP/HTTPS URL protocols without ReDoS regex vulnerabilities, and ensures unique teammate emails.
- **Participant Dashboard**:
  - Real-time profile review and editing (`PUT /api/user/update`).
  - View registered project details, deliverables, and team roster.
  - Edit project deliverables before deadline (`PUT /api/hackathon/:id`).
  - Digital participant pass modal with QR code.
  - Submission withdrawal modal (`DELETE /api/hackathon/:id`) with owner-only authorization checks.
- **Production Hardening**:
  - Reverse proxy trust enabled (`app.set('trust proxy', 1)`).
  - Helmet CSP and security headers enabled.
  - Credential-aware CORS with strict origin validation.
  - Centralized error handler returning consistent `{ success, message, data }` responses without leaking stack traces in production.

---

## 2. Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Framer Motion 11, React Router v6, Axios, react-hot-toast, Lucide React, canvas-confetti.
- **Backend**: Node.js, Express.js (RESTful API), `cookie-parser`, `helmet`, `cors`, `express-rate-limit`, `morgan`, `express-validator`.
- **Database**: MongoDB + Mongoose 8.
- **Authentication**: JWT (JSON Web Tokens) with HttpOnly cookies + Bearer header fallback, bcryptjs (work factor 12).
- **Email Delivery**: Nodemailer 10.3.1 with SMTP / Gmail SMTP transport and development JSON fallback.
- **Testing**: Node.js native test runner (`node:test`, `node:assert/strict`) + Supertest.

---

## 3. Monorepo Folder Structure

```text
MatruCare AI/
├── client/                      # React (Vite) Frontend Application
│   ├── public/
│   │   └── _redirects           # Netlify SPA client-side routing redirect
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js # Axios instance with credentials, CSRF header & auto-logout
│   │   ├── components/
│   │   │   ├── common/          # Button, InputField, SelectField, Card, Modal, etc.
│   │   │   └── layout/          # Navbar, Footer, ProtectedRoute, Layout
│   │   ├── config/
│   │   │   └── site.js          # Centralized site branding & constants
│   │   ├── context/
│   │   │   ├── AuthContext.jsx  # Global auth state, session restoration & logout
│   │   │   └── ThemeContext.jsx # Theme provider
│   │   ├── pages/
│   │   │   ├── Home.jsx         # Landing page with tracks, moments gallery, mentors, FAQ
│   │   │   ├── Signup.jsx       # 15-char strong password account registration & strength meter
│   │   │   ├── VerifyOtp.jsx    # 6-box OTP entry, confetti celebration & login redirect
│   │   │   ├── Login.jsx        # HttpOnly cookie JWT login with unverified account detection
│   │   │   ├── Dashboard.jsx    # Participant dashboard, project details, edit modal & pass
│   │   │   ├── Registration.jsx # 4-step project registration form & dynamic roster
│   │   │   ├── Contact.jsx      # Helpdesk form forwarding to matrucareai@gmail.com
│   │   │   ├── About.jsx        # Mission, pillars & 5-point evaluation rubric
│   │   │   └── NotFound.jsx     # 404 error page
│   │   ├── App.jsx              # Routes declaration & toaster wrapper
│   │   ├── index.css            # Tailwind directives & accessibility rules
│   │   └── main.jsx             # React DOM entry point
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vercel.json              # Vercel SPA rewrite configuration
│   └── vite.config.js
│
├── server/                      # Node.js + Express Backend API
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB Mongoose connection manager
│   │   │   └── env.js           # Validated environment configuration with production guards
│   │   ├── controllers/
│   │   │   ├── authController.js       # Signup, verify OTP, resend OTP, login, logout
│   │   │   ├── userController.js       # Profile querying and updates
│   │   │   ├── hackathonController.js  # Registration, my-entry, delete, update deliverables
│   │   │   └── contactController.js    # Contact inquiry handler
│   │   ├── middleware/
│   │   │   ├── auth.js          # Dual-mode auth guard (HttpOnly cookie primary, Bearer fallback)
│   │   │   ├── errorHandler.js  # Centralized error handler
│   │   │   ├── rateLimiter.js   # Endpoint rate limiters
│   │   │   └── validate.js      # express-validator result formatter
│   │   ├── models/
│   │   │   ├── User.js          # User schema with bcrypt 12, failed login tracking & lockUntil
│   │   │   └── HackathonRegistration.js # Schema with email delivery status & roster validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── hackathonRoutes.js
│   │   │   └── contactRoutes.js
│   │   ├── utils/
│   │   │   ├── emailService.js  # Nodemailer manager with retry mechanism & SMTP support
│   │   │   ├── emailTemplates.js# Safe HTML emails with HTML entity escaping
│   │   │   ├── otpGenerator.js  # Cryptographic OTP & HMAC-SHA256 generator
│   │   │   └── urlValidator.js  # Safe ReDoS-free HTTP/HTTPS URL validator
│   │   ├── app.js               # Express app setup, cookie-parser, CORS & proxy trust
│   │   └── server.js            # Server entry point
│   ├── tests/
│   │   └── api.test.js          # 29 integration tests (node:test + supertest)
│   ├── .env.example
│   └── package.json
│
├── TESTING.md                   # Real test execution logs (29/29 passing) & testing guide
├── DEMO_SCRIPT.md               # Video demonstration walkthrough guide
├── start.bat                    # Windows development launcher
├── .gitignore
└── README.md
```

---

## 4. Environment Variables Guide

### Server (`server/.env`)
Create a `server/.env` file:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Connection String (Local or MongoDB Atlas)
MONGO_URI=mongodb://127.0.0.1:27017/matrucare_hackathon

# Dedicated Test Database (Isolated from dev/prod)
MONGO_URI_TEST=mongodb://127.0.0.1:27017/matrucare_hackathon_test

# JWT & OTP Secrets (MUST be at least 32 characters long)
JWT_SECRET=matrucare_ai_2026_super_secure_jwt_secret_key_min32chars!
JWT_EXPIRES_IN=7d
OTP_SECRET=matrucare_ai_2026_super_secure_otp_hmac_secret_min32chars!

# Nodemailer Configuration (SMTP / Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=matrucareai@gmail.com
EMAIL_PASS=your_gmail_16_character_app_password
EMAIL_FROM_NAME=MatruCare AI
EMAIL_FROM_ADDRESS=matrucareai@gmail.com
CONTACT_RECEIVER_EMAIL=matrucareai@gmail.com
```

> **Important Note regarding `matrucareai@gmail.com`**:
> To send live emails through Gmail SMTP in production, the Google account `matrucareai@gmail.com` must have **2-Step Verification enabled**, and a dedicated **16-character App Password** must be generated from [Google Account Security > App Passwords](https://myaccount.google.com/apppasswords). In development, if `EMAIL_PASS` is left as placeholder, the system uses a test transport and logs all OTP and registration messages safely to the terminal console.

### Client (`client/.env`)
Create a `client/.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 5. API Reference

All responses strictly follow the uniform JSON shape:
```json
{
  "success": true,
  "message": "Human-readable status message",
  "data": {}
}
```

### Authentication Endpoints
| Method | Endpoint | Purpose | Protected | Request Body |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/signup` | Create unverified user, hash password (bcrypt 12), send HMAC OTP | No | `{ fullName, email, password }` |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit HMAC OTP, invalidate code, mark verified (no JWT) | No | `{ email, otp }` |
| `POST` | `/api/auth/resend-otp` | Generate fresh HMAC OTP, invalidate old, enforce 45s cooldown | No | `{ email }` |
| `POST` | `/api/auth/login` | Verify password, check verification & lockout, set HttpOnly cookie | No | `{ email, password }` |
| `POST` | `/api/auth/logout` | Clear HttpOnly authentication cookie | Yes / Any | None |

### User Profile Endpoints
| Method | Endpoint | Purpose | Protected | Headers / Request Body |
| :--- | :--- | :--- | :---: | :--- |
| `GET` | `/api/user/me` | Fetch authenticated user profile & entry status | Yes (Cookie / Bearer) | `GET /api/user/me` |
| `PUT` | `/api/user/update` | Update user profile fields (e.g. `fullName`) | Yes (Cookie / Bearer) | `{ fullName }` |

### Hackathon Registration Endpoints
| Method | Endpoint | Purpose | Protected | Request Body |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/hackathon/register` | Register team & project, send confirmation email | Yes | `{ fullName, mobile, collegeName, course, branch, yearOfStudy, domain, projectName, pptLink, prototypeLink, demoVideoLink, teamSize, teamMembers }` |
| `GET` | `/api/hackathon/my-entry` | Return current user's registration (or `null`) | Yes | None |
| `PUT` | `/api/hackathon/:id` | Update project presentation & prototype links | Yes (Owner only) | `{ projectName, pptLink, prototypeLink, demoVideoLink }` |
| `DELETE` | `/api/hackathon/:id` | Withdraw registration | Yes (Owner only) | None |

### System & Contact Endpoints
| Method | Endpoint | Purpose | Protected | Request Body |
| :--- | :--- | :--- | :---: | :--- |
| `POST` | `/api/contact` | Forward contact form message to `matrucareai@gmail.com` | No | `{ name, email, category, message }` |
| `GET` | `/health` | Server health check and operational status | No | None |

---

## 6. How to Run Locally

### Prerequisites
- Node.js v18+ (tested on v24.18)
- MongoDB instance running on `127.0.0.1:27017`

### Option 1: Quickstart via `start.bat` (Windows)
Double-click `start.bat` in the project root to start both backend and frontend servers in separate terminal sessions.

### Option 2: Manual Terminal Startup
```bash
# 1. Install dependencies
cd server && npm install
cd ../client && npm install

# 2. Start Backend Server
cd ../server
npm run dev
# Running at http://localhost:5000

# 3. Start Frontend Client (in a separate terminal)
cd ../client
npm run dev
# Running at http://localhost:5173
```

### Running Automated Integration Tests
```bash
cd server
npm test
```
Executes **29 comprehensive integration & security tests** verifying:
- 15-character minimum password policy
- Weak password rejection
- HMAC-SHA256 OTP generation and constant-time verification
- 5-attempt OTP brute-force invalidation
- 45-second resend OTP cooldown
- Unverified user login prevention (`403 Forbidden`)
- Account-based 15-minute lockout after 5 failed password attempts
- HttpOnly cookie authentication and Bearer fallback
- Cookie clearing on logout
- Dynamic team size validation ($N=1 \implies 0$ members, $N \ge 2 \implies N$ member entries)
- Email delivery status tracking (`pending`, `sent`, `failed`)
- Owner-guarded deliverable updates (`PUT`) and registration withdrawal (`DELETE`)

---

## 7. Deployment Guide

### Frontend Deployment (Vercel or Netlify)
1. **Build Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
2. **Environment Variables**:
   - `VITE_API_BASE_URL`: URL of your deployed backend API (e.g. `https://matrucare-api.onrender.com/api`)
3. **SPA Routing**:
   - Vercel: Configured via `client/vercel.json`.
   - Netlify: Configured via `client/public/_redirects`.

### Backend Deployment (Render or Railway)
1. **Build Settings**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
2. **Environment Variables**:
   - `NODE_ENV=production`
   - `PORT=5000` (or dynamically provided by host)
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: 32+ character cryptographically secure secret
   - `OTP_SECRET`: 32+ character cryptographically secure secret
   - `CLIENT_URL`: URL of your deployed frontend (e.g. `https://matrucare.vercel.app`)
   - `EMAIL_HOST=smtp.gmail.com`
   - `EMAIL_PORT=587`
   - `EMAIL_USER=matrucareai@gmail.com`
   - `EMAIL_PASS`: Gmail 16-character App Password
   - `EMAIL_FROM_NAME=MatruCare AI`
   - `EMAIL_FROM_ADDRESS=matrucareai@gmail.com`
   - `CONTACT_RECEIVER_EMAIL=matrucareai@gmail.com`
