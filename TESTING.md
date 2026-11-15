# MatruCare AI - Verification & Testing Guide

This document provides the end-to-end testing protocol, automated test results, manual testing checklist, and edge-case verification for the **MatruCare AI Hackathon Registration Portal 2026**.

---

## 1. Automated Test Suite Results

The backend includes a comprehensive automated integration and security test suite (`server/tests/api.test.js`) executed using native `node:test` and `supertest`, exercising all 11 API endpoints, authentication states, rate limiting, HMAC OTP generation and atomic 5-attempt brute-force lockout, 15-character minimum password policy, account lockout after 5 failed logins (15 minutes), dual-mode JWT auth (HttpOnly cookie primary with Bearer header fallback), team size validation ($N=1 \implies 0$ additional members, $N \ge 2 \implies N$ member entries), owner-guarded mutations, and database constraints against an isolated database (`matrucare_hackathon_test`).

### Automated Run Output
```text
> matrucare-ai-server@1.0.0 test
> node --test tests/**/*.test.js

[Email Service] Using test transport (local logging enabled)
[Database] MongoDB connected: 127.0.0.1
▶ MatruCare AI Hackathon 2026 - Security & Integration Test Suite
  ✔ GET /health returns 200 and operational status (50.1446ms)
  ✔ POST /api/auth/signup blocks password shorter than 15 characters with 400 (28.2017ms)
  ✔ POST /api/auth/signup blocks weak password lacking numbers or special characters (5.7206ms)
[Email Preview - OTP to test.participant@matrucare.org]: Code = 331687
  ✔ POST /api/auth/signup creates unverified user with HMAC OTP and returns 201 (356.935ms)
[Email Preview - OTP to test.participant@matrucare.org]: Code = 102207
  ✔ POST /api/auth/signup updates unverified user with fresh OTP if not verified yet (329.2599ms)
  ✔ POST /api/auth/resend-otp enforces 45-second cooldown on immediate retry (13.3842ms)
  ✔ POST /api/auth/login blocks unverified user with 403 and isUnverified=true (423.9651ms)
  ✔ POST /api/auth/login rejects wrong password with 401 without revealing unverified state (338.5229ms)
  ✔ POST /api/auth/verify-otp tracks wrong attempts and invalidates OTP after 5 failures (50.5843ms)
[Email Preview - OTP to test.participant@matrucare.org]: Code = 177956
  ✔ POST /api/auth/resend-otp issues new HMAC OTP after resetting cooldown (13.0891ms)
  ✔ POST /api/auth/verify-otp rejects expired OTP (7.2926ms)
  ✔ POST /api/auth/verify-otp successfully verifies valid HMAC OTP and does NOT issue JWT (13.5324ms)
  ✔ POST /api/auth/login issues JWT token and sets HttpOnly cookie after verification (366.6426ms)
  ✔ POST /api/auth/login locks account for 15 minutes after 5 failed password attempts (1805.6554ms)
  ✔ GET /api/user/me returns profile when HttpOnly cookie is supplied (25.2009ms)
  ✔ GET /api/user/me returns profile when Bearer token header is supplied (17.4432ms)
  ✔ GET /api/user/me blocks request without token or cookie with 401 (4.1512ms)
  ✔ PUT /api/user/update updates full name (17.8368ms)
  ✔ POST /api/hackathon/register rejects invalid phone number and invalid URLs (12.1872ms)
  ✔ POST /api/hackathon/register enforces teamSize = 3 requiring exactly 3 member entries (11.1323ms)
  ✔ POST /api/hackathon/register rejects team member email matching lead email (8.064ms)
[Email Preview - Registration to test.participant@matrucare.org]: Confirmed for MatruCare AI Diagnostics
  ✔ POST /api/hackathon/register creates solo entry with teamSize = 1 and 0 members (24.9897ms)
  ✔ POST /api/hackathon/register blocks duplicate registration with 409 conflict (9.9648ms)
  ✔ GET /api/hackathon/my-entry returns user registration (10.9929ms)
  ✔ PUT /api/hackathon/:id and DELETE /api/hackathon/:id prevent non-owner modification (360.9514ms)
  ✔ PUT /api/hackathon/:id permits owner to update project deliverables (9.8473ms)
  ✔ DELETE /api/hackathon/:id permits owner to delete their entry (12.0348ms)
  ✔ POST /api/auth/logout successfully clears HttpOnly authentication cookie (4.5582ms)
  ✔ POST /api/contact sends inquiry message successfully (9.2736ms)
[Database] MongoDB disconnected successfully
✔ MatruCare AI Hackathon 2026 - Security & Integration Test Suite (4451.2993ms)
ℹ tests 29
ℹ suites 1
ℹ pass 29
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6111.6336
```

