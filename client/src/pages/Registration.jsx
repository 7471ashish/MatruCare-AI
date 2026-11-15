import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Briefcase,
  Layers,
  FileText,
  Link as LinkIcon,
  Video,
  Users,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const COLLEGES = [
  'Indian Institute of Information Technology (IIIT) Una',
  'Indian Institute of Technology (IIT) Delhi',
  'Indian Institute of Technology (IIT) Bombay',
  'Indian Institute of Technology (IIT) Madras',
  'Indian Institute of Technology (IIT) Roorkee',
  'Indian Institute of Information Technology (IIIT) Allahabad',
  'Indian Institute of Information Technology (IIIT) Hyderabad',
  'National Institute of Technology (NIT) Hamirpur',
  'National Institute of Technology (NIT) Trichy',
  'National Institute of Technology (NIT) Surathkal',
  'Birla Institute of Technology and Science (BITS) Pilani',
  'Delhi Technological University (DTU)',
  'Netaji Subhas University of Technology (NSUT)',
  'Vellore Institute of Technology (VIT)',
  'Other',
];

const COURSES = [
  'B.Tech',
  'M.Tech',
  'Dual Degree (B.Tech + M.Tech)',
  'BCA',
  'MCA',
  'BSc',
  'MSc',
  'PhD / Research Scholar',
  'Other',
];

const BRANCHES = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Artificial Intelligence & Machine Learning (AI/ML)',
  'Data Science & Engineering',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Biotechnology / Computational Biology',
  'Other',
];

const YEARS = ['1st', '2nd', '3rd', '4th', 'Final Year'];

const DOMAINS = [
  'Autonomous AI & Generative Agents',
  'Full-Stack Cloud & Scalable Systems',
  'IoT, Robotics & Edge Computing',
  'Cyber Security & Zero Trust Architecture',
  'Blockchain, Smart Contracts & Web3',
  'Open Innovation / High-Impact Systems',
];

