const HackathonRegistration = require('../models/HackathonRegistration');
const { sendRegistrationEmail } = require('../utils/emailService');
const { isValidHttpUrl } = require('../utils/urlValidator');

/**
 * POST /api/hackathon/register
 * Protected, validate, save, track email delivery status ('pending'|'sent'|'failed'), block duplicates
 */
const registerForHackathon = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Check for existing registration for this user
    const existingEntry = await HackathonRegistration.findOne({ user: userId });
    if (existingEntry) {
      return res.status(409).json({
        success: false,
        message: 'You have already registered for MatruCare AI Hackathon 2026. Only one registration per account is permitted.',
        data: {
          registrationId: existingEntry._id,
          projectName: existingEntry.projectName,
        },
      });
    }

    const {
      fullName,
      mobile,
      collegeName,
      course,
      branch,
      yearOfStudy,
      domain,
      projectName,
      pptLink,
      prototypeLink,
      demoVideoLink,
      teamSize,
      teamMembers,
    } = req.body;

    // Strict security: always use authenticated user's email
    const registrationEmail = req.user.email.toLowerCase().trim();

    // Clean team members:
    // Team size 1: 0 additional members
    // Team size N (2-5): exactly N additional members
    const size = parseInt(teamSize, 10);
    let sanitizedTeamMembers = [];
    if (size > 1 && Array.isArray(teamMembers)) {
      sanitizedTeamMembers = teamMembers.slice(0, size).map((m) => ({
        name: m.name ? m.name.trim() : '',
        email: m.email ? m.email.trim().toLowerCase() : '',
      }));
    }

    // Reject any team member email matching the team leader's email
    if (sanitizedTeamMembers.some((m) => m.email === registrationEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Team member email cannot be the same as the team leader email',
        data: null,
      });
    }

    const registration = new HackathonRegistration({
      user: userId,
      fullName: fullName.trim(),
      email: registrationEmail,
      mobile: mobile.trim(),
      collegeName: collegeName.trim(),
      course: course.trim(),
      branch: branch.trim(),
      yearOfStudy: yearOfStudy.trim(),
      domain: domain.trim(),
      projectName: projectName.trim(),
      pptLink: pptLink.trim(),
      prototypeLink: prototypeLink.trim(),
      demoVideoLink: demoVideoLink ? demoVideoLink.trim() : '',
      teamSize: size,
      teamMembers: sanitizedTeamMembers,
      emailDeliveryStatus: 'pending',
    });

    await registration.save();

    // Send confirmation email with retry
    const emailResult = await sendRegistrationEmail(registrationEmail, registration);

    if (emailResult.success) {
      registration.emailDeliveryStatus = 'sent';
      await registration.save();

      return res.status(201).json({
        success: true,
        message:
          'Congratulations! Your hackathon registration has been successfully submitted and a confirmation email has been sent.',
        data: {
          registration,
          emailStatus: 'sent',
        },
      });
    } else {
      registration.emailDeliveryStatus = 'failed';
      registration.emailDeliveryError = emailResult.error || 'Failed to dispatch email';
      await registration.save();

      return res.status(201).json({
        success: true,
        message:
          'Registration created successfully. However, our email notification system encountered an error delivering your confirmation email. You can view your registration anytime on your dashboard.',
        data: {
          registration,
          emailStatus: 'failed',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/hackathon/my-entry
 * Protected, return user's registration (or null)
 */
const getMyEntry = async (req, res, next) => {
  try {
    const registration = await HackathonRegistration.findOne({ user: req.user._id });

    return res.status(200).json({
      success: true,
      message: registration ? 'Registration entry found.' : 'No registration found for this user.',
      data: {
        registration: registration || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/hackathon/:id
 * Protected, owner (or admin) only
 */
const deleteEntry = async (req, res, next) => {
  try {
    const { id } = req.params;

    const registration = await HackathonRegistration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon registration entry not found.',
        data: null,
      });
    }

    // Verify ownership: only the owner who submitted can delete their registration
    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to withdraw or delete this registration.',
        data: null,
      });
    }

    await HackathonRegistration.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Hackathon registration successfully cancelled and removed.',
      data: {
        id,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/hackathon/:id
 * Protected, update deliverables / links for owner
 */
const updateEntry = async (req, res, next) => {
  try {
    const { id } = req.params;
    const registration = await HackathonRegistration.findById(id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Hackathon registration entry not found.',
        data: null,
      });
    }

    if (registration.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to edit this registration.',
        data: null,
      });
    }

    const { projectName, pptLink, prototypeLink, demoVideoLink, domain } = req.body;

    if (projectName && projectName.trim().length >= 5) {
      registration.projectName = projectName.trim();
    }
    if (domain && domain.trim()) {
      registration.domain = domain.trim();
    }
    if (pptLink) {
      if (!isValidHttpUrl(pptLink)) {
        return res.status(400).json({
          success: false,
          message: 'Presentation deck link must be a valid HTTP or HTTPS URL.',
          data: null,
        });
      }
      registration.pptLink = pptLink.trim();
    }
    if (prototypeLink) {
      if (!isValidHttpUrl(prototypeLink)) {
        return res.status(400).json({
          success: false,
          message: 'Prototype link must be a valid HTTP or HTTPS URL.',
          data: null,
        });
      }
      registration.prototypeLink = prototypeLink.trim();
    }
    if (demoVideoLink !== undefined && demoVideoLink.trim() !== '') {
      if (!isValidHttpUrl(demoVideoLink)) {
        return res.status(400).json({
          success: false,
          message: 'Demo video link must be a valid HTTP or HTTPS URL.',
          data: null,
        });
      }
      registration.demoVideoLink = demoVideoLink.trim();
    } else if (demoVideoLink === '') {
      registration.demoVideoLink = '';
    }

    await registration.save();

    return res.status(200).json({
      success: true,
      message: 'Project deliverables updated successfully!',
      data: { registration },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForHackathon,
  getMyEntry,
  deleteEntry,
  updateEntry,
};
