'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';
import { useLocationStore } from '@/lib/store';
import Link from 'next/link';
import { Star, MapPin, Heart, Clock, ChefHat } from 'lucide-react';

function CookCard({ cook }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link href={`/cook/${cook.id}`}>
      <div className="card-hover p-5 group">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0 ring-2 ring-orange-200">
            <img src={cook.photo || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop&crop=face'}
              alt={cook.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-gray-900 text-sm">{cook.name}</h3>
              <div className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded-full">
                <Star className="w-3 h-3 text-green-500 fill-green-500" />
                <span className="text-[10px] font-bold text-green-600">{cook.rating}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                cook.speciality === 'Veg' ? 'bg-green-100 text-green-600' : cook.speciality === 'Non-Veg' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
              }`}>{cook.speciality}</span>
              <span className="text-xs text-gray-400 flex items-center gap-0.5"><Clock className="w-3 h-3" /> {cook.experience}yr exp</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {cook.cuisines.slice(0, 3).map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 bg-gray-50 rounded-full text-gray-500">{c}</span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
              <span className="text-sm font-bold text-gray-900">From ₹{cook.pricePerVisit}/visit</span>
              <span className="text-xs text-gray-400">{cook.area}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const SAMPLE_COOKS = [
  { id: '1', name: 'Sunita Devi', speciality: 'Veg', cuisines: ['North Indian', 'Rajasthani', 'Gujarati'], experience: 12, rating: 4.8, pricePerVisit: 250, priceMonthly: 5000, area: 'MP Nagar', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1556909114-44e3e70034e2?w=100&h=100&fit=crop&crop=face' },
  { id: '2', name: 'Ramesh Kumar', speciality: 'Both', cuisines: ['North Indian', 'Chinese', 'Continental'], experience: 8, rating: 4.5, pricePerVisit: 350, priceMonthly: 7000, area: 'Arera Colony', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&h=100&fit=crop&crop=face' },
  { id: '3', name: 'Kavita Sharma', speciality: 'Veg', cuisines: ['South Indian', 'North Indian'], experience: 15, rating: 4.9, pricePerVisit: 200, priceMonthly: 4000, area: 'Shahpura', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=100&h=100&fit=crop&crop=face' },
  { id: '4', name: 'Mohammad Ali', speciality: 'Non-Veg', cuisines: ['Mughlai', 'North Indian', 'Bengali'], experience: 20, rating: 4.7, pricePerVisit: 400, priceMonthly: 8000, area: 'New Market', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: '5', name: 'Geeta Pandey', speciality: 'Veg', cuisines: ['North Indian', 'Maharashtrian'], experience: 6, rating: 4.3, pricePerVisit: 200, priceMonthly: 3500, area: 'Kolar Road', city: 'Bhopal', photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face' },
];

export default function CookBrowse() {
  const { city } = useLocationStore();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{SAMPLE_COOKS.length} Cooks in {city || 'Bhopal'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Hire personal cooks for daily or monthly service</p>
          </div>
          <Link href="/cook/register" className="btn-primary text-sm">Register as Cook</Link>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {['All', 'Veg', 'Non-Veg', 'North Indian', 'South Indian', 'Chinese'].map(f => (
            <button key={f} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-500 whitespace-nowrap">{f}</button>
          ))}
        </div>
        <div className="space-y-3">
          {SAMPLE_COOKS.map(c => <CookCard key={c.id} cook={c} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
