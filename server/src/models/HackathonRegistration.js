const mongoose = require('mongoose');
const { isValidHttpUrl } = require('../utils/urlValidator');

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Member name is required'],
      trim: true,
      minlength: [2, 'Member name must be at least 2 characters'],
      match: [/^[A-Za-z\s]+$/, 'Member name must contain letters and spaces only'],
    },
    email: {
      type: String,
      required: [true, 'Member email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid member email address'],
    },
  },
  { _id: false }
);

const hackathonRegistrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One registration per user
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [3, 'Full name must be at least 3 characters long'],
      match: [/^[A-Za-z\s]+$/, 'Full name must contain only letters and spaces'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian mobile number starting with 6-9'],
    },
    collegeName: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    yearOfStudy: {
      type: String,
      required: [true, 'Year of study is required'],
      enum: {
        values: ['1st', '2nd', '3rd', '4th', 'Final Year'],
        message: '{VALUE} is not a valid year of study',
      },
    },
    domain: {
      type: String,
      required: [true, 'Domain track is required'],
      trim: true,
    },
    projectName: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [5, 'Project name must be at least 5 characters long'],
    },
    pptLink: {
      type: String,
      required: [true, 'Presentation / Pitch Deck link is required'],
      trim: true,
      validate: {
        validator: isValidHttpUrl,
        message: 'Please provide a valid HTTP or HTTPS URL for your pitch presentation',
      },
    },
    prototypeLink: {
      type: String,
      required: [true, 'Prototype or Code repository link is required'],
      trim: true,
      validate: {
        validator: isValidHttpUrl,
        message: 'Please provide a valid HTTP or HTTPS URL for your working prototype / code repo',
      },
    },
    demoVideoLink: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator(v) {
          if (!v || v.trim() === '') return true;
          return isValidHttpUrl(v);
        },
        message: 'Please provide a valid HTTP or HTTPS URL for the demo video',
      },
    },
    teamSize: {
      type: Number,
      required: [true, 'Team size is required'],
      min: [1, 'Team size must be at least 1'],
      max: [5, 'Team size cannot exceed 5 members'],
    },
    teamMembers: {
      type: [teamMemberSchema],
      default: [],
      validate: {
        validator(members) {
          const expectedCount = this.teamSize === 1 ? 0 : this.teamSize;
          if (members.length !== expectedCount) return false;
          const emails = members.map((m) => m.email.toLowerCase());
          return new Set(emails).size === emails.length;
        },
        message: 'Team members count must match selected team size and have unique emails',
      },
    },
    emailDeliveryStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
      index: true,
    },
    emailRetryCount: {
      type: Number,
      default: 0,
    },
    emailDeliveryError: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.emailDeliveryError;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const HackathonRegistration = mongoose.model('HackathonRegistration', hackathonRegistrationSchema);

module.exports = HackathonRegistration;
