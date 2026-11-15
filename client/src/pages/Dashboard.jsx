import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  CheckCircle2,
  FileText,
  ExternalLink,
  Users,
  Trash2,
  Zap,
  ArrowRight,
  Edit2,
  Save,
  X,
  Phone,
  Code2,
  Terminal,
  QrCode,
  Download,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';
import InputField from '../components/common/InputField';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { user, refreshProfile } = useAuth();

  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit Deliverables Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    projectName: '',
    pptLink: '',
    prototypeLink: '',
    demoVideoLink: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  // Hacker ID Badge Modal State
  const [badgeModalOpen, setBadgeModalOpen] = useState(false);

  // Edit name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (user?.fullName) {
      setNewName(user.fullName);
    }
  }, [user]);

  const fetchEntry = async () => {
    try {
      setLoading(true);
      const res = await api.get('/hackathon/my-entry');
      if (res.data?.success && res.data.data?.registration) {
        const reg = res.data.data.registration;
        setRegistration(reg);
        setEditForm({
          projectName: reg.projectName || '',
          pptLink: reg.pptLink || '',
          prototypeLink: reg.prototypeLink || '',
          demoVideoLink: reg.demoVideoLink || '',
        });
      } else {
        setRegistration(null);
      }
    } catch (err) {
      console.error('[Dashboard] Error fetching registration:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntry();
  }, []);

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim().length < 3) {
      toast.error('Full name must be at least 3 characters long');
      return;
    }

    setSavingName(true);
    try {
      const res = await api.put('/user/update', { fullName: newName.trim() });
      if (res.data?.success) {
        toast.success('Profile updated successfully!');
        setIsEditingName(false);
        refreshProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile name');
    } finally {
      setSavingName(false);
    }
  };

  const isValidUrl = (urlString) => {
    if (!urlString || typeof urlString !== 'string') return false;
    try {
      const parsed = new URL(urlString.trim());
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleUpdateDeliverables = async (e) => {
    e.preventDefault();
    if (!registration?._id) return;

    if (!editForm.projectName?.trim() || editForm.projectName.trim().length < 5) {
      toast.error('Project name must be at least 5 characters long');
      return;
    }

    if (!editForm.pptLink?.trim() || !isValidUrl(editForm.pptLink.trim())) {
      toast.error('Please provide a valid HTTP or HTTPS URL for your presentation link');
      return;
    }

    if (!editForm.prototypeLink?.trim() || !isValidUrl(editForm.prototypeLink.trim())) {
      toast.error('Please provide a valid HTTP or HTTPS URL for your prototype repository');
      return;
    }

    if (editForm.demoVideoLink?.trim() && !isValidUrl(editForm.demoVideoLink.trim())) {
      toast.error('Please provide a valid HTTP or HTTPS URL for your demo video');
      return;
    }

    setSavingEdit(true);
    try {
      const res = await api.put(`/hackathon/${registration._id}`, editForm);
      if (res.data?.success) {
        toast.success('Project links & deliverables updated successfully!');
        setRegistration(res.data.data.registration);
        setEditModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update deliverables');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteRegistration = async () => {
    if (!registration?._id) return;

    setDeleting(true);
    try {
      const res = await api.delete(`/hackathon/${registration._id}`);
      if (res.data?.success) {
        toast.success('Registration successfully withdrawn.');
        setRegistration(null);
        setDeleteModalOpen(false);
        refreshProfile();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to withdraw registration');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Profile Summary Card */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-[#141324] via-[#100F1D] to-[#121122] border-brand-500/25">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-cyan-500 text-white flex items-center justify-center font-mono text-2xl font-bold shadow-neon">
              {user?.fullName?.charAt(0) || 'H'}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <form onSubmit={handleUpdateName} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="text-lg font-bold px-2 py-1 rounded-lg border border-brand-400 bg-[#0A0A0F] text-white outline-none"
                    />
                    <Button type="submit" size="sm" loading={savingName} icon={Save}>
                      Save
                    </Button>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(false)}
                      className="p-1.5 text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white">
                      {user?.fullName}
                    </h1>
                    <button
                      type="button"
                      onClick={() => setIsEditingName(true)}
                      className="p-1 text-gray-400 hover:text-cyan-400 transition-colors"
                      title="Edit Profile Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-mono text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user?.email}
                </span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Passcode Verified
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {registration && (
              <button
                type="button"
                onClick={() => setBadgeModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Participant Pass</span>
              </button>
            )}

            {registration ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> TEAM REGISTERED
              </span>
            ) : (
              <Link to="/register">
                <Button variant="primary" size="md" icon={Zap}>
                  Register Your Project
                </Button>
              </Link>
            )}
          </div>

        </div>
      </Card>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner text="Querying registration records..." />
      ) : registration ? (
        /* REGISTERED STATE: View full registration details */
        <div className="space-y-6">
          <Card className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-semibold bg-brand-500/15 text-brand-300 border border-brand-500/30 mb-2">
                  {registration.domain}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {registration.projectName}
                </h2>
                <p className="text-xs font-mono text-gray-400 mt-1">
                  ENTRY ID: <span className="text-cyan-400">{registration._id}</span> • Registered on {new Date(registration.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={Edit2}
                  onClick={() => setEditModalOpen(true)}
                  className="text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/10"
                >
                  Edit Links
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  icon={Trash2}
                  onClick={() => setDeleteModalOpen(true)}
                  className="text-red-400 hover:text-red-300 border-red-500/30 hover:bg-red-500/10"
                >
                  Withdraw
                </Button>
              </div>
            </div>

            {/* Academic & Contact Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-white/10">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">University / College</p>
                <p className="text-sm font-semibold text-white mt-1">{registration.collegeName}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Degree & Specialization</p>
                <p className="text-sm font-semibold text-white mt-1">
                  {registration.course} ({registration.branch})
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Year of Study</p>
                <p className="text-sm font-semibold text-white mt-1">{registration.yearOfStudy}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Team Lead Contact</p>
                <p className="text-sm font-semibold font-mono text-cyan-400 mt-1">{registration.mobile}</p>
              </div>
            </div>

            {/* Submitted Pitch & Code Links */}
            <div className="py-6 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-400">
                  Project Deliverables & Repository Endpoints
                </h3>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(true)}
                  className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" /> Update Endpoints
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={registration.pptLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl border border-brand-500/30 bg-brand-500/5 hover:border-brand-500/60 transition-colors flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-semibold text-brand-300 font-mono">Presentation Deck</p>
                    <p className="text-xs text-gray-400 truncate">{registration.pptLink}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-brand-400 flex-shrink-0" />
                </a>

                <a
                  href={registration.prototypeLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 hover:border-cyan-500/60 transition-colors flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs font-semibold text-cyan-300 font-mono">Prototype / Code Repo</p>
                    <p className="text-xs text-gray-400 truncate">{registration.prototypeLink}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                </a>

                {registration.demoVideoLink ? (
                  <a
                    href={registration.demoVideoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 hover:border-purple-500/60 transition-colors flex items-center justify-between"
                  >
                    <div className="truncate pr-2">
                      <p className="text-xs font-semibold text-purple-300 font-mono">Demo Walkthrough</p>
                      <p className="text-xs text-gray-400 truncate">{registration.demoVideoLink}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0" />
                  </a>
                ) : (
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5 text-gray-500 text-xs flex items-center font-mono">
                    No optional demo video supplied
                  </div>
                )}
              </div>
            </div>

            {/* Team Roster Section */}
            <div className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  Team Roster (Total Team Size: {registration.teamSize})
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-sm font-mono">
                  <thead className="bg-[#0B0B14] text-xs uppercase text-gray-400 border-b border-white/10">
                    <tr>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Member Name</th>
                      <th className="py-3 px-4">Email Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#12111E]">
                    <tr>
                      <td className="py-3 px-4 font-semibold text-cyan-400">Team Lead</td>
                      <td className="py-3 px-4 text-white font-medium">{registration.fullName}</td>
                      <td className="py-3 px-4 text-gray-400">{registration.email}</td>
                    </tr>
                    {registration.teamMembers && registration.teamMembers.length > 0 ? (
                      registration.teamMembers.map((member, index) => (
                        <tr key={index}>
                          <td className="py-3 px-4 text-gray-400">Team Member #{index + 2}</td>
                          <td className="py-3 px-4 text-white font-medium">{member.name}</td>
                          <td className="py-3 px-4 text-gray-400">{member.email}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="py-3 px-4 text-xs text-gray-500 italic text-center">
                          Solo Participant (No additional team members)
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </Card>
        </div>
      ) : (
        /* UNREGISTERED STATE */
        <div className="space-y-6">
          <Card className="p-8 sm:p-12 text-center border-dashed border-2 border-brand-500/30 bg-brand-500/5">
            <div className="w-16 h-16 rounded-3xl bg-brand-500/15 border border-brand-500/30 text-brand-400 flex items-center justify-center mx-auto mb-4 shadow-neon">
              <Zap className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              No Active Hackathon Entry Found
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto mb-6">
              You haven't submitted your team registration for MatruCare AI Hackathon 2026 yet. Select a track below to jump straight into project registration.
            </p>
            <Link to="/register">
              <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right">
                Submit Team Registration (All Tracks)
              </Button>
            </Link>
          </Card>

          {/* Quick Track Selection Grid with Images */}
          <div>
            <h3 className="text-sm font-mono uppercase tracking-wider text-gray-300 font-bold mb-4 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-cyan-400" />
              Explore Innovation Tracks & Register:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Autonomous AI & Generative Agents',
                  tag: 'GenAI & LLMs',
                  bounty: '₹1.5 Lakh Pool',
                  img: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Full-Stack Cloud & Scalable Systems',
                  tag: 'Cloud & Distributed',
                  bounty: '₹1.0 Lakh Pool',
                  img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'IoT, Robotics & Edge Computing',
                  tag: 'Hardware & Systems',
                  bounty: '₹1.0 Lakh Pool',
                  img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Cyber Security & Zero Trust Architecture',
                  tag: 'Security & Web3',
                  bounty: '₹1.0 Lakh Pool',
                  img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
                },
                {
                  title: 'Open Innovation / High-Impact Systems',
                  tag: 'Wildcard Category',
                  bounty: '₹50,000 Pool',
                  img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
                },
              ].map((trk, i) => (
                <Link
                  key={i}
                  to={`/register?track=${encodeURIComponent(trk.title)}`}
                  className="group relative rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 bg-[#0E0D1B] transition-all duration-300 block hover:shadow-neon"
                >
                  <div className="h-32 w-full overflow-hidden relative">
                    <img
                      src={trk.img}
                      alt={trk.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D1B] via-[#0E0D1B]/50 to-transparent" />
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 font-bold border border-white/10">
                      {trk.bounty}
                    </span>
                  </div>
                  <div className="p-3.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-0.5">
                      {trk.tag}
                    </span>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {trk.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Deliverables Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Update Project Deliverables"
      >
        <form onSubmit={handleUpdateDeliverables} className="space-y-4">
          <InputField
            label="Project Title"
            value={editForm.projectName}
            onChange={(e) => setEditForm((p) => ({ ...p, projectName: e.target.value }))}
            required
          />

          <InputField
            label="Presentation Deck Link"
            type="url"
            value={editForm.pptLink}
            onChange={(e) => setEditForm((p) => ({ ...p, pptLink: e.target.value }))}
            required
          />

          <InputField
            label="Prototype / Code Repository Link"
            type="url"
            value={editForm.prototypeLink}
            onChange={(e) => setEditForm((p) => ({ ...p, prototypeLink: e.target.value }))}
            required
          />

          <InputField
            label="Demo Video Link (Optional)"
            type="url"
            value={editForm.demoVideoLink}
            onChange={(e) => setEditForm((p) => ({ ...p, demoVideoLink: e.target.value }))}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditModalOpen(false)}
              disabled={savingEdit}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={savingEdit}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Hacker Pass / ID Badge Modal */}
      <Modal
        isOpen={badgeModalOpen}
        onClose={() => setBadgeModalOpen(false)}
        title="Official Participant Access Pass"
      >
        <div className="p-6 rounded-2xl bg-gradient-to-b from-[#181630] to-[#0A0A0F] border border-cyan-500/40 text-center space-y-4 shadow-neon">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-wider">
              MATRUCARE AI 2026 // PARTICIPANT PASS
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
            <QrCode className="w-12 h-12 text-cyan-300" />
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">{registration?.fullName}</h3>
            <p className="text-xs font-mono text-cyan-400">{registration?.collegeName}</p>
          </div>

          <div className="p-3 bg-[#07060D] rounded-xl border border-white/5 text-left text-xs font-mono space-y-1 text-gray-300">
            <p><span className="text-gray-500">Project:</span> {registration?.projectName}</p>
            <p><span className="text-gray-500">Track:</span> {registration?.domain}</p>
            <p><span className="text-gray-500">Team:</span> {registration?.teamSize} Member(s)</p>
            <p><span className="text-gray-500">Entry ID:</span> <span className="text-brand-300">{registration?._id}</span></p>
          </div>

          <p className="text-[11px] font-mono text-gray-400">
            Present this badge during Sprint Check-in on Day 01.
          </p>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Withdraw Hackathon Submission?"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-300">
            Are you sure you want to withdraw project <strong>"{registration?.projectName}"</strong> from MatruCare AI Hackathon 2026?
          </p>
          <p className="text-xs text-red-400 font-mono">
            This will permanently remove your registration entry from the judging queue. You may re-register before registrations close.
          </p>
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={deleting}
              onClick={handleDeleteRegistration}
            >
              Withdraw Entry
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Dashboard;
