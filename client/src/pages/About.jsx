import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, ShieldCheck, Cpu, Code2, Award, Zap, ArrowRight } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import { useAuth } from '../context/AuthContext';

const About = () => {
  const { isAuthenticated } = useAuth();

  const criteria = [
    {
      title: 'Technical Innovation & Algorithmic Depth (30%)',
      desc: 'Does the project introduce non-trivial algorithms, creative model architectures, or novel engineering implementations rather than simple wrappers?',
    },
    {
      title: 'System Completeness & Working Prototype (25%)',
      desc: 'Is there a working end-to-end prototype, live interactive demo, or demonstrable repository that executes successfully during judging?',
    },
    {
      title: 'Real-World Feasibility & Utility (20%)',
      desc: 'Does the project solve a tangible, high-value problem for real users, organizations, or developers at scale?',
    },
    {
      title: 'Code Quality, Architecture & Documentation (15%)',
      desc: 'Clean repository structure, modular components, API documentation, reproducible README setup, and error handling.',
    },
    {
      title: 'Pitch Clarity, Presentation & Q&A (10%)',
      desc: 'Effectiveness of the team pitch deck, clarity in articulating the value proposition, and technical defense during judge Q&A.',
    },
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
      
      {/* Hero / Vision Statement */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-brand-500/10 text-brand-300 border border-brand-500/30">
          MatruCare AI Mission & Values
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Where Radical Builders <span className="text-cyan-gradient">Engineer the Next Web</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-normal">
          MatruCare AI Hackathon 2026 was established to create a high-impact arena: an intense, high-octane 36-hour sprint where collegiate engineers, builders, and designers transform conceptual blueprints into production-grade systems.
        </p>
      </div>

      {/* Featured Arena Banner Image */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-64 sm:h-80 md:h-96 w-full">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=80"
          alt="MatruCare AI Collaborative Engineering Arena"
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090812] via-[#090812]/40 to-transparent" />
        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-md bg-brand-500/80 backdrop-blur-md text-white font-mono text-xs font-bold uppercase tracking-wider">
              National Sprint Edition
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
              Empowering 1,200+ Student Engineers Nationwide
            </h3>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-gray-300 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>36 Hours • ₹5,00,000 Grants • 100% Free</span>
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/15 text-brand-400 flex items-center justify-center mx-auto mb-4 border border-brand-500/30">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Builder-First Culture
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Zero vanity metrics. We value functional code, resilient architectures, and working prototypes above slides.
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center mx-auto mb-4 border border-cyan-500/30">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Elite Technical Mentorship
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Top tech leads, open-source maintainers, and venture engineers provide unblocked architecture guidance throughout the sprint.
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-400 flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Direct Launchpad & Grants
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Winners receive direct cash bounties, accelerator interviews, and cloud credits to take prototypes to production.
          </p>
        </Card>
      </div>

      {/* Evaluation Rubric */}
      <div className="pt-8">
        <SectionHeading
          badge="Judging Standards"
          title="Official Evaluation Rubric"
          subtitle="All team submissions are graded across 5 objective benchmarks by our engineering panel."
        />

        <div className="space-y-4 max-w-4xl mx-auto">
          {criteria.map((item, idx) => (
            <Card key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-bold text-base text-white font-mono flex items-center gap-2">
                  <span className="text-cyan-400">0{idx + 1}.</span> {item.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-8">
        <Link to={isAuthenticated ? '/register' : '/signup'}>
          <Button size="lg" variant="primary" icon={ArrowRight} iconPosition="right">
            Register for MatruCare AI Hackathon 2026
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default About;
