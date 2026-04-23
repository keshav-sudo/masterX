'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Star, Users, Home, MapPin, Shield, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 to-amber-400 py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">About MasterX</h1>
          <p className="text-lg text-orange-100 max-w-xl mx-auto">
            India&apos;s first all-in-one platform to find rooms, roommates, mess, and cooks. Zero brokerage, always.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4 text-center">Our Mission</h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto leading-relaxed">
          Moving to a new city shouldn&apos;t be stressful. We&apos;re building the ecosystem where finding a room,
          a compatible roommate, home-style food, or a personal cook is just a tap away. No brokers, no hidden charges,
          just direct connections.
        </p>
      </section>

      {/* Stats */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '12,400+', label: 'Properties Listed', icon: Home },
            { value: '8,200+', label: 'Happy Users', icon: Users },
            { value: '340+', label: 'Cities Covered', icon: MapPin },
            { value: '98%', label: 'Broker Free', icon: Shield },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label}>
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-6 h-6 text-orange-500" />
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-400">{s.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Properties', desc: 'Find rooms, flats, PGs & hostels across 340+ cities. 100% broker-free with direct owner contact.', emoji: '\ud83c\udfe0' },
            { title: 'Roommate Matching', desc: 'Smart compatibility matching to find the perfect roommate based on lifestyle and preferences.', emoji: '\ud83d\udc65' },
            { title: 'Mess & Tiffin', desc: 'Discover home-style meals, tiffin services, and mess options near you.', emoji: '\ud83c\udf5b' },
            { title: 'Personal Cooks', desc: 'Hire personal cooks for daily, weekly or monthly service. Vetted and reviewed.', emoji: '\ud83d\udc68\u200d\ud83c\udf73' },
          ].map(s => (
            <div key={s.title} className="card-hover p-6 hover:-translate-y-0.5 transition-all duration-300">
              <div className="text-4xl mb-3">{s.emoji}</div>
              <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
              <p className="text-sm text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Aditya Sharma', role: 'Founder & CEO', city: 'Bhopal' },
              { name: 'Priya Patel', role: 'Co-founder & CTO', city: 'Indore' },
              { name: 'Vikram Joshi', role: 'Co-founder & COO', city: 'Patna' },
            ].map(t => (
              <div key={t.name} className="card-hover p-6 hover:-translate-y-0.5 transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_8px_20px_-10px_rgba(249,115,22,0.7)]">
                  <span className="text-white font-bold text-xl">{t.name.charAt(0)}</span>
                </div>
                <h4 className="font-bold text-gray-900">{t.name}</h4>
                <p className="text-sm text-orange-500 font-semibold">{t.role}</p>
                <p className="text-xs text-gray-400 mt-1">{t.city}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
