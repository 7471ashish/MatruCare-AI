/**
 * Email templates for MatruCare AI Hackathon 2026 Portal
 * Professional design theme matching the MatruCare AI portal.
 * All user-supplied fields are HTML-escaped to prevent injection.
 * Sender & Support: matrucareai@gmail.com | "MatruCare AI"
 */

/**
 * Helper to safely escape user inputs for HTML templates
 * @param {string} str
 * @returns {string}
 */
const escapeHtml = (str) => {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Generates OTP verification email HTML & text
 * @param {string} fullName - Recipient's full name
 * @param {string} otp - 6-digit verification code
 * @returns {{ html: string, text: string }}
 */
const getOtpEmailTemplate = (fullName, otp) => {
  const safeFullName = escapeHtml(fullName);
  const safeOtp = escapeHtml(otp);

  const text = `Hello ${fullName},\n\nYour MatruCare AI verification passcode is: ${otp}\n\nThis one-time passcode is valid for 10 minutes and can only be used once. Please do not share this code with anyone.\n\nBest regards,\nMatruCare AI`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MatruCare AI - Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0A0A0F; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 580px; background-color: #12111E; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%); padding: 32px 30px; text-align: center;">
              <h1 style="margin: 0; color: #FFFFFF; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                MatruCare AI
              </h1>
              <p style="margin: 6px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                MatruCare AI Hackathon 2026
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 14px; font-size: 20px; color: #FFFFFF; font-weight: 700;">
                Verify Your Account
              </h2>
              <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #9CA3AF;">
                Hello <strong>${safeFullName}</strong>, thank you for registering for the MatruCare AI Hackathon 2026. Use the 6-digit one-time passcode below to verify your email address and activate your account.
              </p>

              <!-- OTP Display Box -->
              <div style="margin: 28px 0; text-align: center;">
                <div style="display: inline-block; background-color: #07060D; border: 2px dashed #6366F1; border-radius: 12px; padding: 18px 36px;">
                  <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #22D3EE; font-family: 'Courier New', Courier, monospace;">
                    ${safeOtp}
                  </span>
                </div>
              </div>

              <!-- Expiry Alert -->
              <div style="background-color: rgba(99, 102, 241, 0.1); border-left: 4px solid #6366F1; padding: 12px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13px; color: #C7D2FE; line-height: 1.5;">
                  <strong>Important:</strong> This verification code expires in <strong>10 minutes</strong> and can only be used once. If you did not request this code, you can safely ignore this email.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6B7280;">
                Get your stack ready. We look forward to your project submission!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B0B14; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0 0 6px; font-size: 12px; color: #6B7280;">
                Sent by <strong>MatruCare AI</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #4B5563;">
                Questions? Email <a href="mailto:matrucareai@gmail.com" style="color: #22D3EE; text-decoration: none;">matrucareai@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { html, text };
};

/**
 * Generates Hackathon Registration Confirmation Email
 * @param {object} reg - Registration details
 * @returns {{ html: string, text: string }}
 */
const getRegistrationEmailTemplate = (reg) => {
  const safeFullName = escapeHtml(reg.fullName);
  const safeProjectName = escapeHtml(reg.projectName);
  const safeDomain = escapeHtml(reg.domain);
  const safeCollegeName = escapeHtml(reg.collegeName);
  const safeCourse = escapeHtml(reg.course);
  const safeBranch = escapeHtml(reg.branch);
  const safeYearOfStudy = escapeHtml(reg.yearOfStudy);
  const safeMobile = escapeHtml(reg.mobile);
  const safeTeamSize = escapeHtml(reg.teamSize);
  const safePptLink = escapeHtml(reg.pptLink);
  const safePrototypeLink = escapeHtml(reg.prototypeLink);
  const safeDemoVideoLink = reg.demoVideoLink ? escapeHtml(reg.demoVideoLink) : null;

  const teamMembersList =
    reg.teamMembers && reg.teamMembers.length > 0
      ? reg.teamMembers
          .map(
            (m, i) =>
              `<tr><td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #E5E7EB;">${i + 1}. ${escapeHtml(m.name)}</td><td style="padding: 10px 12px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: #22D3EE; font-family: monospace;">${escapeHtml(m.email)}</td></tr>`
          )
          .join('')
      : '<tr><td colspan="2" style="padding: 12px; font-size: 13px; color: #6B7280; font-style: italic;">Solo Participant (No additional members)</td></tr>';

  const teamMembersText =
    reg.teamMembers && reg.teamMembers.length > 0
      ? reg.teamMembers.map((m, i) => `  ${i + 1}. ${m.name} (${m.email})`).join('\n')
      : '  Solo Participant';

  const text = `Hello ${reg.fullName},\n\nCongratulations! Your registration for MatruCare AI Hackathon 2026 has been successfully confirmed.\n\nSummary of Entry:\n- Project: ${reg.projectName}\n- Track: ${reg.domain}\n- Team Size: ${reg.teamSize}\n- Institution: ${reg.collegeName}\n- Degree & Branch: ${reg.course} (${reg.branch}) - Year: ${reg.yearOfStudy}\n- Presentation Deck: ${reg.pptLink}\n- Prototype / Code Repo: ${reg.prototypeLink}\n\nTeam Roster:\n${teamMembersText}\n\nBest regards,\nMatruCare AI`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MatruCare AI - Registration Confirmed</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0A0A0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F3F4F6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #0A0A0F; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width: 620px; background-color: #12111E; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1);" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4F46E5 0%, #06B6D4 100%); padding: 36px 30px; text-align: center;">
              <span style="background-color: rgba(0, 0, 0, 0.3); color: #FFFFFF; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                REGISTRATION CONFIRMED
              </span>
              <h1 style="margin: 14px 0 0; color: #FFFFFF; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">
                MatruCare AI Hackathon 2026
              </h1>
              <p style="margin: 6px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 13px; font-family: monospace;">
                Registration Confirmed
              </p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px 28px;">
              <h2 style="margin: 0 0 12px; font-size: 20px; color: #FFFFFF; font-weight: 700;">
                Welcome aboard, ${safeFullName}!
              </h2>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #9CA3AF;">
                Your submission for <strong>MatruCare AI Hackathon 2026</strong> has been received and verified. Below is the official summary of your team's submission.
              </p>

              <!-- Project Card -->
              <div style="background-color: #07060D; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <table width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #6B7280; width: 140px;"><strong>Project Title:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #FFFFFF; font-weight: 700;">${safeProjectName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #6B7280;"><strong>Track / Domain:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #22D3EE; font-weight: 600;">${safeDomain}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #6B7280;"><strong>Institution:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #E5E7EB;">${safeCollegeName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #6B7280;"><strong>Degree & Branch:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #E5E7EB;">${safeCourse} - ${safeBranch} (${safeYearOfStudy})</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; font-size: 13px; color: #6B7280;"><strong>Team Size:</strong></td>
                    <td style="padding: 6px 0; font-size: 14px; color: #34D399; font-weight: 700;">${safeTeamSize} Member(s)</td>
                  </tr>
                </table>
              </div>

              <!-- Team Roster Section -->
              <h3 style="margin: 0 0 10px; font-size: 14px; color: #FFFFFF; font-weight: 700; text-transform: uppercase; font-family: monospace;">
                Team Roster:
              </h3>
              <table width="100%" cellspacing="0" cellpadding="0" border="0" style="border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #07060D;">
                    <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6B7280; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-family: monospace;">Member Name</th>
                    <th align="left" style="padding: 10px 12px; font-size: 12px; color: #6B7280; border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-family: monospace;">Email</th>
                  </tr>
                </thead>
                <tbody>
                  ${teamMembersList}
                </tbody>
              </table>

              <!-- Deliverable Links -->
              <div style="background-color: #07060D; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px; font-size: 13px; font-weight: 700; color: #E5E7EB; font-family: monospace;">Submitted Links:</p>
                <p style="margin: 4px 0; font-size: 13px;">
                  Presentation Deck: <a href="${safePptLink}" target="_blank" style="color: #22D3EE; word-break: break-all;">${safePptLink}</a>
                </p>
                <p style="margin: 4px 0; font-size: 13px;">
                  Prototype / Code: <a href="${safePrototypeLink}" target="_blank" style="color: #22D3EE; word-break: break-all;">${safePrototypeLink}</a>
                </p>
                ${
                  safeDemoVideoLink
                    ? `<p style="margin: 4px 0; font-size: 13px;">Demo Video: <a href="${safeDemoVideoLink}" target="_blank" style="color: #22D3EE; word-break: break-all;">${safeDemoVideoLink}</a></p>`
                    : ''
                }
              </div>

              <p style="margin: 0; font-size: 13px; line-height: 1.6; color: #6B7280;">
                The technical review committee will evaluate entries according to the hackathon guidelines. Good luck!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0B0B14; padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.05);">
              <p style="margin: 0 0 6px; font-size: 12px; color: #6B7280;">
                Sent by <strong>MatruCare AI</strong>
              </p>
              <p style="margin: 0; font-size: 12px; color: #4B5563;">
                Support desk: <a href="mailto:matrucareai@gmail.com" style="color: #22D3EE; text-decoration: none;">matrucareai@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return { html, text };
};

