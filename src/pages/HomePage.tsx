import React, { useEffect, useState } from 'react';
import { Studio, StudioCategory } from '../types';
import { api } from '../services/api';
import { StudioCard } from '../components/StudioCard';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Clock,
  Layers,
  Camera,
  Film,
  Mic2,
  Music,
  Palette,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award
} from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

const HERO_SLIDES = [
  {
    image: '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg',
    tagline: 'World-Class Cyclorama Stages',
    title: 'Where Vision Takes Physical Form',
    description: 'Book architecturally designed infinity curves, motorized softbox grids, and high-fashion editorial stages by the hour with instant confirmation.'
  },
  {
    image: '/src/assets/images/film_stage_soundstage_1793378836054.jpg',
    tagline: 'Acoustically Isolated Soundstages',
    title: 'Tier-1 Film Production Facilities',
    description: 'Drive-in elephant doors, STC-65 sound isolation, 3-phase camlock power, and heavy-duty camera dolly rigs for feature films and commercial shoots.'
  },
  {
    image: '/src/assets/images/podcast_lounge_neon_1793378837013.jpg',
    tagline: 'Turnkey Broadcast Lounges',
    title: 'Broadcast Warmth & Cinematic Video',
    description: 'Fully pre-configured Shure SM7B arrays, automated 4K multi-cam switching, and bespoke acoustic wood paneling ready to record.'
  }
];