---

## 2. End-to-End Manual Testing Checklist

| Step | Action | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **1. Home Navigation** | Visit `http://localhost:5173/` | Hero section loads with animated pulse line, metrics counter, problem tracks, timeline, and prize cards. Dark mode toggle smoothly toggles theme. | **VERIFIED** |
| **2. Signup Flow** | Go to `/signup`. Enter Full Name, Email, Password, Confirm Password. | Password must be $\ge 15$ characters with uppercase, lowercase, digit, and symbol. Real-time strength meter updates. Submitting triggers `POST /api/auth/signup`, receives toast, and redirects to `/verify-otp?email=...`. | **VERIFIED** |
| **3. OTP Verification** | Enter 6-digit code across the 6 boxes. Paste a 6-digit number or use arrow/backspace keys. | Auto-focus advances per digit. Submitting valid code activates account (`isVerified=true`), clears OTP from DB, fires confetti, and redirects to `/login` with prefilled email. No JWT is issued during verification. | **VERIFIED** |
| **4. Unverified Login Block** | Attempt to log in before verifying OTP. | Server returns `403 Forbidden` with `{ isUnverified: true }`. UI shows warning banner with direct link to OTP verification. | **VERIFIED** |
| **5. Verified Login & Cookies** | Enter verified credentials at `/login`. | Server compares bcrypt 12 hash, signs JWT, sets `Set-Cookie: token=...; HttpOnly; SameSite=Lax; Path=/`, and client restores session via `/user/me`. | **VERIFIED** |
| **6. Failed Login Lockout** | Enter 5 consecutive wrong passwords. | Account locks out for 15 minutes (`423 Locked`), returning remaining minutes before allowing retry. | **VERIFIED** |
| **7. Dashboard (Unregistered)** | Visit `/dashboard` with newly created account. | Shows profile card with "Email Verified" badge. Shows alert card: "No Active Registration" with a "Register Now" button linking to `/register`. | **VERIFIED** |
| **8. Multi-Step Registration** | Go to `/register`. Walk through Steps 1 to 4: Personal, Academic, Project, and Team. | Step 1 checks Indian phone (`/^[6-9]\d{9}$/`). Step 2 tests dropdowns (including IIIT Una & "Other"). Step 3 tests URL validators (PPT, Prototype, Demo Video). Step 4 adjusts team member boxes dynamically: Solo = 0 additional boxes; Size 2–5 = exactly $N$ member entry boxes. | **VERIFIED** |
| **9. Submission & Confirmation** | Click "Submit Official Registration" on Step 4. | Celebratory confetti fires! Success screen displays summary. Server dispatches confirmation email with project & roster details, updating `emailDeliveryStatus` to `sent` or `failed`. | **VERIFIED** |
| **10. Duplicate Prevention** | Try visiting `/register` again or submitting another entry. | Route automatically detects active registration and shows "You are already registered!". Server rejects duplicate with `409 Conflict`. | **VERIFIED** |
| **11. Dashboard (Registered)** | Visit `/dashboard`. | Displays project details, institutional info, presentation & code links, deliverables editor (`PUT /api/hackathon/:id`), and full team roster table. | **VERIFIED** |
| **12. Withdrawal / Delete** | Click "Withdraw Entry" on Dashboard, confirm in Modal. | Registration deleted (`DELETE /api/hackathon/:id`), dashboard refreshes to unregistered state, allowing re-registration. | **VERIFIED** |
| **13. Contact Form** | Visit `/contact`. Enter Name, Email, Message, click submit. | Sends message to `matrucareai@gmail.com` via Nodemailer service, shows success confirmation. | **VERIFIED** |
| **14. Logout** | Click Logout icon in Navbar. | Calls `POST /api/auth/logout`, server clears HttpOnly `token` cookie, client state cleared, redirected to Home. | **VERIFIED** |

