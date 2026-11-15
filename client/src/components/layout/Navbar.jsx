import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Terminal, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Tracks', path: '/#tracks' },
    { name: 'Prizes', path: '/#prizes' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-500 flex items-center justify-center shadow-neon group-hover:scale-105 transition-transform duration-200">
              <Terminal className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-brand-300 transition-colors flex items-center gap-1.5">
                MatruCare AI <span className="text-cyan-400 font-mono text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30">2026</span>
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                Hackathon Registration Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg ${
                  isActive ? 'text-white font-semibold bg-white/5' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Home
            </NavLink>
            <a href="/#tracks" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
              Tracks
            </a>
            <a href="/#prizes" className="text-sm font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors">
              Prizes
            </a>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg ${
                  isActive ? 'text-white font-semibold bg-white/5' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors duration-200 px-3 py-1.5 rounded-lg ${
                  isActive ? 'text-white font-semibold bg-white/5' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="secondary" size="sm" icon={LayoutDashboard}>
                    Dashboard
                  </Button>
                </Link>

                <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                  <div className="text-right hidden lg:block">
                    <p className="text-xs font-semibold text-white leading-none">
                      {user?.fullName?.split(' ')[0] || 'Hacker'}
                    </p>
                    <p className="text-[10px] font-mono text-cyan-400 leading-tight mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm" icon={Zap}>
                    Register Now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-gray-300 hover:bg-white/5 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 bg-[#0E0D18]/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4"
          >
            <div className="flex flex-col space-y-2">
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
              >
                Home
              </NavLink>
              <a
                href="/#tracks"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
              >
                Tracks
              </a>
              <a
                href="/#prizes"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
              >
                Prizes
              </a>
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
              >
                About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white"
              >
                Contact
              </NavLink>
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <div className="px-3.5 py-2 bg-white/5 rounded-xl">
                    <p className="text-xs font-semibold text-white">{user?.fullName}</p>
                    <p className="text-xs font-mono text-cyan-400">{user?.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="secondary" className="w-full" icon={LayoutDashboard}>
                      My Dashboard
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full text-red-400 border-red-500/30" icon={LogOut} onClick={handleLogout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="outline" className="w-full">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button variant="primary" className="w-full" icon={Zap}>
                      Register Now
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
