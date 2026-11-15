# MatruCare AI - Video Demonstration Script (3-5 Minutes)

**Target Duration:** 3 minutes 45 seconds  
**Speaker Role:** Senior Full-Stack Engineer & Product Lead  
**Event:** MatruCare AI Maternal Health Hackathon 2026 Portal Walkthrough  

---

### [00:00 - 00:35] Scene 1: Introduction & Landing Experience
- **Visual:** Browser showing `http://localhost:5173/`. Cursor hovers over the hero title "Innovate for Mothers. Engineer with AI."
- **Audio (Presenter):**  
  > *"Hello everyone! Welcome to the official walkthrough of the MatruCare AI Hackathon Registration Portal. MatruCare AI is hosting a premier AI & maternal health tech hackathon for developers, students, and engineers.  
  > Notice our high-energy hackathon design system with electric indigo (#6366F1), cyber cyan (#06B6D4), and deep obsidian (#0A0A0F) dark mode styling. As we scroll down, you see the live metrics counter, our 5 dedicated technology tracks, the prize pool section featuring ₹5,00,000 in grants, an interactive roadmap timeline, and an FAQ accordion."*

---

### [00:35 - 01:10] Scene 2: Account Creation & Security Validations
- **Visual:** Click "Register Your Project" in the hero, opening `/signup`.
- **Audio (Presenter):**  
  > *"Let's register as a new participant. I'll enter our lead developer's name, email, and a password. Watch the real-time security strength meter adapt as I type uppercase, lowercase, numbers, and symbols. If I type mismatched passwords or an invalid email, inline field validation alerts me immediately with micro-animations.  
  > Clicking 'Send Verification Code' submits to our Express backend, hashes the password with bcrypt, generates a secure 6-digit one-time passcode using Node's crypto.randomInt, hashes the OTP with HMAC-SHA256 in the database with a 10-minute expiry, and dispatches our branded HTML email."*

---

### [01:10 - 01:45] Scene 3: 6-Box OTP Verification & Resend Cooldown
- **Visual:** Page smoothly transitions to `/verify-otp?email=...`. Demonstrates pasting or typing digits.
- **Audio (Presenter):**  
  > *"Here is our dedicated 6-box OTP verification screen. It supports auto-focusing the next box on input, backspace reversal, arrow key navigation, and full clipboard paste support.  
  > Notice the resend cooldown timer counting down 45 seconds to prevent email spam. If someone tries to enter a wrong code, the backend rejects it with an error and enforces a 5-attempt lockout. When we enter the valid code, the backend marks the user as verified, immediately invalidates the OTP so it cannot be reused, and routes us to the Login screen with a success toast."*

---

### [01:45 - 02:15] Scene 4: Login & Authentication Guard
- **Visual:** Shows `/login`. First demonstrates typing an unverified account (or wrong password), then logs in with verified credentials.
- **Audio (Presenter):**  
  > *"On the login screen, unverified accounts are strictly blocked with a 403 Forbidden status and a direct one-click link to complete OTP verification.  
  > Now, logging in with our verified credentials: the backend checks the password against bcrypt, signs a JSON Web Token with 7-day validity, and our frontend Axios interceptor automatically attaches the Bearer token and HttpOnly cookies to all future requests. We land directly on the protected User Dashboard."*

---

### [02:15 - 03:00] Scene 5: Multi-Step Hackathon Registration Form
- **Visual:** Click "Register Your Project Now" from Dashboard, navigating to `/register`.
- **Audio (Presenter):**  
  > *"Because our account doesn't have an active registration yet, the Dashboard prompts us with a clear CTA. Let's click 'Register Your Project Now'.  
  > We engineered a 4-step progressive disclosure registration form:
  > - **Step 1:** Personal details. Full name validates letters and spaces only. Email is locked and pre-filled from our verified auth session to prevent identity spoofing. Mobile validates 10-digit Indian numbers starting with 6 through 9.  
  > - **Step 2:** Academic details. Includes premier institutes like IIIT Una, IITs, NITs, and an 'Other' option with custom text input, alongside degree and engineering branch dropdowns.  
  > - **Step 3:** Project pitch. Here we select our track—such as Autonomous AI & Generative Agents—enter our project title, and link our Google Drive pitch deck and GitHub prototype repo.  
  > - **Step 4:** Team roster. Notice this dynamic team selector: Team Size 1 is solo (no extra member boxes); selecting Team Size 3 dynamically renders 3 member entry boxes, while displaying the team lead separately. It prevents duplicate member emails and ensures team members cannot have the same email as the team leader."*

---

### [03:00 - 03:30] Scene 6: Celebratory Submission & Confirmation Email
- **Visual:** Click "Submit Official Registration". Canvas confetti shoots across the screen. Confirmed summary card renders.
- **Audio (Presenter):**  
  > *"When we click Submit, the registration is validated on both client and server, stored with a unique index to guarantee one submission per user, and a celebratory confetti burst fires!  
  > Nodemailer immediately dispatches our second responsive HTML email: a complete confirmation summary sent strictly from 'MatruCare AI' <matrucareai@gmail.com>, containing the project name, domain, and full team roster table."*

---

### [03:30 - 03:45] Scene 7: Dashboard Management & Summary
- **Visual:** Navigate back to `/dashboard`, showing the active project card, links, roster, and modal for "Withdraw Entry".
- **Audio (Presenter):**  
  > *"Back on the Dashboard, our submission is active. The user can review all pitch links, view the team roster, update deliverables in-place, download a digital pass, or withdraw their entry with modal confirmation.  
  > Thank you for reviewing the MatruCare AI Hackathon Portal—built with full security, responsiveness, clean architecture, and 100% fidelity to the assignment brief."*