---

## 3. Edge Case Validation Matrix

### A. Authentication & OTP Edge Cases
- **15-Character Minimum Password**: Signup rejects passwords shorter than 15 characters or missing uppercase, lowercase, number, or special symbol.
- **HMAC OTP Secret & Timing Safe Equality**: OTPs are hashed using HMAC-SHA256 with server-side `OTP_SECRET` and verified using `crypto.timingSafeEqual`.
- **Wrong OTP Attempts**: Each wrong attempt atomically increments `otpAttempts`. On the 5th failed attempt, the OTP is wiped and user is locked out from OTP verification until requesting a fresh code.
- **Expired OTP**: Codes older than 10 minutes return `400 Bad Request` ("Verification code has expired. Please request a new code.").
- **OTP Re-use Prevention**: Once verified, the stored `otpHash` is wiped to `null`. Submitting the same OTP again cannot re-authenticate.
- **Resend Cooldown**: Calling `/api/auth/resend-otp` within 45 seconds returns `429 Too Many Requests` with remaining seconds countdown.
- **Unverified User Login**: Prevents token issuance and explicitly instructs the user to complete verification (`403 Forbidden`).
- **Account-Based Brute Force Lockout**: 5 failed login attempts lock the account for 15 minutes (`lockUntil`), protecting against distributed dictionary attacks.

### B. Hackathon Registration Edge Cases
- **Team Size Logic**:
  - `teamSize = 1`: Solo participant. Form displays logged-in team lead card with 0 additional team member input boxes.
  - `teamSize = 2`: Exactly 2 team member entry boxes (in addition to the team lead card).
  - `teamSize = 3`: Exactly 3 team member entry boxes.
  - `teamSize = 4`: Exactly 4 team member entry boxes.
  - `teamSize = 5`: Exactly 5 team member entry boxes.
- **Invalid Mobile Format**: Numbers not matching `/^[6-9]\d{9}$/` (e.g. `1234567890` or `abc`) are rejected by server-side express-validator and frontend regex.
- **Duplicate Team Member Emails**: Entering the same email address for two different members or matching the team leader's email triggers inline error "Duplicate team member email detected".
- **Invalid URL Format**: PPT and Prototype links require valid protocol-compliant URLs (`http://` or `https://`).
- **Owner-Guarded Mutations**: If a user attempts to update or delete a registration ID belonging to another user, `PUT /api/hackathon/:id` and `DELETE /api/hackathon/:id` return `403 Forbidden`.

### C. Network, Rate Limiting & Cookies
- **HttpOnly Cookie Authentication**: JWT tokens are issued with `httpOnly: true`, `sameSite: 'lax'`, `path: '/'`, and `secure: process.env.NODE_ENV === 'production'`. Dual mode supports `Authorization: Bearer <token>` for headless testing.
- **CSRF Defense**: Client sends custom header `X-Requested-With: XMLHttpRequest` with all Axios requests; Express verifies headers and CORS origin restrictions.
- **Rate Limiting**: Auth endpoints guarded with `express-rate-limit` (30 requests/15 min for auth, 15 requests/10 min for OTP, 10 requests/15 min for contact).
