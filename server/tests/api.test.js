const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const mongoose = require('mongoose');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'matrucare_ai_2026_super_secure_jwt_secret_key_min32chars!';
process.env.OTP_SECRET = 'matrucare_ai_2026_super_secure_otp_hmac_secret_min32chars!';
const TEST_DB_URI = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/matrucare_hackathon_test';

const app = require('../src/app');
const { connectDB, disconnectDB } = require('../src/config/db');
const User = require('../src/models/User');
const HackathonRegistration = require('../src/models/HackathonRegistration');
const { hashOtp } = require('../src/utils/otpGenerator');

describe('MatruCare AI Hackathon 2026 - Security & Integration Test Suite', () => {
  let authToken = null;
  let authCookie = null;
  let testUserId = null;
  let registeredEntryId = null;

  const testUser = {
    fullName: 'Test Participant',
    email: 'test.participant@matrucare.org',
    password: 'SecurePassphrase@2026!',
  };

  before(async () => {
    await connectDB(TEST_DB_URI);
    await User.deleteMany({});
    await HackathonRegistration.deleteMany({});
  });

  after(async () => {
    try {
      await User.deleteMany({});
      await HackathonRegistration.deleteMany({});
      await disconnectDB();
    } catch (err) {
      // Cleanup
    }
  });

  // 1. Health Endpoint
  it('GET /health returns 200 and operational status', async () => {
    const res = await request(app).get('/health');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.match(res.body.message, /MatruCare AI Hackathon 2026/);
  });

  // 2. Signup Validation: Password length < 15 must be rejected
  it('POST /api/auth/signup blocks password shorter than 15 characters with 400', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test Participant',
      email: testUser.email,
      password: 'ShortPass1!', // 11 chars
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
    assert.ok(Array.isArray(res.body.errors));
    assert.ok(res.body.errors.some((e) => e.message.includes('15 characters')));
  });

  // 3. Signup Validation: Weak password (missing special char or numbers) rejected
  it('POST /api/auth/signup blocks weak password lacking numbers or special characters', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      fullName: 'Test Participant',
      email: testUser.email,
      password: 'LongPasswordWithoutSpecialCharOrNumbers',
    });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 4. Successful Signup
  it('POST /api/auth/signup creates unverified user with HMAC OTP and returns 201', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);

    const user = await User.findOne({ email: testUser.email }).select(
      '+otpHash +otpExpiresAt +otpAttempts'
    );
    assert.ok(user);
    assert.strictEqual(user.isVerified, false);
    assert.ok(user.otpHash);
    assert.strictEqual(user.otpAttempts, 0);
    assert.ok(user.otpExpiresAt > new Date());
    testUserId = user._id;
  });

  // 5. Duplicate Signup Check
  it('POST /api/auth/signup updates unverified user with fresh OTP if not verified yet', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUser);
    assert.strictEqual(res.statusCode, 201);
  });

  // 6. Resend Cooldown Enforcement
  it('POST /api/auth/resend-otp enforces 45-second cooldown on immediate retry', async () => {
    const res = await request(app).post('/api/auth/resend-otp').send({ email: testUser.email });
    assert.strictEqual(res.statusCode, 429);
    assert.strictEqual(res.body.success, false);
    assert.ok(res.body.data.retryAfterSeconds > 0);
  });

  // 7. Unverified User Login Block
  it('POST /api/auth/login blocks unverified user with 403 and isUnverified=true', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    assert.strictEqual(res.statusCode, 403);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.data.isUnverified, true);
  });

  // 8. Wrong Password Rejected Before isVerified Leak
  it('POST /api/auth/login rejects wrong password with 401 without revealing unverified state', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'IncorrectPassword123!',
    });
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.data, null);
  });

  // 9. OTP Attempt Limiting & Invalidation
  it('POST /api/auth/verify-otp tracks wrong attempts and invalidates OTP after 5 failures', async () => {
    for (let i = 0; i < 4; i++) {
      const res = await request(app).post('/api/auth/verify-otp').send({
        email: testUser.email,
        otp: '000000',
      });
      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    }

    // 5th incorrect attempt must lock out
    const finalRes = await request(app).post('/api/auth/verify-otp').send({
      email: testUser.email,
      otp: '000000',
    });
    assert.strictEqual(finalRes.statusCode, 400);
    assert.match(finalRes.body.message, /invalidated/i);

    const user = await User.findOne({ email: testUser.email }).select('+otpHash');
    assert.strictEqual(user.otpHash, null);
  });

  // 10. Resend OTP After Reset
  it('POST /api/auth/resend-otp issues new HMAC OTP after resetting cooldown', async () => {
    await User.updateOne({ email: testUser.email }, { otpLastSentAt: null });

    const res = await request(app).post('/api/auth/resend-otp').send({ email: testUser.email });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 11. Expired OTP Rejection
  it('POST /api/auth/verify-otp rejects expired OTP', async () => {
    await User.updateOne(
      { email: testUser.email },
      {
        otpHash: hashOtp('123456'),
        otpExpiresAt: new Date(Date.now() - 1000), // expired
      }
    );

    const res = await request(app).post('/api/auth/verify-otp').send({
      email: testUser.email,
      otp: '123456',
    });
    assert.strictEqual(res.statusCode, 400);
    assert.match(res.body.message, /expired/i);
  });

  // 12. Valid OTP Verification (Strictly Redirects to Login, No JWT Issued)
  it('POST /api/auth/verify-otp successfully verifies valid HMAC OTP and does NOT issue JWT', async () => {
    const validTestOtp = '789123';
    await User.updateOne(
      { email: testUser.email },
      {
        otpHash: hashOtp(validTestOtp),
        otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
        otpAttempts: 0,
      }
    );

    const res = await request(app).post('/api/auth/verify-otp').send({
      email: testUser.email,
      otp: validTestOtp,
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.isVerified, true);
    // Verified: No token generated in verify-otp
    assert.strictEqual(res.body.data.token, undefined);

    const userRecord = await User.findOne({ email: testUser.email }).select('+otpHash');
    assert.strictEqual(userRecord.isVerified, true);
    assert.strictEqual(userRecord.otpHash, null);
  });

  // 13. Login After Verification (Issues HttpOnly Cookie & JWT)
  it('POST /api/auth/login issues JWT token and sets HttpOnly cookie after verification', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.ok(res.body.data.user);

    authToken = res.body.data.token;

    // Check Set-Cookie header
    const cookies = res.headers['set-cookie'];
    assert.ok(cookies);
    const tokenCookie = cookies.find((c) => c.startsWith('token='));
    assert.ok(tokenCookie);
    assert.match(tokenCookie, /HttpOnly/i);
    authCookie = tokenCookie.split(';')[0];
  });

  // 14. Account-based Lockout on 5 Consecutive Failed Password Attempts
  it('POST /api/auth/login locks account for 15 minutes after 5 failed password attempts', async () => {
    for (let i = 0; i < 4; i++) {
      const res = await request(app).post('/api/auth/login').send({
        email: testUser.email,
        password: 'WrongPasswordAttempts@2026',
      });
      assert.strictEqual(res.statusCode, 401);
    }

    // 5th attempt locks account
    const lockedRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: 'WrongPasswordAttempts@2026',
    });
    assert.strictEqual(lockedRes.statusCode, 429);
    assert.match(lockedRes.body.message, /locked/i);

    // Reset lock for remaining test suite
    await User.updateOne({ email: testUser.email }, { $set: { failedLoginAttempts: 0, lockUntil: null } });
  });

  // 15. Protected Route Access with HttpOnly Cookie
  it('GET /api/user/me returns profile when HttpOnly cookie is supplied', async () => {
    const res = await request(app).get('/api/user/me').set('Cookie', [authCookie]);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.email, testUser.email);
  });

  // 16. Protected Route Access with Authorization Header Fallback
  it('GET /api/user/me returns profile when Bearer token header is supplied', async () => {
    const res = await request(app).get('/api/user/me').set('Authorization', `Bearer ${authToken}`);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.user.email, testUser.email);
  });

  // 17. Protected Route Rejection Without Token or Cookie
  it('GET /api/user/me blocks request without token or cookie with 401', async () => {
    const res = await request(app).get('/api/user/me');
    assert.strictEqual(res.statusCode, 401);
    assert.strictEqual(res.body.success, false);
  });

  // 18. Profile Update
  it('PUT /api/user/update updates full name', async () => {
    const res = await request(app)
      .put('/api/user/update')
      .set('Cookie', [authCookie])
      .send({ fullName: 'Updated Participant Name' });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data.user.fullName, 'Updated Participant Name');
  });

  // 19. Hackathon Registration: Reject Invalid Mobile & URLs
  it('POST /api/hackathon/register rejects invalid phone number and invalid URLs', async () => {
    const res = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [authCookie])
      .send({
        fullName: 'Test Participant',
        mobile: '12345', // Invalid
        collegeName: 'IIIT Una',
        course: 'B.Tech',
        branch: 'Computer Science and Engineering',
        yearOfStudy: '3rd',
        domain: 'Autonomous AI & Generative Agents',
        projectName: 'AI', // Too short
        pptLink: 'not-a-valid-url',
        prototypeLink: 'javascript:alert(1)',
        teamSize: 1,
        teamMembers: [],
      });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 20. Team Size Validation: Team Size 3 requires exactly 3 additional member boxes
  it('POST /api/hackathon/register enforces teamSize = 3 requiring exactly 3 member entries', async () => {
    const res = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [authCookie])
      .send({
        fullName: 'Test Participant',
        mobile: '9876543210',
        collegeName: 'IIIT Una',
        course: 'B.Tech',
        branch: 'Computer Science and Engineering',
        yearOfStudy: '3rd',
        domain: 'Autonomous AI & Generative Agents',
        projectName: 'MatruCare AI Diagnostic Agent',
        pptLink: 'https://drive.google.com/presentation/d/sample',
        prototypeLink: 'https://github.com/sample/matrucare-ai-model',
        teamSize: 3,
        teamMembers: [
          { name: 'Dr Sarah Connor', email: 'sarah.connor@example.com' },
          // Missing 2nd and 3rd members (only 1 provided)
        ],
      });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 21. Rejection of Lead Email in Team Members
  it('POST /api/hackathon/register rejects team member email matching lead email', async () => {
    const res = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [authCookie])
      .send({
        fullName: 'Test Participant',
        mobile: '9876543210',
        collegeName: 'IIIT Una',
        course: 'B.Tech',
        branch: 'Computer Science and Engineering',
        yearOfStudy: '3rd',
        domain: 'Autonomous AI & Generative Agents',
        projectName: 'MatruCare AI Diagnostics',
        pptLink: 'https://drive.google.com/presentation/d/sample',
        prototypeLink: 'https://github.com/sample/matrucare-ai-model',
        teamSize: 2,
        teamMembers: [
          { name: 'Dr Sarah Connor', email: 'sarah.connor@example.com' },
          { name: 'Lead Duplicate', email: testUser.email }, // Matches lead
        ],
      });
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.success, false);
  });

  // 22. Solo Registration (Team Size 1 requires 0 additional members)
  it('POST /api/hackathon/register creates solo entry with teamSize = 1 and 0 members', async () => {
    const res = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [authCookie])
      .send({
        fullName: 'Test Participant',
        mobile: '9876543210',
        collegeName: 'IIIT Una',
        course: 'B.Tech',
        branch: 'Computer Science and Engineering',
        yearOfStudy: '3rd',
        domain: 'Autonomous AI & Generative Agents',
        projectName: 'MatruCare AI Diagnostics',
        pptLink: 'https://drive.google.com/presentation/d/sample',
        prototypeLink: 'https://github.com/sample/matrucare-ai-model',
        demoVideoLink: 'https://youtube.com/watch?v=sample',
        teamSize: 1,
        teamMembers: [],
      });
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.data.registration._id);
    assert.strictEqual(res.body.data.registration.teamSize, 1);
    assert.strictEqual(res.body.data.registration.teamMembers.length, 0);
    assert.ok(['sent', 'failed'].includes(res.body.data.registration.emailDeliveryStatus));
    registeredEntryId = res.body.data.registration._id;
  });

  // 23. Duplicate Hackathon Registration Prevention
  it('POST /api/hackathon/register blocks duplicate registration with 409 conflict', async () => {
    const res = await request(app)
      .post('/api/hackathon/register')
      .set('Cookie', [authCookie])
      .send({
        fullName: 'Test Participant',
        mobile: '9876543210',
        collegeName: 'IIIT Una',
        course: 'B.Tech',
        branch: 'Computer Science and Engineering',
        yearOfStudy: '3rd',
        domain: 'Autonomous AI & Generative Agents',
        projectName: 'Another Project Name',
        pptLink: 'https://drive.google.com/presentation/d/sample',
        prototypeLink: 'https://github.com/sample/repo',
        teamSize: 1,
        teamMembers: [],
      });
    assert.strictEqual(res.statusCode, 409);
    assert.strictEqual(res.body.success, false);
  });

  // 24. Fetch My Entry
  it('GET /api/hackathon/my-entry returns user registration', async () => {
    const res = await request(app).get('/api/hackathon/my-entry').set('Cookie', [authCookie]);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.data.registration._id, registeredEntryId);
  });

  // 25. Unauthorized Registration Update/Deletion Blocked
  it('PUT /api/hackathon/:id and DELETE /api/hackathon/:id prevent non-owner modification', async () => {
    const otherUser = await User.create({
      fullName: 'Other Hacker',
      email: 'other.hacker@example.com',
      password: 'OtherPassword@2026!',
      isVerified: true,
    });
    const jwt = require('jsonwebtoken');
    const otherToken = jwt.sign(
      { id: otherUser._id, email: otherUser.email },
      process.env.JWT_SECRET
    );

    const updateRes = await request(app)
      .put(`/api/hackathon/${registeredEntryId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ projectName: 'Hacked Project Name' });
    assert.strictEqual(updateRes.statusCode, 403);

    const deleteRes = await request(app)
      .delete(`/api/hackathon/${registeredEntryId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    assert.strictEqual(deleteRes.statusCode, 403);
  });

  // 26. Owner Updates Deliverables
  it('PUT /api/hackathon/:id permits owner to update project deliverables', async () => {
    const res = await request(app)
      .put(`/api/hackathon/${registeredEntryId}`)
      .set('Cookie', [authCookie])
      .send({
        projectName: 'Updated Project Title AI',
        pptLink: 'https://drive.google.com/presentation/d/updated',
      });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.data.registration.projectName, 'Updated Project Title AI');
  });

  // 27. Owner Deletes Entry
  it('DELETE /api/hackathon/:id permits owner to delete their entry', async () => {
    const res = await request(app)
      .delete(`/api/hackathon/${registeredEntryId}`)
      .set('Cookie', [authCookie]);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });

  // 28. Logout Endpoint Clears Cookie
  it('POST /api/auth/logout successfully clears HttpOnly authentication cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);

    const cookies = res.headers['set-cookie'];
    assert.ok(cookies);
    const tokenCookie = cookies.find((c) => c.startsWith('token='));
    assert.ok(tokenCookie);
    // Token value cleared or set to expire in past
    assert.ok(tokenCookie.includes('token=;') || tokenCookie.includes('Expires='));
  });

  // 29. Contact Message Dispatch
  it('POST /api/contact sends inquiry message successfully', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'Dr. Jane Visitor',
      email: 'visitor@example.com',
      message: 'Can our university team participate with a multimodal CTG AI model?',
    });
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.success, true);
  });
});
