const { sendContactEmail } = require('../utils/emailService');

/**
 * POST /api/contact
 * Contact form message emailed to matrucareai@gmail.com
 */
const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message, category } = req.body;

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      category: category ? category.trim() : 'General Inquiry',
    };

    // Send email to organizer
    const sendResult = await sendContactEmail(contactData);
    if (!sendResult.success) {
      return res.status(502).json({
        success: false,
        message: "We couldn't deliver your contact inquiry. Please try again later.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been routed to the MatruCare AI organizing team.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
};
