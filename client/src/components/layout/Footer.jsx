import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Github, Twitter, Linkedin, Terminal, Code2 } from 'lucide-react';
import { SITE_CONFIG } from '../../config/site';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#07070B] text-gray-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 flex items-center justify-center shadow-neon">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1.5">
                {SITE_CONFIG.brandName} <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30">{SITE_CONFIG.year}</span>
              </span>
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              India's premier 36-hour hackathon bringing together student developers, researchers, and engineers to build high-impact technologies.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-200 mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-300 transition-colors">
                  Overview & Schedule
                </Link>
              </li>
              <li>
                <a href="/#tracks" className="hover:text-brand-300 transition-colors">
                  Hackathon Tracks
                </a>
              </li>
              <li>
                <a href="/#prizes" className="hover:text-brand-300 transition-colors">
                  Prizes & Bounty Pool
                </a>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-300 transition-colors">
                  Judging Criteria
                </Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-brand-300 transition-colors">
                  Register Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-200 mb-4">
              Helpdesk & Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Official Inquiries</p>
                  <a
                    href={`mailto:${SITE_CONFIG.supportEmail}`}
                    className="font-mono text-xs text-cyan-400 hover:underline"
                  >
                    {SITE_CONFIG.supportEmail}
                  </a>
                </div>
              </li>
              <li className="text-xs text-gray-500 leading-relaxed pt-1">
                Hosted in collaboration with top engineering universities and technology partners across India.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.brandName}. All rights reserved.</p>
          <p className="flex items-center gap-1.5 font-mono">
            <Code2 className="w-3.5 h-3.5 text-brand-400" /> MatruCare AI Hackathon Registration Portal
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
