import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  ArrowRight,
  Terminal,
  Award,
  Calendar,
  Users,
  ChevronDown,
  ShieldCheck,
  Cpu,
  Code2,
  Sparkles,
  CheckCircle2,
  Share2,
  Copy,
  Flame,
  Check,
  Layers,
  Clock,
  Compass,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SectionHeading from '../components/common/SectionHeading';
import CountdownTimer from '../components/common/CountdownTimer';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.origin);
    setCopiedLink(true);
    toast.success('MatruCare AI portal link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const tracks = [
    {
      title: 'Autonomous AI & Generative Agents',
      tag: 'GenAI & LLMs',
      difficulty: 'Advanced',
      bounty: '₹1,50,000 Track Pool',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80',
      desc: 'Build multi-agent frameworks, self-correcting reasoning loops, autonomous code copilots, and multimodal generative tools.',
      tools: ['LangChain', 'Llama-3', 'FastAPI', 'PyTorch', 'Vector DBs'],
      ideas: [
        'Autonomous PR review & security penetration agent',
        'Multimodal diagnostic imaging reasoning assistant',
        'Multi-agent competitive market intelligence simulator',
      ],
    },
    {
      title: 'Full-Stack Cloud & Scalable Systems',
      tag: 'Cloud & Distributed',
      difficulty: 'Intermediate / Advanced',
      bounty: '₹1,00,000 Track Pool',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
      desc: 'High-throughput microservices, real-time collaboration engines, resilient distributed event streams, and modern developer infrastructure.',
      tools: ['Next.js 14', 'Node.js', 'Go', 'Docker', 'Redis', 'Kafka'],
      ideas: [
        'Real-time low-latency collaborative IDE in browser',
        'Distributed zero-cold-start serverless runner',
        'Global edge caching and observability pipeline',
      ],
    },
    {
      title: 'IoT, Robotics & Edge Computing',
      tag: 'Hardware & Systems',
      difficulty: 'Intermediate',
      bounty: '₹1,00,000 Track Pool',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=80',
      desc: 'Embedded firmware, autonomous drone telemetry, edge ML inference on microcontrollers, and real-time sensory hardware.',
      tools: ['ESP32', 'Raspberry Pi', 'TensorFlow Lite', 'MQTT', 'Rust'],
      ideas: [
        'Offline edge sensor network with anomaly prediction',
        'Automated robotic payload delivery navigation',
        'Low-cost clinical biometrics telemetry unit',
      ],
    },
    {
      title: 'Cyber Security & Zero Trust Architecture',
      tag: 'Security & Web3',
      difficulty: 'Advanced',
      bounty: '₹1,00,000 Track Pool',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
      desc: 'Automated vulnerability triage, decentralized cryptography, zero-knowledge proofs, and automated threat intelligence.',
      tools: ['eBPF', 'Solidity', 'Circom (ZKP)', 'Python', 'Wireshark'],
      ideas: [
        'ZK-Proof identity verification for verifiable credentials',
        'Autonomous API vulnerability fuzzing framework',
        'Decentralized tamper-proof audit trail for healthcare',
      ],
    },
    {
      title: 'Open Innovation & Wildcard Breakthroughs',
      tag: 'Wildcard Category',
      difficulty: 'Open to All',
      bounty: '₹50,000 Track Pool',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=80',
      desc: 'Have an unconventional idea that defies standard categories? Pitch any radical prototype, game-engine simulation, or technical experiment.',
      tools: ['Any Stack', 'Wasm', 'Three.js', 'WebGL', 'Tailwind'],
      ideas: [
        'Browser-based 3D simulation sandbox',
        'Peer-to-peer decentralized mesh communication',
        'Accessible assistive tech for neurodivergent coders',
      ],
    },
  ];

  const moments = [
    {
      title: 'Architectural Blueprinting',
      category: 'Sprint Kickoff',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      desc: 'Multidisciplinary squads mapping distributed workflows and LLM agent topologies.',
    },
    {
      title: '3:00 AM Deep Code Sprint',
      category: 'Night Hacks',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
      desc: 'Uninterrupted terminal focus, zero-latency debugging, and midnight coffee-fueled velocity.',
    },
    {
      title: 'Mainstage Live Demos',
      category: 'Final Demos',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      desc: 'Top 15 finalist squads presenting live prototypes before industry judges and VCs.',
    },
    {
      title: 'Grand Awards & Bounties',
      category: 'Victory Moment',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      desc: 'Celebrating radical technological breakthroughs with ₹5,00,000 in cash prizes.',
    },
  ];

  const judges = [
    {
      name: 'Dr. Elena Rostova',
      role: 'Staff AI Researcher',
      org: 'Google DeepMind',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      expertise: 'Large Multimodal Models & Autonomous Agents',
    },
    {
      name: 'Marcus Vance',
      role: 'VP of Distributed Systems',
      org: 'AWS Cloud Architecture',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertise: 'High-Throughput Microservices & Zero-Cold-Start',
    },
    {
      name: 'Ananya Sen',
      role: 'Chief Security Officer',
      org: 'CipherZero Labs',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      expertise: 'Zero-Knowledge Proofs & Threat Hardening',
    },
    {
      name: 'David Kim',
      role: 'Founding Partner',
      org: 'Frontier Horizon Ventures',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      expertise: 'Seed Stage Incubation & Technical Go-To-Market',
    },
  ];

  const scheduleDays = {
    1: [
      { time: '09:00 AM', title: 'Hacker Check-in & Team Setup', desc: 'Discord onboarding, squad verification, and workspace allocation.' },
      { time: '11:00 AM', title: 'Grand Opening Keynote & Challenge Reveal', desc: 'Track problem briefs unveiled by tech leaders and sponsor judges.' },
      { time: '12:00 PM', title: 'Hacking Sprint Commences', desc: 'The 36-hour timer starts. Initial code commits & architecture design.' },
      { time: '06:00 PM', title: 'Mentor Checkpoint #1 (Architecture Review)', desc: '1:1 technical office hours with senior engineers to unblock teams.' },
      { time: '11:59 PM', title: 'Midnight Snack & Mini CTF Challenge', desc: 'Lightning mini-game break with bonus swag prizes.' },
    ],
    2: [
      { time: '08:00 AM', title: 'Breakfast & Morning Standup', desc: 'Checkpoint review and sprint velocity calibration.' },
      { time: '02:00 PM', title: 'Mentor Checkpoint #2 (API & Integration)', desc: 'Live code review and demo readiness check with clinical and AI judges.' },
      { time: '07:00 PM', title: 'Pitch Deck & Video Workshop', desc: 'How to craft a winning 3-minute demo and slides presentation.' },
      { time: '11:59 PM', title: 'Code Freeze Warning & Final Sprint', desc: 'Finalizing core features and containerizing demos.' },
    ],
    3: [
      { time: '10:00 AM', title: 'Hard Code Freeze & Submission Deadline', desc: 'All GitHub repos and presentation links locked in the portal.' },
      { time: '12:30 PM', title: 'Preliminary Round Judging', desc: 'Top 15 finalist teams selected by technical committee.' },
      { time: '03:30 PM', title: 'Grand Finale Live Pitch Demos', desc: 'Finalist teams present live on stage before founders and VC partners.' },
      { time: '05:30 PM', title: 'Awards Ceremony & Bounty Distribution', desc: 'Winner announcements, trophies, seed grants, and internships.' },
    ],
  };

  const techPartners = [
    'PyTorch', 'Next.js', 'Docker', 'Kubernetes', 'MongoDB', 'GitHub', 'AWS', 'Redis', 'FastAPI', 'Rust'
  ];

  const faqs = [
    {
      q: 'Who is eligible to participate in MatruCare AI Hackathon 2026?',
      a: 'Undergraduate and postgraduate students, diploma holders, and self-taught developers enrolled in any recognized institution across India are eligible to compete.',
    },
    {
      q: 'Can I participate solo or is a team required?',
      a: 'Both solo participants (Team Size 1) and teams of up to 5 members are welcome. Interdisciplinary teams with complementary frontend, backend, AI, and systems skills are highly encouraged.',
    },
    {
      q: 'What should be submitted for the prototype and presentation links?',
      a: 'You can submit a public GitHub repository or live URL for your prototype, along with a Google Drive or OneDrive presentation deck detailing your architecture and value proposition.',
    },
    {
      q: 'Can I update project links after submitting?',
      a: 'Yes! Your dashboard provides an Edit feature allowing you to update your presentation link, prototype repo, and demo video up until the submission deadline.',
    },
    {
      q: 'Is there any registration or entry fee?',
      a: 'No. MatruCare AI Hackathon 2026 is completely 100% free of charge for all accepted teams.',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-tech-grid">
      {/* Hero ambient glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono shadow-neon">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>REGISTRATIONS LIVE • 36-HOUR NATIONAL SPRINT</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
              Where Elite Hackers <br />
              <span className="text-gradient">Build Radical Tech</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed font-normal">
              Join 1,000+ top student developers, AI researchers, and engineers competing for ₹5,00,000 in bounties, VC mentorship, and institutional pilot grants.
            </p>

            {/* Live Countdown Timer */}
            <div className="pt-2 pb-4">
              <p className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold mb-2 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> HACKATHON SPRINT KICKOFF IN:
              </p>
              <CountdownTimer targetDate="2026-12-15T09:00:00" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link to={isAuthenticated ? '/register' : '/signup'}>
                <Button size="lg" variant="primary" icon={Zap} className="shadow-neon w-full sm:w-auto">
                  {isAuthenticated ? 'Open Project Registration' : 'Register Your Team'}
                </Button>
              </Link>

              <a href="#tracks">
                <Button size="lg" variant="outline" icon={ArrowRight} iconPosition="right" className="w-full sm:w-auto">
                  Explore Problem Tracks
                </Button>
              </a>

              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 hover:border-white/20 text-gray-400 hover:text-white bg-white/5 transition-colors text-sm font-mono w-full sm:w-auto justify-center"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Copied!' : 'Share Portal'}</span>
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-3xl mx-auto">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">₹5,00,000</p>
                <p className="text-[11px] font-mono text-gray-400 uppercase mt-1">Bounty Pool</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-brand-400">36 Hours</p>
                <p className="text-[11px] font-mono text-gray-400 uppercase mt-1">Non-Stop Sprint</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">1,200+</p>
                <p className="text-[11px] font-mono text-gray-400 uppercase mt-1">Participants</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">100% Free</p>
                <p className="text-[11px] font-mono text-gray-400 uppercase mt-1">Pan-India Entry</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tech Stack Marquee Strip */}
      <div className="py-6 border-y border-white/10 bg-[#07060D] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-6 overflow-x-auto text-xs font-mono text-gray-400 whitespace-nowrap">
          <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" /> SUPPORTED ECOSYSTEMS:
          </span>
          {techPartners.map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-md bg-white/5 border border-white/5 text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Problem Tracks Interactive Section */}
      <section id="tracks" className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Innovation Tracks"
            title="Engineered for High-Impact Problem Solving"
            subtitle="Choose a track aligning with your squad's technical stack. Each domain is judged on algorithmic complexity, execution speed, and functional utility."
          />

          {/* Interactive Track Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Track Selector List */}
            <div className="lg:col-span-5 space-y-3">
              {tracks.map((track, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedTrack(i)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-center gap-3.5 ${
                    selectedTrack === i
                      ? 'bg-brand-500/15 border-brand-500 shadow-neon text-white'
                      : 'bg-white/5 border-white/10 hover:border-white/20 text-gray-400 hover:text-white'
                  }`}
                >
                  <img
                    src={track.image}
                    alt={track.title}
                    className="w-12 h-12 rounded-xl object-cover border border-white/10 shrink-0"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="truncate flex-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block">
                      TRACK 0{i + 1} • {track.tag}
                    </span>
                    <h4 className="text-sm font-bold truncate mt-0.5 text-white">{track.title}</h4>
                    <span className="text-[11px] font-mono text-emerald-400 font-semibold">{track.bounty}</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 flex-shrink-0 transition-transform ${selectedTrack === i ? 'text-cyan-400 translate-x-1' : 'text-gray-500'}`} />
                </button>
              ))}
            </div>

            {/* Right Detailed Track Card */}
            <div className="lg:col-span-7">
              <Card className="p-6 sm:p-8 border-brand-500/30 bg-gradient-to-br from-[#121124] to-[#0D0C1A]">
                
                {/* Visual Banner Image */}
                <div className="relative h-48 sm:h-56 w-full rounded-2xl overflow-hidden mb-6 border border-white/10 group">
                  <img
                    src={tracks[selectedTrack].image}
                    alt={tracks[selectedTrack].title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D1B] via-[#0E0D1B]/60 to-transparent" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-mono font-bold text-emerald-400">
                    {tracks[selectedTrack].bounty}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold block mb-1">
                      {tracks[selectedTrack].tag}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-md">
                      {tracks[selectedTrack].title}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10 mb-5">
                  <span className="px-3 py-1 rounded-md text-xs font-mono font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {tracks[selectedTrack].tag}
                  </span>
                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-gray-400">Difficulty: <strong className="text-yellow-400">{tracks[selectedTrack].difficulty}</strong></span>
                    <span className="text-emerald-400 font-bold">{tracks[selectedTrack].bounty}</span>
                  </div>
                </div>

                <p className="text-sm text-gray-300 leading-relaxed mb-6">
                  {tracks[selectedTrack].desc}
                </p>

                {/* Recommended Tech Tools */}
                <div className="mb-6">
                  <p className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Recommended Frameworks & Tools:</p>
                  <div className="flex flex-wrap gap-2">
                    {tracks[selectedTrack].tools.map((tool) => (
                      <span key={tool} className="px-2.5 py-1 rounded-md bg-[#0A0A0F] border border-white/10 text-cyan-300 font-mono text-xs">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Example Project Prompts */}
                <div className="mb-6 p-4 rounded-xl bg-[#080711] border border-white/5 space-y-2">
                  <p className="text-xs font-mono uppercase tracking-wider text-brand-300 font-semibold">Example Problem Angles:</p>
                  <ul className="text-xs text-gray-400 space-y-1.5 list-disc pl-4">
                    {tracks[selectedTrack].ideas.map((idea, idx) => (
                      <li key={idx}>{idea}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-400">Ready to build in this domain?</span>
                  <Link to={isAuthenticated ? '/register' : '/signup'}>
                    <Button size="sm" variant="primary" icon={Zap}>
                      Register For This Track
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* 36-Hour Interactive Schedule Section */}
      <section className="py-24 border-b border-white/10 bg-[#07060E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Sprint Schedule"
            title="36-Hour Hackathon Roadmap"
            subtitle="Plan your sprint from kickoff to code freeze and live demos before the judging panel."
          />

          {/* Day Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setActiveDay(d)}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  activeDay === d
                    ? 'bg-gradient-to-r from-brand-600 to-cyan-600 text-white shadow-neon'
                    : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                DAY 0{d} // {d === 1 ? 'KICKOFF' : d === 2 ? 'MID-CHECKPOINT' : 'FINALE & DEMOS'}
              </button>
            ))}
          </div>

          {/* Schedule Timeline */}
          <Card className="p-6 sm:p-8">
            <div className="space-y-6">
              {scheduleDays[activeDay].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-start gap-4 pb-4 border-b border-white/5 last:border-b-0 last:pb-0">
                  <span className="px-3 py-1 rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/20 w-fit shrink-0">
                    {item.time}
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Hackathon Atmosphere & Moments Gallery */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Arena Atmosphere"
            title="36 Hours of Relentless Engineering"
            subtitle="Catch a glimpse of the adrenaline, late-night breakthroughs, and mainstage pitches that define MatruCare AI."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moments.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-[#0E0D1B] hover:border-brand-500/50 transition-all duration-300 hover:shadow-neon"
              >
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D1B] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[10px] font-mono font-bold text-cyan-400 border border-white/10">
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Judges & Mentors Section */}
      <section className="py-24 border-b border-white/10 bg-[#07060E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Distinguished Panel"
            title="Evaluated by Industry Tech Leaders"
            subtitle="Get technical reviews, architectural unblocking, and direct VC feedback from principal engineers and founders."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {judges.map((judge, idx) => (
              <Card key={idx} className="p-5 text-center group border-white/10 hover:border-cyan-500/40 transition-all">
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden border-2 border-brand-500/40 group-hover:border-cyan-400 transition-colors shadow-md">
                  <img
                    src={judge.avatar}
                    alt={judge.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <h4 className="text-base font-bold text-white">
                  {judge.name}
                </h4>
                <p className="text-xs text-cyan-400 font-mono font-semibold mt-0.5">
                  {judge.role}
                </p>
                <p className="text-[11px] font-mono text-gray-400 mt-1">
                  {judge.org}
                </p>
                <div className="mt-3 pt-3 border-t border-white/5 text-[11px] text-gray-400 font-mono">
                  Focus: {judge.expertise}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes Section */}
      <section id="prizes" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Bounties & Rewards"
            title="₹5,00,000 Prize Pool & Grants"
            subtitle="Direct cash awards, VC introductions, premium developer licenses, and seed incubation."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end">
            
            {/* 2nd Place */}
            <Card className="p-6 md:p-8 order-2 md:order-1 border-cyan-500/40">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-500/30">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                First Runner-Up
              </p>
              <h3 className="text-3xl font-extrabold text-white mb-2">
                ₹1,50,000
              </h3>
              <ul className="space-y-2 text-xs text-gray-400 mb-6 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> ₹1,50,000 Direct Cash Prize
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Tier-1 VC Pitch Access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> $5,000 Cloud Compute Credits
                </li>
              </ul>
            </Card>

            {/* 1st Place Champion */}
            <Card className="p-8 md:p-10 order-1 md:order-2 border-2 border-brand-500 shadow-neon relative scale-105 z-10 bg-gradient-to-b from-[#181630] to-[#111022]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-500 to-cyan-500 text-white text-xs font-extrabold uppercase tracking-wider shadow">
                Overall Champion
              </div>
              <div className="w-14 h-14 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4 border border-brand-500/30">
                <Award className="w-8 h-8" />
              </div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-brand-400 mb-1">
                Grand Winner
              </p>
              <h3 className="text-4xl font-extrabold text-white mb-2">
                ₹2,50,000
              </h3>
              <p className="text-xs text-cyan-400 font-mono font-semibold mb-4">
                + Seed Incubation & Cloud GPU Credits
              </p>
              <ul className="space-y-2.5 text-xs text-gray-300 mb-6 font-mono">
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> ₹2,50,000 Cash Prize
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> $10,000 Cloud Infrastructure
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Fast-track Interviews & Fellowships
                </li>
                <li className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> Champion Trophy & Swag Box
                </li>
              </ul>
              <Link to={isAuthenticated ? '/register' : '/signup'}>
                <Button className="w-full" size="md">
                  Claim the Grand Bounty
                </Button>
              </Link>
            </Card>

            {/* 3rd Place */}
            <Card className="p-6 md:p-8 order-3 border-purple-500/40">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-1">
                Second Runner-Up
              </p>
              <h3 className="text-3xl font-extrabold text-white mb-2">
                ₹1,00,000
              </h3>
              <ul className="space-y-2 text-xs text-gray-400 mb-6 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> ₹1,00,000 Direct Cash Prize
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Engineering Mentorship
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Official Merit Certificate
                </li>
              </ul>
            </Card>

          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Frequently Asked Questions"
            title="Everything You Need to Know"
            subtitle="Details on team formation, eligibility, submission guidelines, and evaluation criteria."
          />

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card
                key={idx}
                className="overflow-hidden border border-white/10"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-cyan-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-6 pb-5 pt-1 text-sm text-gray-400 leading-relaxed border-t border-white/10"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 via-indigo-600 to-cyan-600 p-8 sm:p-12 text-center text-white shadow-2xl">
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 text-white">
              Ready to Prove Your Engineering Skills?
            </h2>
            <p className="text-base text-white/90 max-w-xl mx-auto mb-8 leading-relaxed font-normal">
              Assemble your team, build an impactful solution, and compete for ₹5,00,000 in bounties at MatruCare AI Hackathon 2026.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={isAuthenticated ? '/register' : '/signup'}>
                <Button size="lg" className="bg-white text-brand-900 hover:bg-gray-100 border-none shadow-xl font-bold">
                  {isAuthenticated ? 'Go to Project Registration' : 'Register Your Team'}
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 border border-white/30">
                  Ask Helpdesk
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
