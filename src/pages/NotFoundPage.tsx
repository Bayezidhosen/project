import React from 'react';
import { Camera, Compass, ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-[#181F2B] border border-[#293344] rounded-3xl p-8 sm:p-10 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-[#C5F36A]/10 text-[#C5F36A] flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-3xl font-extrabold text-[#C5F36A]">404</span>
          <h1 className="font-display text-2xl font-extrabold text-[#F8FAFC]">
            Studio Floor Not Found
          </h1>
          <p className="text-xs text-[#A1AAB9] leading-relaxed">
            The creative space, session URL, or production page you requested could not be located in our stage registry.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/studios')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#293344] text-[#F8FAFC] font-semibold text-xs hover:bg-[#293344] transition-colors"
          >
            Explore Studios
          </button>
        </div>
      </div>
    </div>
  );
};
