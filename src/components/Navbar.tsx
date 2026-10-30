import React, { useState } from 'react';
import {
  Camera,
  Sun,
  Moon,
  Menu,
  X,
  User as UserIcon,
  PlusCircle,
  Calendar,
  Grid,
  Heart,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, navigate }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Explore Studios', path: '/studios' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'About Us', path: '/#about-us' }
  ];

  const handleLinkClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#10151F]/90 dark:bg-[#10151F]/90 border-b border-[#293344] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2.5 text-left group whitespace-nowrap shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#C5F36A] flex items-center justify-center text-[#10151F] shadow-sm group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-extrabold tracking-tight text-[#F8FAFC]">
                Studio<span className="text-[#C5F36A]">Space</span>
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.label}
                  onClick={() => handleLinkClick(link.path)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-[#C5F36A] font-semibold'
                      : 'text-[#A1AAB9] hover:text-[#F8FAFC]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5F36A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions & Auth */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-[#A1AAB9] hover:text-[#F8FAFC] hover:bg-[#181F2B] border border-transparent hover:border-[#293344] transition-colors"
              aria-label="Toggle dark/light theme"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#C5F36A]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Unauthenticated View */}
            {!user ? (
              <div className="hidden sm:flex items-center gap-2.5">
                <button
                  onClick={() => handleLinkClick('/login')}
                  className="px-4 py-2 text-xs font-semibold text-[#F8FAFC] hover:text-white rounded-lg hover:bg-[#181F2B] transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleLinkClick('/register')}
                  className="px-4 py-2 text-xs font-bold text-[#10151F] bg-[#C5F36A] hover:bg-[#b0de57] rounded-lg shadow-sm transition-all duration-200 whitespace-nowrap"
                >
                  Join as Creator
                </button>
              </div>
            ) : (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-[#293344] bg-[#181F2B] hover:border-[#C5F36A]/40 transition-colors"
                >
                  <img
                    src={user.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover bg-slate-800"
                  />
                  <span className="hidden sm:inline-block text-xs font-semibold text-[#F8FAFC] max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    onMouseLeave={() => setUserDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#181F2B] border border-[#293344] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-[#293344] mb-1">
                      <p className="text-xs font-semibold text-[#F8FAFC] truncate">{user.name}</p>
                      <p className="text-[11px] text-[#A1AAB9] truncate">{user.email}</p>
                    </div>

                    <div className="space-y-0.5 text-xs text-[#F8FAFC]">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLinkClick('/dashboard');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#10151F] hover:text-[#C5F36A] transition-colors text-left"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#A1AAB9]" />
                        Dashboard
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLinkClick('/my-bookings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#10151F] hover:text-[#C5F36A] transition-colors text-left"
                      >
                        <Calendar className="w-4 h-4 text-[#A1AAB9]" />
                        My Bookings
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLinkClick('/my-listings');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#10151F] hover:text-[#C5F36A] transition-colors text-left"
                      >
                        <Grid className="w-4 h-4 text-[#A1AAB9]" />
                        My Studio Listings
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLinkClick('/wishlist');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#10151F] hover:text-[#C5F36A] transition-colors text-left"
                      >
                        <Heart className="w-4 h-4 text-[#A1AAB9]" />
                        Saved Wishlist
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLinkClick('/add-studio');
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#10151F] text-[#C5F36A] font-semibold transition-colors text-left"
                      >
                        <PlusCircle className="w-4 h-4 text-[#C5F36A]" />
                        Host New Studio
                      </button>

                      <div className="pt-1 mt-1 border-t border-[#293344]">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-500/10 text-rose-400 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[#A1AAB9] hover:text-[#F8FAFC] hover:bg-[#181F2B] border border-[#293344]"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#293344] bg-[#10151F] px-4 pt-4 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${
                  currentPath === link.path
                    ? 'bg-[#181F2B] text-[#C5F36A] font-semibold'
                    : 'text-[#A1AAB9] hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {!user ? (
            <div className="pt-3 border-t border-[#293344] flex flex-col gap-2">
              <button
                onClick={() => handleLinkClick('/login')}
                className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#181F2B] border border-[#293344] rounded-xl"
              >
                Sign In
              </button>
              <button
                onClick={() => handleLinkClick('/register')}
                className="w-full py-2.5 text-center text-xs font-bold text-[#10151F] bg-[#C5F36A] rounded-xl"
              >
                Join as Creator
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-[#293344] space-y-1">
              <button
                onClick={() => handleLinkClick('/dashboard')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#F8FAFC] hover:bg-[#181F2B] flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-[#A1AAB9]" />
                Dashboard
              </button>
              <button
                onClick={() => handleLinkClick('/add-studio')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#C5F36A] font-semibold hover:bg-[#181F2B] flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-[#C5F36A]" />
                Host New Studio
              </button>
              <button
                onClick={() => handleLinkClick('/my-bookings')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#F8FAFC] hover:bg-[#181F2B] flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-[#A1AAB9]" />
                My Bookings
              </button>
              <button
                onClick={() => handleLinkClick('/my-listings')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-[#F8FAFC] hover:bg-[#181F2B] flex items-center gap-2"
              >
                <Grid className="w-4 h-4 text-[#A1AAB9]" />
                My Studio Listings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
