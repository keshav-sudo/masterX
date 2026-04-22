'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, Home, ChefHat } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { CITIES } from '@/lib/constants';
import { useLocationStore } from '@/lib/store';
import toast from 'react-hot-toast';

const globalStyles = `
  @keyframes float-img {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
  }
  .animate-float-hero {
    animation: float-img 4s ease-in-out infinite;
  }
  .hero-bg {
    background: linear-gradient(135deg, #f97316 0%, #fb923c 40%, #facc15 100%);
  }
  .glass-tag {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  /* Dotted texture overlay */
  .dotted-texture {
    background-image: radial-gradient(rgba(255,255,255,0.15) 1.2px, transparent 1.2px);
    background-size: 24px 24px;
  }
  .stats-dotted {
    background-image: radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px);
    background-size: 20px 20px;
  }
  .stat-number {
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;
  }
`;

export default function LandingPage() {
  const router = useRouter();
  const { setLocation } = useLocationStore();
  const [searchCity, setSearchCity] = useState('');

  const handleSearch = () => {
    if (!searchCity) {
      toast.error('Please select a city');
      return;
    }
    setLocation({ city: searchCity });
    router.push('/properties');
  };

  return (
    <>
      <style jsx global>{globalStyles}</style>
      <div className="min-h-screen bg-white">
        <Navbar />

        {/* ========== HERO SECTION with dotted texture ========== */}
        <section className="relative hero-bg pt-20 pb-16 md:pt-32 md:pb-32 overflow-hidden">
          {/* Dotted Texture Overlay */}
          <div className="absolute inset-0 dotted-texture pointer-events-none z-0"></div>
          
          {/* Subtle Background Blobs */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-full blur-3xl -translate-y-1/2"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              
              {/* Left Content */}
              <div className="w-full lg:w-3/5 text-left">
                <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white text-xs font-bold uppercase tracking-wider">#1 Broker-Free App</span>
                </div>

                {/* Main Heading - FIXED "PERFECT" visibility */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[1.05] tracking-tighter mb-8 drop-shadow-lg">
                  FIND YOUR <br />
                  <span className="text-yellow-200 drop-shadow-2xl">PERFECT</span> <br />
                  STAY.
                </h1>

                {/* Glass Tagline */}
                <div className="glass-tag max-w-xl p-6 rounded-3xl mb-10 shadow-xl">
                  <p className="text-base md:text-xl text-white font-semibold leading-relaxed tracking-wide">
                    Direct owner contact for 
                    <span className="font-black underline decoration-white/60 decoration-2 ml-1">Rooms</span>, 
                    <span className="font-black underline decoration-white/60 decoration-2 ml-1">Roommates</span>, and 
                    <span className="font-black underline decoration-white/60 decoration-2 ml-1">Cooks</span>. 
                    Simple, fast, and free.
                  </p>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl">
                  <div className="flex items-center flex-1 w-full gap-3 px-4 py-2">
                    <MapPin className="w-6 h-6 text-orange-500" />
                    <select
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full bg-transparent outline-none font-bold text-gray-800 text-base md:text-lg cursor-pointer appearance-none tracking-wide"
                    >
                      <option value="">Select City...</option>
                      {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={handleSearch}
                    className="w-full md:w-auto bg-black hover:bg-orange-600 text-white px-8 md:px-10 py-3 md:py-4 rounded-[1.5rem] flex items-center justify-center gap-3 font-black text-base md:text-lg transition-all tracking-wide"
                  >
                    <Search className="w-5 h-5" />
                    SEARCH
                  </button>
                </div>
              </div>

              {/* Right Content */}
              <div className="w-full lg:w-2/5 relative">
                <div className="animate-float-hero relative z-10">
                  <img
                    src="https://illustrations.popsy.co/amber/shaking-hands.svg" 
                    alt="Success"
                    className="w-full h-auto drop-shadow-2xl scale-110 lg:scale-125"
                  />
                </div>

                {/* Floating Badges */}
                <div className="absolute -top-4 -left-4 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-[-6deg] z-20 border border-white/50">
                  <div className="bg-orange-100 p-2 rounded-lg"><Home className="text-orange-600 w-5 h-5" /></div>
                  <span className="font-extrabold text-gray-800 text-sm md:text-base whitespace-nowrap tracking-tight">12k+ Rooms</span>
                </div>
                
                <div className="absolute bottom-10 -right-4 bg-white/90 backdrop-blur-sm p-3 md:p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-[4deg] z-20 border border-white/50">
                  <div className="bg-green-100 p-2 rounded-lg"><ChefHat className="text-green-600 w-5 h-5" /></div>
                  <span className="font-extrabold text-gray-800 text-sm md:text-base whitespace-nowrap tracking-tight">Verified Cooks</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========== STATS STRIP with dotted texture ========== */}
        <div className="bg-black py-12 relative z-20 stats-dotted">
          <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-between items-center gap-8 relative z-10">
            <div className="flex-1 text-center border-r border-white/10 last:border-none">
              <div className="text-3xl md:text-5xl font-black text-white stat-number tracking-tight drop-shadow-md">12,400+</div>
              <div className="text-orange-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-1">Properties</div>
            </div>
            <div className="flex-1 text-center border-r border-white/10 last:border-none">
              <div className="text-3xl md:text-5xl font-black text-white stat-number tracking-tight drop-shadow-md">8,200+</div>
              <div className="text-orange-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-1">Happy Users</div>
            </div>
            <div className="flex-1 text-center border-r border-white/10 last:border-none">
              <div className="text-3xl md:text-5xl font-black text-white stat-number tracking-tight drop-shadow-md">180+</div>
              <div className="text-orange-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-1">Cities</div>
            </div>
            <div className="flex-1 text-center last:border-none">
              <div className="text-3xl md:text-5xl font-black text-white stat-number tracking-tight drop-shadow-md">0%</div>
              <div className="text-orange-500 text-xs md:text-sm font-black uppercase tracking-[0.2em] mt-1">Brokerage</div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}