const Registration = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, refreshProfile, hasRegistered } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const initialDomain = searchParams.get('track') || '';

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    mobile: '',
    collegeName: '',
    customCollege: '',
    course: '',
    branch: '',
    yearOfStudy: '',
    domain: initialDomain,
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
    teamSize: '1',
    teamMembers: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.fullName,
        email: user.email,
      }));
    }
  }, [user]);

  const handleTeamSizeChange = (newSize) => {
    const size = parseInt(newSize, 10);
    // Team Size = 1: 0 additional boxes
    // Team Size = 2: 2 member boxes
    // Team Size = 3: 3 member boxes
    // Team Size = 4: 4 member boxes
    // Team Size = 5: 5 member boxes
    const needed = size > 1 ? size : 0;
    const current = [...formData.teamMembers];

    if (current.length < needed) {
      while (current.length < needed) {
        current.push({ name: '', email: '' });
      }
    } else if (current.length > needed) {
      current.splice(needed);
    }

    setFormData((prev) => ({
      ...prev,
      teamSize: newSize,
      teamMembers: current,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'teamSize') {
      handleTeamSizeChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const updated = [...formData.teamMembers];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, teamMembers: updated }));
    if (errors[`member_${index}_${field}`]) {
      setErrors((prev) => ({ ...prev, [`member_${index}_${field}`]: '' }));
    }
  };

  const validateStep = (currentStep) => {
    const errs = {};

    if (currentStep === 1) {
      if (!formData.fullName.trim() || formData.fullName.trim().length < 3) {
        errs.fullName = 'Full name must be at least 3 characters long';
      } else if (!/^[A-Za-z\s]+$/.test(formData.fullName.trim())) {
        errs.fullName = 'Full name must contain letters and spaces only';
      }

      if (!formData.mobile.trim()) {
        errs.mobile = 'Mobile number is required';
      } else if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
        errs.mobile = 'Enter a valid 10-digit Indian mobile number starting with 6-9';
      }
    }

    if (currentStep === 2) {
      if (!formData.collegeName) {
        errs.collegeName = 'Please select your university/college';
      } else if (formData.collegeName === 'Other' && !formData.customCollege.trim()) {
        errs.customCollege = 'Please enter your college name';
      }

      if (!formData.course) errs.course = 'Please select your course';
      if (!formData.branch) errs.branch = 'Please select your branch';
      if (!formData.yearOfStudy) errs.yearOfStudy = 'Please select your year of study';
    }

    if (currentStep === 3) {
      if (!formData.domain) errs.domain = 'Please choose a hackathon track';
      if (!formData.projectName.trim() || formData.projectName.trim().length < 5) {
        errs.projectName = 'Project name must be at least 5 characters long';
      }

      const isValidUrl = (urlString) => {
        if (!urlString || typeof urlString !== 'string') return false;
        try {
          const parsed = new URL(urlString.trim());
          return parsed.protocol === 'http:' || parsed.protocol === 'https:';
        } catch {
          return false;
        }
      };

      if (!formData.pptLink.trim()) {
        errs.pptLink = 'Pitch deck / presentation link is required';
      } else if (!isValidUrl(formData.pptLink.trim())) {
        errs.pptLink = 'Please provide a valid HTTP or HTTPS URL (Google Drive / OneDrive)';
      }

      if (!formData.prototypeLink.trim()) {
        errs.prototypeLink = 'Prototype or code repository link is required';
      } else if (!isValidUrl(formData.prototypeLink.trim())) {
        errs.prototypeLink = 'Please provide a valid HTTP or HTTPS URL (GitHub / Figma / demo)';
      }

      if (formData.demoVideoLink && !isValidUrl(formData.demoVideoLink.trim())) {
        errs.demoVideoLink = 'Please provide a valid HTTP or HTTPS URL for your demo video';
      }
    }

    if (currentStep === 4) {
      const size = parseInt(formData.teamSize, 10);
      if (size > 1) {
        const emails = new Set();
        const leaderEmail = formData.email.toLowerCase().trim();

        if (formData.teamMembers.length !== size) {
          errs.teamMembers = `Please configure all ${size} team members`;
        }

        formData.teamMembers.forEach((m, idx) => {
          if (!m.name.trim() || m.name.trim().length < 2) {
            errs[`member_${idx}_name`] = 'Enter valid member name (min 2 chars)';
          } else if (!/^[A-Za-z\s]+$/.test(m.name.trim())) {
            errs[`member_${idx}_name`] = 'Name must contain letters and spaces only';
          }

          if (!m.email.trim() || !/^\S+@\S+\.\S+$/.test(m.email.trim())) {
            errs[`member_${idx}_email`] = 'Enter valid member email address';
          } else {
            const memberLower = m.email.toLowerCase().trim();
            if (memberLower === leaderEmail) {
              errs[`member_${idx}_email`] = 'Member email cannot be the team leader email';
            } else if (emails.has(memberLower)) {
              errs[`member_${idx}_email`] = 'Duplicate team member email detected';
            }
            emails.add(memberLower);
          }
        });
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setSubmitting(true);
    try {
      const finalCollege =
        formData.collegeName === 'Other' ? formData.customCollege.trim() : formData.collegeName;

      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        mobile: formData.mobile.trim(),
        collegeName: finalCollege,
        course: formData.course,
        branch: formData.branch,
        yearOfStudy: formData.yearOfStudy,
        domain: formData.domain,
        projectName: formData.projectName.trim(),
        pptLink: formData.pptLink.trim(),
        prototypeLink: formData.prototypeLink.trim(),
        demoVideoLink: formData.demoVideoLink.trim(),
        teamSize: parseInt(formData.teamSize, 10),
        teamMembers: formData.teamMembers.map((m) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
        })),
      };

      const res = await api.post('/hackathon/register', payload);

      if (res.data?.success) {
        setSubmittedData(res.data.data.registration);
        await refreshProfile();
        if (!shouldReduceMotion) {
          confetti({
            particleCount: 130,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#6366F1', '#06B6D4', '#8B5CF6', '#22D3EE'],
          });
        }
        toast.success('Hackathon submission successfully registered!');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error('You already have an active registration for MatruCare AI Hackathon 2026.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to submit registration.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS SCREEN
  if (submittedData) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: shouldReduceMotion ? 0.01 : 0.4 }}
        >
          <Card className="p-8 sm:p-12 border-2 border-cyan-400 shadow-neon">
            <div className="w-20 h-20 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto mb-6 border border-cyan-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              REGISTRATION CONFIRMED
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 mb-3">
              Team Registered, {submittedData.fullName}!
            </h1>

            <p className="text-base text-gray-400 max-w-xl mx-auto leading-relaxed mb-6 font-normal">
              Your submission for <strong>"{submittedData.projectName}"</strong> has been logged in the judging portal. An official confirmation email with your team summary has been dispatched to <strong>{submittedData.email}</strong>.
            </p>

            <div className="bg-[#07060D] p-5 rounded-xl border border-white/10 text-left max-w-md mx-auto mb-8 text-xs font-mono space-y-2 text-gray-300">
              <p><strong className="text-gray-500">Track:</strong> {submittedData.domain}</p>
              <p><strong className="text-gray-500">Institution:</strong> {submittedData.collegeName}</p>
              <p><strong className="text-gray-500">Team Size:</strong> {submittedData.teamSize} Member(s)</p>
              <p><strong className="text-gray-500">Entry ID:</strong> <span className="text-cyan-400">{submittedData._id}</span></p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/dashboard">
                <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right">
                  Open Team Dashboard
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="ghost">
                  Back to Overview
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (hasRegistered) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto text-center">
        <Card className="p-8 sm:p-10 border border-brand-500/30">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Team is Already Registered!
          </h2>
          <p className="text-sm text-gray-400 mb-6 font-mono">
            You already have an active registration for MatruCare AI Hackathon 2026. You can review your submission or update your links on your dashboard.
          </p>
          <Link to="/dashboard">
            <Button size="md" variant="secondary" icon={ArrowRight} iconPosition="right">
              View Team Dashboard
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Team Lead' },
    { num: 2, label: 'Institution' },
    { num: 3, label: 'Project Pitch' },
    { num: 4, label: 'Team Roster' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      
      {/* Page Title */}
      <div className="mb-8">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/30 mb-2">
          MatruCare AI Hackathon 2026 Entry
        </span>
        <h1 className="text-3xl font-extrabold text-white">
          Hackathon Project Registration
        </h1>
      </div>

      {/* Multi-Step Progress Tracker */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-brand-500 to-cyan-500 transition-all duration-300 -z-0"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />

          {stepsList.map((s) => (
            <div key={s.num} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-200
                  ${
                    step >= s.num
                      ? 'bg-gradient-to-tr from-brand-600 to-cyan-500 text-white shadow-neon'
                      : 'bg-[#12111E] border border-white/20 text-gray-400'
                  }`}
              >
                {step > s.num ? <CheckCircle2 className="w-4 h-4" /> : s.num}
              </div>
              <span className="text-[11px] font-mono font-semibold text-gray-400 mt-1 hidden sm:block">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Form Container */}
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          
          {/* STEP 1: Personal Details */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="border-b border-white/10 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-mono">
                  STAGE 01 // SQUAD LEAD CREDENTIALS
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Primary point of contact for sprint alerts and evaluation briefings.
                </p>
              </div>

              <InputField
                label="Full Name (Letters & Spaces only)"
                name="fullName"
                placeholder="e.g. Diya Sharma"
                icon={User}
                required
                value={formData.fullName}
                onChange={handleChange}
                error={errors.fullName}
              />

              <InputField
                label="Email Address (Pre-filled from authenticated account)"
                name="email"
                type="email"
                icon={Mail}
                required
                readOnly
                value={formData.email}
                helperText="Verified account email. Confirmation details will be dispatched here."
              />

              <InputField
                label="10-Digit Mobile Number (India)"
                name="mobile"
                type="tel"
                placeholder="e.g. 9876543210"
                icon={Phone}
                required
                value={formData.mobile}
                onChange={handleChange}
                error={errors.mobile}
                helperText="Must be a valid 10-digit Indian mobile number starting with 6-9."
              />
            </motion.div>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="border-b border-white/10 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-mono">
                  STAGE 02 // ACADEMIC AFFILIATION
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Specify your college or university institution.
                </p>
              </div>

              <SelectField
                label="College / Institute Name"
                name="collegeName"
                value={formData.collegeName}
                onChange={handleChange}
                options={COLLEGES}
                required
                error={errors.collegeName}
                placeholder="Select college or university..."
              />

              {formData.collegeName === 'Other' && (
                <InputField
                  label="Enter Custom College Name"
                  name="customCollege"
                  placeholder="Full official name of your institution"
                  required
                  value={formData.customCollege}
                  onChange={handleChange}
                  error={errors.customCollege}
                />
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Course / Degree"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  options={COURSES}
                  required
                  error={errors.course}
                  placeholder="Select degree program..."
                />

                <SelectField
                  label="Branch / Specialization"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  options={BRANCHES}
                  required
                  error={errors.branch}
                  placeholder="Select engineering branch..."
                />
              </div>

              <SelectField
                label="Current Year of Study"
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                options={YEARS}
                required
                error={errors.yearOfStudy}
                placeholder="Select year..."
              />
            </motion.div>
          )}

          {/* STEP 3: Project Deliverables */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="border-b border-white/10 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-mono">
                  STAGE 03 // PROJECT ARCHITECTURE & REPO
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Supply your project title, presentation slides, and code repo.
                </p>
              </div>

              <SelectField
                label="Hackathon Track / Domain"
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                options={DOMAINS}
                required
                error={errors.domain}
                placeholder="Choose your track..."
              />

              <InputField
                label="Project Title / Solution Name (Min. 5 characters)"
                name="projectName"
                placeholder="e.g. NexusAI - Autonomous Multi-Agent Reasoning Mesh"
                icon={FileText}
                required
                value={formData.projectName}
                onChange={handleChange}
                error={errors.projectName}
              />

              <InputField
                label="Presentation / Pitch Deck Link (Google Drive / OneDrive URL)"
                name="pptLink"
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                icon={LinkIcon}
                required
                value={formData.pptLink}
                onChange={handleChange}
                error={errors.pptLink}
                helperText="Ensure link sharing is set to 'Anyone with the link can view'."
              />

              <InputField
                label="Working Prototype / Code Repository Link (GitHub / Figma / Web Demo)"
                name="prototypeLink"
                type="url"
                placeholder="https://github.com/your-team/matrucare-project"
                icon={LinkIcon}
                required
                value={formData.prototypeLink}
                onChange={handleChange}
                error={errors.prototypeLink}
              />

              <InputField
                label="Demo Video Link (YouTube / Drive - Optional)"
                name="demoVideoLink"
                type="url"
                placeholder="https://youtu.be/... (optional 2-minute walkthrough)"
                icon={Video}
                value={formData.demoVideoLink}
                onChange={handleChange}
                error={errors.demoVideoLink}
                helperText="Optional but recommended for finalist shortlisting."
              />
            </motion.div>
          )}

          {/* STEP 4: Team Composition */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="border-b border-white/10 pb-3 mb-4">
                <h3 className="text-base font-bold text-white font-mono">
                  STAGE 04 // TEAM ROSTER CONFIGURATION
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select team size (1-5). For Team Size 1 (Solo), no extra members are required.
                </p>
              </div>

              <SelectField
                label="Select Team Size"
                name="teamSize"
                value={formData.teamSize}
                onChange={handleChange}
                options={[
                  { value: '1', label: 'Team Size = 1 (No additional member boxes)' },
                  { value: '2', label: 'Team Size = 2 (Two member entry boxes)' },
                  { value: '3', label: 'Team Size = 3 (Three member entry boxes)' },
                  { value: '4', label: 'Team Size = 4 (Four member entry boxes)' },
                  { value: '5', label: 'Team Size = 5 (Five member entry boxes)' },
                ]}
                required
              />

              {/* Logged-in Participant (Handled Separately) */}
              <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-1">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <span>Logged-in Participant (Team Lead)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">Leader (Primary Contact)</span>
                </div>
                <p className="text-sm font-semibold text-white">{formData.fullName || user?.fullName}</p>
                <p className="text-xs text-gray-400 font-mono">{user?.email}</p>
                <p className="text-[11px] text-gray-400 font-mono mt-1 pt-1.5 border-t border-white/5">
                  {parseInt(formData.teamSize, 10) === 1
                    ? 'Team Size 1: Solo entry. No additional member boxes required.'
                    : `Team Size ${formData.teamSize}: Logged-in participant is handled separately above; please enter details for all ${formData.teamSize} member entries below.`}
                </p>
              </div>

              {/* Dynamic Team Member Input Boxes */}
              <AnimatePresence>
                {formData.teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                      <span>Team Member #{index + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <InputField
                        label="Member Full Name"
                        placeholder="Full Name"
                        required
                        value={member.name}
                        onChange={(e) => handleMemberChange(index, 'name', e.target.value)}
                        error={errors[`member_${index}_name`]}
                      />

                      <InputField
                        label="Member Email Address"
                        type="email"
                        placeholder="member@university.edu"
                        required
                        value={member.email}
                        onChange={(e) => handleMemberChange(index, 'email', e.target.value)}
                        error={errors[`member_${index}_email`]}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Review summary preview */}
              <div className="p-4 rounded-xl bg-[#0B0B14] border border-white/10 text-xs font-mono space-y-1 mt-4 text-gray-300">
                <p className="font-semibold text-cyan-400">Submission Payload Summary:</p>
                <p className="text-gray-400">Project: <strong className="text-white">{formData.projectName || 'Pending'}</strong></p>
                <p className="text-gray-400">Track: <strong className="text-white">{formData.domain || 'Pending'}</strong></p>
                <p className="text-gray-400">Team Size: <strong className="text-white">{formData.teamSize} Member(s)</strong></p>
              </div>
            </motion.div>
          )}

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-6">
            {step > 1 ? (
              <Button type="button" variant="outline" size="md" icon={ArrowLeft} onClick={prevStep}>
                Previous
              </Button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <Button type="button" variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={nextStep}>
                Continue to Step {step + 1}
              </Button>
            ) : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={submitting}
                icon={Zap}
                className="shadow-neon"
              >
                Submit Official Registration
              </Button>
            )}
          </div>

        </form>
      </Card>

    </div>
  );
};

export default Registration;