/**
 * Generates Contact Message Notification Email
 * @param {object} contact - Contact form submission
 * @returns {{ html: string, text: string }}
 */
const getContactEmailTemplate = (contact) => {
  const safeName = escapeHtml(contact.name);
  const safeEmail = escapeHtml(contact.email);
  const safeCategory = escapeHtml(contact.category || 'General Inquiry');
  const safeMessage = escapeHtml(contact.message);

  const text = `New Contact Inquiry for MatruCare AI:\n\nName: ${contact.name}\nEmail: ${contact.email}\nCategory: ${contact.category || 'General Inquiry'}\nMessage:\n${contact.message}\n`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New MatruCare AI Inquiry</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #0A0A0F; padding: 20px; color: #F3F4F6;">
  <div style="max-width: 540px; margin: 0 auto; background: #12111E; border-radius: 12px; padding: 24px; border: 1px solid rgba(255, 255, 255, 0.1);">
    <h2 style="color: #22D3EE; margin-top: 0;">New MatruCare AI Inquiry</h2>
    <p><strong>From:</strong> ${safeName} (${safeEmail})</p>
    <p><strong>Category:</strong> ${safeCategory}</p>
    <p><strong>Message:</strong></p>
    <div style="background: #07060D; padding: 15px; border-radius: 8px; border-left: 4px solid #6366F1; white-space: pre-wrap; color: #E5E7EB;">${safeMessage}</div>
    <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
    <p style="font-size: 12px; color: #6B7280;">MatruCare AI Notification System • Support: matrucareai@gmail.com</p>
  </div>
</body>
</html>
  `;

  return { html, text };
};

module.exports = {
  escapeHtml,
  getOtpEmailTemplate,
  getRegistrationEmailTemplate,
  getContactEmailTemplate,
};
