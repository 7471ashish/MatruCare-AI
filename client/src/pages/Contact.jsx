import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, User, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import InputField from '../components/common/InputField';
import SelectField from '../components/common/SelectField';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SectionHeading from '../components/common/SectionHeading';
import { SITE_CONFIG } from '../config/site';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedMail, setCopiedMail] = useState(false);

  const officialEmail = SITE_CONFIG.supportEmail;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(officialEmail);
    setCopiedMail(true);
    toast.success('Email address copied to clipboard!');
    setTimeout(() => setCopiedMail(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Please provide your full name';
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post('/contact', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        category: formData.category,
        message: formData.message.trim(),
      });

      if (res.data?.success) {
        toast.success(res.data.message || 'Message sent successfully!');
        setSubmitted(true);
        setFormData({ name: '', email: '', category: 'General Inquiry', message: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <SectionHeading
        badge="MatruCare AI Helpdesk"
        title="Direct Line to Organizers"
        subtitle="Need assistance with problem statements, registration, technical support, or partnership? Reach out directly to our team."
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Information Card */}
        <div className="md:col-span-5 space-y-6">
          <Card className="p-6 sm:p-8 bg-gradient-to-br from-[#121124] to-[#0D0C1A] border-white/10">
            <h3 className="text-xl font-bold text-white mb-4">
              Direct Contact Desk
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-xs uppercase font-mono tracking-wider text-gray-400">Support & Inquiries</p>
                  <div className="flex items-center gap-2 mt-1">
                    <a
                      href={`mailto:${officialEmail}`}
                      className="text-sm font-bold font-mono text-cyan-400 hover:underline break-all"
                    >
                      {officialEmail}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-1 rounded text-gray-400 hover:text-white transition-colors"
                      title="Copy Email"
                    >
                      {copiedMail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    Monitored continuously by the MatruCare AI organizing team.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <p className="text-xs font-mono font-semibold text-gray-300 uppercase tracking-wider mb-2">
                  Support Channels:
                </p>
                <ul className="text-xs text-gray-400 space-y-2 font-mono">
                  <li>• Technical Cell: <span className="text-cyan-400 font-semibold">Registration & Submissions</span></li>
                  <li>• Evaluation Cell: <span className="text-cyan-400 font-semibold">Judges & Reviewers</span></li>
                  <li>• University Outreach: <span className="text-cyan-400 font-semibold">Campus Partnerships</span></li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Form Card */}
        <div className="md:col-span-7">
          <Card className="p-6 sm:p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  Message Sent!
                </h3>
                <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
                  Thank you for reaching out. Your inquiry has been forwarded directly to {officialEmail}.
                </p>
                <Button size="md" variant="secondary" onClick={() => setSubmitted(false)}>
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  label="Full Name"
                  name="name"
                  placeholder="e.g. Aryan Mehra"
                  icon={User}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />

                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@university.edu"
                  icon={Mail}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />

                <SelectField
                  label="Inquiry Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={[
                    'General Inquiry',
                    'Problem Statement Clarification',
                    'Team Formation',
                    'Sponsorship & Partnership',
                    'Technical Portal Support',
                  ]}
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 font-mono">
                    Message / Query Details <span className="text-brand-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe your inquiry, question, or proposal in detail..."
                    required
                    className={`w-full text-sm rounded-xl py-2.5 px-3.5 border outline-none transition-all duration-200 bg-[#12111E] text-white
                      ${
                        errors.message
                          ? 'border-red-500/80 focus:border-red-500'
                          : 'border-white/10 hover:border-white/20 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/25'
                      }
                    `}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-400">{errors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    icon={Send}
                    className="w-full shadow-neon"
                  >
                    Send to {officialEmail}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
};

export default Contact;
