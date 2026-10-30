import React, { useState } from 'react';
import { Camera, ArrowRight, ShieldCheck, Instagram, Youtube, Linkedin, Check } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    toast.success('Thank you for subscribing to StudioSpace Creator Dispatch.');
    setEmail('');
  };

  return (
    <footer className="bg-[#0C0F17] text-[#A1AAB9] border-t border-[#293344] pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#293344]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#C5F36A] flex items-center justify-center text-[#10151F]">
                <Camera className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-[#F8FAFC]">
                Studio<span className="text-[#C5F36A]">Space</span>
              </span>
            </div>

            <p className="text-xs text-[#A1AAB9] leading-relaxed max-w-sm">
              The premier marketplace connecting production teams, photographers, musicians, and filmmakers with verified world-class creative studios.
            </p>

            <div className="flex items-center gap-3 pt-2">
              {/* New X Logo SVG */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#181F2B] border border-[#293344] flex items-center justify-center text-[#F8FAFC] hover:border-[#C5F36A] hover:text-[#C5F36A] transition-colors"
                aria-label="Follow us on X"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#181F2B] border border-[#293344] flex items-center justify-center text-[#F8FAFC] hover:border-[#C5F36A] hover:text-[#C5F36A] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#181F2B] border border-[#293344] flex items-center justify-center text-[#F8FAFC] hover:border-[#C5F36A] hover:text-[#C5F36A] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#181F2B] border border-[#293344] flex items-center justify-center text-[#F8FAFC] hover:border-[#C5F36A] hover:text-[#C5F36A] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Studio Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/studios?category=Photo Studio')}
                  className="hover:text-[#C5F36A] transition-colors"
                >
                  Photo Studios
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/studios?category=Film Stage')}
                  className="hover:text-[#C5F36A] transition-colors"
                >
                  Film Soundstages
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/studios?category=Podcast Lounge')}
                  className="hover:text-[#C5F36A] transition-colors"
                >
                  Podcast Lounges
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/studios?category=Music Suite')}
                  className="hover:text-[#C5F36A] transition-colors"
                >
                  Music & Audio Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/studios?category=Art Workshop')}
                  className="hover:text-[#C5F36A] transition-colors"
                >
                  Art & Ceramic Workshops
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/studios')} className="hover:text-[#C5F36A] transition-colors">
                  Explore Spaces
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/add-studio')} className="hover:text-[#C5F36A] transition-colors">
                  List Your Studio
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/#how-it-works')} className="hover:text-[#C5F36A] transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/#host-guarantee')} className="hover:text-[#C5F36A] transition-colors">
                  Host Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-[#C5F36A] transition-colors">
                  Creator Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Creator Dispatch
            </h4>
            <p className="text-xs text-[#A1AAB9] leading-relaxed">
              Curated soundstages, gear discounts, and lighting workshops delivered monthly.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex items-center gap-1.5 bg-[#181F2B] border border-[#293344] rounded-xl p-1 focus-within:border-[#C5F36A] transition-colors">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@studio.com"
                  className="bg-transparent text-xs text-[#F8FAFC] px-2.5 py-1.5 w-full focus:outline-none placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-[#C5F36A] text-[#10151F] hover:bg-[#b0de57] transition-colors shrink-0"
                  aria-label="Subscribe"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#C5F36A]" /> No spam. Unsubscribe anytime.
              </span>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 StudioSpace Technologies Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Security Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
