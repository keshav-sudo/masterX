'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { COMING_SOON_SERVICES, POPULAR_AREAS, CITIES } from '@/lib/constants';
import { comingSoonAPI } from '@/lib/api';
import { useLocationStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Search, MapPin, ArrowRight, Home, Users, UtensilsCrossed, ChefHat, Star, Zap, Shield, Phone, ChevronRight, Sparkles } from 'lucide-react';

function AnimatedCounter({ end, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 2000;
        const step = end / (duration / 16);
        const interval = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(interval); }
          else setCount(Math.floor(start));
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-3xl md:text-4xl font-extrabold text-white">
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-orange-100 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

function NotifyMeInline({ serviceId }) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNotify = async () => {
    if (phone.length < 10) { toast.error('Enter valid phone number'); return; }
    setLoading(true);
    try {
      await comingSoonAPI.notify(serviceId, { phone: '+91' + phone });
      toast.success('You will be notified when this launches!');
      setOpen(false); setPhone('');
    } catch { toast.error('Something went wrong'); }
    setLoading(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} className="btn-outline text-xs !px-3 !py-1.5 !rounded-lg">
      Notify Me
    </button>
  );

  return (
    <div className="flex gap-1.5 mt-2">
      <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
        placeholder="Phone number" className="input-field !py-1.5 !text-xs flex-1" />
      <button onClick={handleNotify} disabled={loading}
        className="btn-primary text-xs !px-3 !py-1.5 !rounded-lg whitespace-nowrap">
        {loading ? '...' : 'Notify'}
      </button>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { city, setLocation } = useLocationStore();
  const [searchCity, setSearchCity] = useState('');

  const services = [
    { icon: Home, title: 'Properties', desc: 'Find rooms, flats, PGs & hostels. 100% broker-free.', color: 'orange', href: '/properties', live: true },
    { icon: Users, title: 'Roommate', desc: 'Find compatible roommates with smart matching.', color: 'blue', href: '/roommate', live: true },
    { icon: UtensilsCrossed, title: 'Mess & Tiffin', desc: 'Home-style meals, tiffin delivery & mess services.', color: 'green', href: '/mess', live: true },
    { icon: ChefHat, title: 'Cook', desc: 'Hire personal cooks for daily or monthly service.', color: 'purple', href: '/cook', live: true },
  ];

  const colorMap = {
    orange: 'bg-orange-50 text-orange-500 border-orange-100',
    blue: 'bg-blue-50 text-blue-500 border-blue-100',
    green: 'bg-green-50 text-green-500 border-green-100',
    purple: 'bg-purple-50 text-purple-500 border-purple-100',
  };

  const testimonials = [
    { name: 'Rahul Sharma', city: 'Bhopal', profession: 'Software Engineer', text: 'Found my 2BHK in MP Nagar within 2 days! No brokerage, direct owner contact. Best experience.', rating: 5 },
    { name: 'Priya Patel', city: 'Indore', profession: 'MBA Student', text: 'The roommate matching is amazing! Found a perfect roommate with 92% compatibility score.', rating: 5 },
    { name: 'Amit Kumar', city: 'Patna', profession: 'Working Professional', text: 'Switched from restaurant food to a home-style mess. Saving ₹4000/month with better food!', rating: 4 },
  ];

  const handleSearch = () => {
    if (searchCity) {
      setLocation({ city: searchCity });
      router.push('/properties');
    } else {
      router.push('/properties');
    }
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, city: 'Bhopal' });
          toast.success('Location detected!');
          router.push('/properties');
        },
        () => toast.error('Please allow location access')
      );
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> India's First All-in-One Platform
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Find Room, Mess & Cook
              <br />Near You — <span className="text-yellow-200">Instantly</span>
            </h1>
            <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-xl mx-auto">
              Zero brokerage. Direct owner contact. Rooms, roommates, mess, cooks — everything in one app.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto">
              <div className="bg-white rounded-2xl p-2 flex items-center shadow-xl shadow-orange-600/20">
                <div className="flex items-center flex-1 gap-2 px-3">
                  <MapPin className="w-5 h-5 text-orange-400 shrink-0" />
                  <select value={searchCity} onChange={e => setSearchCity(e.target.value)}
                    className="w-full py-2.5 text-sm text-gray-700 bg-transparent outline-none appearance-none cursor-pointer">
                    <option value="">Select your city...</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <button onClick={handleSearch}
                  className="btn-primary flex items-center gap-2 shrink-0 !rounded-xl">
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
              <button onClick={detectLocation}
                className="mt-3 text-sm text-white/80 hover:text-white flex items-center gap-1 mx-auto transition-colors">
                <MapPin className="w-3.5 h-3.5" /> Search Near Me
              </button>
            </div>

            {/* Popular Cities */}
            <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
              <span className="text-orange-100 text-xs">Popular:</span>
              {POPULAR_AREAS.map(a => (
                <button key={a.name}
                  onClick={() => { setLocation({ city: a.city, area: a.name }); router.push('/properties'); }}
                  className="px-3 py-1 bg-white/15 backdrop-blur-sm text-white text-xs rounded-full hover:bg-white/25 transition-colors">
                  {a.name} {a.city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-orange-600">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <AnimatedCounter end={12400} label="Properties Listed" suffix="+" />
          <AnimatedCounter end={8200} label="Happy Users" suffix="+" />
          <AnimatedCounter end={340} label="Cities" suffix="+" />
          <AnimatedCounter end={98} label="Broker Free" suffix="%" />
        </div>
      </section>

      {/* Live Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Our Live Services</h2>
          <p className="text-gray-500 max-w-lg mx-auto">Everything you need to settle in a new city, all in one platform.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link key={s.title} href={s.href}>
                <div className={`card-hover p-6 border-2 ${colorMap[s.color]} group cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorMap[s.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">LIVE</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{s.desc}</p>
                  <span className="text-sm font-semibold text-orange-500 flex items-center gap-1 group-hover:gap-2 transition-all">
                    Browse <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to find what you need</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: MapPin, title: 'Allow Location', desc: 'Enable GPS or select your city to see nearby listings.' },
              { step: '02', icon: Search, title: 'Browse & Filter', desc: 'Search rooms, mess, cooks with smart filters and matching.' },
              { step: '03', icon: Phone, title: 'Contact Directly', desc: 'Call or chat with owners directly. Zero brokerage, always.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="relative w-16 h-16 mx-auto mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-orange-500" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Coming Soon</h2>
          <p className="text-gray-500">More services launching soon. Get notified!</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {COMING_SOON_SERVICES.map(s => (
            <div key={s.id} className="card-hover p-5 text-center">
              <div className="text-4xl mb-3">{s.icon}</div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">{s.name}</h4>
              <p className="text-xs text-gray-400 mb-3 line-clamp-2">{s.description}</p>
              <NotifyMeInline serviceId={s.id} />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className={`w-4 h-4 ${j < t.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-200'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-sm">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.profession}, {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App CTA */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-400 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-4">📱</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Android App Coming Soon</h2>
          <p className="text-orange-100 mb-6 max-w-md mx-auto">Get instant notifications, faster browsing, and exclusive features on our mobile app.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-white text-orange-500 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">
            Register Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