const CATEGORIES: { name: StudioCategory; icon: any; count: string; image: string }[] = [
  {
    name: 'Photo Studio',
    icon: Camera,
    count: '24+ spaces',
    image: '/src/assets/images/hero_cyclorama_studio_1793378836214.jpg'
  },
  {
    name: 'Film Stage',
    icon: Film,
    count: '16+ stages',
    image: '/src/assets/images/film_stage_soundstage_1793378836054.jpg'
  },
  {
    name: 'Podcast Lounge',
    icon: Mic2,
    count: '19+ lounges',
    image: '/src/assets/images/podcast_lounge_neon_1793378837013.jpg'
  },
  {
    name: 'Music Suite',
    icon: Music,
    count: '14+ suites',
    image: '/src/assets/images/music_recording_suite_1793378838029.jpg'
  },
  {
    name: 'Art Workshop',
    icon: Palette,
    count: '12+ lofts',
    image: '/src/assets/images/art_craft_loft_workshop_1793378838996.jpg'
  }
];

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [featuredStudios, setFeaturedStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getStudios({ limit: 6 });
        if (res.success) {
          setFeaturedStudios(res.studios);
        }
      } catch (e) {
        console.error('Failed to load featured studios:', e);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  // Slide autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="flex flex-col min-h-screen">
      {/* SECTION 1: HERO SLIDER */}
      <section className="relative w-full h-[580px] sm:h-[640px] lg:h-[700px] overflow-hidden bg-slate-950 flex items-center">
        {/* Slides */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.title}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              activeSlide === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            {/* Background Image with Dark Vignette */}
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover scale-105 transition-transform duration-10000"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#10151F] via-[#10151F]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10151F] via-transparent to-black/30" />

            {/* Slide Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
              <div className="max-w-2xl space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#C5F36A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{slide.tagline}</span>
                </div>

                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                  {slide.title}
                </h1>

                <p className="text-sm sm:text-base text-[#A1AAB9] leading-relaxed max-w-xl">
                  {slide.description}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => navigate('/studios')}
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    Explore Studios
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigate('/add-studio')}
                    className="px-6 py-3.5 rounded-xl bg-[#181F2B]/90 backdrop-blur-md border border-[#293344] text-[#F8FAFC] font-semibold text-xs tracking-wider hover:bg-[#293344] hover:text-white transition-all"
                  >
                    Host Your Space
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Slider Controls */}
        <div className="absolute bottom-8 right-4 sm:right-12 z-30 flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-[#293344] text-white hover:bg-black/80 hover:text-[#C5F36A] transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5 px-2">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`h-1.5 rounded-full transition-all ${
                  activeSlide === i ? 'w-6 bg-[#C5F36A]' : 'w-2 bg-white/40'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="p-3 rounded-full bg-black/50 backdrop-blur-md border border-[#293344] text-white hover:bg-black/80 hover:text-[#C5F36A] transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* SECTION 2: FEATURED STUDIOS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#C5F36A] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Curated Spaces</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Featured Creative Studios
            </h2>
          </div>

          <button
            onClick={() => navigate('/studios')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5F36A] hover:underline whitespace-nowrap self-start sm:self-auto"
          >
            View all 40+ spaces
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Studio Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-[#181F2B] border border-[#293344] rounded-2xl h-80 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredStudios.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onSelect={(id) => navigate(`/studios/${id}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 3: BROWSE CATEGORIES */}
      <section className="py-16 bg-[#0E121B] border-y border-[#293344] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              Spaces Designed for Your Discipline
            </h2>
            <p className="mt-2 text-xs text-[#A1AAB9]">
              Every space is verified for acoustic dampening, lighting grids, and equipment reliability.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => navigate(`/studios?category=${encodeURIComponent(cat.name)}`)}
                  className="group relative h-48 rounded-2xl overflow-hidden border border-[#293344] hover:border-[#C5F36A] text-left p-4 flex flex-col justify-between transition-all duration-300"
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-40 group-hover:opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#10151F] via-[#10151F]/60 to-transparent" />

                  <div className="relative z-10 self-start p-2 rounded-xl bg-black/40 backdrop-blur-md text-[#C5F36A]">
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-bold text-sm text-[#F8FAFC] group-hover:text-[#C5F36A] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-[#A1AAB9] mt-0.5">{cat.count}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW BOOKING WORKS */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
            Effortless Production Flow
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            How StudioSpace Works
          </h2>
          <p className="text-xs text-[#A1AAB9] mt-2">
            No endless broker back-and-forths. Book verified soundstages with transparent rates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {[
            {
              num: '01',
              title: 'Discover Spaces',
              desc: 'Explore curated stages with full specifications, lighting inventories, and 360 virtual previews.'
            },
            {
              num: '02',
              title: 'Select Shoot Hours',
              desc: 'Choose exact calendar dates and production hours. Hourly rates and security deposit are transparent upfront.'
            },
            {
              num: '03',
              title: 'Book Instantly',
              desc: 'Our collision-free reservation engine locks your slot instantly without double-booking risk.'
            },
            {
              num: '04',
              title: 'Create & Produce',
              desc: 'Arrive at the studio, check in with host access codes, and produce your masterpiece with full peace of mind.'
            }
          ].map((step, idx) => (
            <div
              key={step.num}
              className="relative p-6 rounded-2xl bg-[#181F2B] border border-[#293344] flex flex-col justify-between hover:border-[#C5F36A]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-2xl font-extrabold text-[#C5F36A]">
                  {step.num}
                </span>
                <span className="text-xs font-semibold text-slate-500">Step {idx + 1}</span>
              </div>
              <h3 className="font-bold text-base text-[#F8FAFC] mb-2">{step.title}</h3>
              <p className="text-xs text-[#A1AAB9] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: HOST GUARANTEE & CREATOR SUPPORT */}
      <section id="about-us" className="py-20 bg-[#0C0F17] border-t border-[#293344]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5F36A] uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                <span>Verified Creator Trust</span>
              </div>

              <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
                Complete Production Protection on Every Session
              </h2>

              <p className="text-xs sm:text-sm text-[#A1AAB9] leading-relaxed">
                Whether you are shooting a high-budget commercial with RED cinema packages or recording an intimate audio series, StudioSpace guarantees quality, uptime, and host reliability.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#C5F36A]/10 text-[#C5F36A] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Verified Host Identity</h4>
                    <p className="text-[11px] text-[#A1AAB9] mt-0.5">Every studio owner is vetted with identity verification and space audits.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#C5F36A]/10 text-[#C5F36A] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Liability Protection</h4>
                    <p className="text-[11px] text-[#A1AAB9] mt-0.5">Automated coverage options for third-party property damage and equipment.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#C5F36A]/10 text-[#C5F36A] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Equipment Safety</h4>
                    <p className="text-[11px] text-[#A1AAB9] mt-0.5">Standardized check-in protocols and security deposit escrow management.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[#C5F36A]/10 text-[#C5F36A] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">24/7 Producer Support</h4>
                    <p className="text-[11px] text-[#A1AAB9] mt-0.5">Live emergency dispatch team ready if access codes or gear fail on set.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Creative Visual Card */}
            <div className="relative rounded-3xl overflow-hidden border border-[#293344] bg-[#181F2B] p-2 aspect-[4/3] shadow-2xl">
              <img
                src="/src/assets/images/music_recording_suite_1793378838029.jpg"
                alt="Sound suite studio"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-[#293344] flex items-center justify-between text-xs text-white">
                <div>
                  <p className="font-bold">StudioSpace Guarantee</p>
                  <p className="text-[11px] text-[#A1AAB9]">100% money-back booking lock</p>
                </div>
                <Award className="w-6 h-6 text-[#C5F36A]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: STUDIO OWNER CTA BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#181F2B] to-[#10151F] border border-[#293344] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs font-mono text-[#C5F36A] uppercase tracking-wider">
              Host Opportunity
            </span>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
              Have an Underutilized Creative Studio or Soundstage?
            </h2>
            <p className="text-xs sm:text-sm text-[#A1AAB9] leading-relaxed">
              Monetize downtime between commercial productions. Join thousands of studio managers earning $5,000–$25,000+ monthly with automated booking scheduling and identity-verified creators.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/add-studio')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C5F36A] text-[#10151F] font-bold text-xs uppercase tracking-wider hover:bg-[#b0de57] transition-all"
              >
                List Your Space for Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
