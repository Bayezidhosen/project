import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Camera, Lock, Mail, User, Image, Check, X, ArrowRight } from 'lucide-react';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { register } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  // Live password validation
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Please ensure all password security criteria are met.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, photoUrl.trim() || undefined);
      toast.success('Account created successfully! Please sign in with your credentials.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#181F2B] border border-[#293344] rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C5F36A] flex items-center justify-center text-[#10151F] mx-auto shadow-md">
            <Camera className="w-6 h-6 stroke-[2.5]" />
          </div>
          <h2 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            Join StudioSpace
          </h2>
          <p className="text-xs text-[#A1AAB9]">
            Create your account to book verified studios and list production spaces.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elena@aperturehouse.com"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
              Profile Photo URL (Optional)
            </label>
            <div className="relative">
              <Image className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C5F36A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F8FAFC] mb-1.5">
              Create Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A1AAB9] absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#10151F] border border-[#293344] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#C5F36A]"
              />
            </div>

            {/* Validation Checklist */}
            <div className="mt-2.5 space-y-1.5 p-3 rounded-xl bg-[#10151F] border border-[#293344]">
              <div className="flex items-center gap-2 text-[11px]">
                {hasMinLength ? (
                  <Check className="w-3.5 h-3.5 text-[#C5F36A]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className={hasMinLength ? 'text-white' : 'text-slate-500'}>
                  At least 6 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                {hasUppercase ? (
                  <Check className="w-3.5 h-3.5 text-[#C5F36A]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className={hasUppercase ? 'text-white' : 'text-slate-500'}>
                  At least one uppercase letter (A-Z)
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                {hasLowercase ? (
                  <Check className="w-3.5 h-3.5 text-[#C5F36A]" />
                ) : (
                  <X className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className={hasLowercase ? 'text-white' : 'text-slate-500'}>
                  At least one lowercase letter (a-z)
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !isPasswordValid}
            className="w-full py-3 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] disabled:opacity-50 transition-all shadow-md"
          >
            {loading ? 'Creating Creator Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-[#A1AAB9]">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="font-semibold text-[#C5F36A] hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};
