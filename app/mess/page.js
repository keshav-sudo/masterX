'use client';
import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmptyState from '@/components/EmptyState';
import { messAPI } from '@/lib/api';
import { useLocationStore } from '@/lib/store';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { Star, MapPin, Heart, Bike, ChevronDown, SlidersHorizontal } from 'lucide-react';

function MessCard({ mess }) {
  const [saved, setSaved] = useState(false);
  return (
    <Link href={`/mess/${mess.id}`}>
      <div className="card-hover overflow-hidden group">
        <div className="relative aspect-[16/10] bg-gray-100">
          <img src={mess.photos?.[0] || 'https://images.unsplash.com/photo-1725483990150-61a9fbd746d1?w=400&h=250&fit=crop'}
            alt={mess.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
              mess.foodType === 'Veg' ? 'bg-green-500 text-white' : mess.foodType === 'Non-Veg' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
            }`}>{mess.foodType}</span>
            {mess.delivery && <span className="px-2 py-0.5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center gap-0.5"><Bike className="w-3 h-3" /> Delivery</span>}
          </div>
          <button onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
            className={`absolute top-3 right-3 p-1.5 rounded-full shadow-sm ${saved ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600'}`}>
            <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 text-sm">{mess.name}</h3>
            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full">
              <Star className="w-3 h-3 text-green-500 fill-green-500" />
              <span className="text-xs font-bold text-green-600">{mess.rating || '4.2'}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" /> {mess.area}, {mess.city}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-gray-50">
            <span className="text-sm font-bold text-gray-900">From ₹{mess.pricePerMeal || 50}/meal</span>
            <span className="text-xs text-gray-400">₹{mess.monthlyPrice || 2500}/mo</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

const SAMPLE_MESS = [
  { id: '1', name: 'Maa Ki Rasoi', foodType: 'Veg', area: 'MP Nagar Zone-1', city: 'Bhopal', rating: 4.5, pricePerMeal: 50, monthlyPrice: 2500, delivery: true, photos: ['https://images.unsplash.com/photo-1725483990150-61a9fbd746d1?w=400&h=250&fit=crop'] },
  { id: '2', name: 'Sharma Mess', foodType: 'Both', area: 'Arera Colony', city: 'Bhopal', rating: 4.2, pricePerMeal: 60, monthlyPrice: 3000, delivery: false, photos: ['https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=250&fit=crop'] },
  { id: '3', name: 'South Indian Mess', foodType: 'Veg', area: 'Shahpura', city: 'Bhopal', rating: 4.8, pricePerMeal: 45, monthlyPrice: 2200, delivery: true, photos: ['https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=250&fit=crop'] },
  { id: '4', name: 'Royal Non-Veg', foodType: 'Non-Veg', area: 'New Market', city: 'Bhopal', rating: 4.0, pricePerMeal: 80, monthlyPrice: 4000, delivery: true, photos: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=250&fit=crop'] },
  { id: '5', name: 'Ghar Ka Khana', foodType: 'Veg', area: 'Kolar Road', city: 'Bhopal', rating: 4.6, pricePerMeal: 40, monthlyPrice: 1800, delivery: false, photos: ['https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&h=250&fit=crop'] },
  { id: '6', name: 'Delhi Mess Corner', foodType: 'Both', area: 'TT Nagar', city: 'Bhopal', rating: 4.3, pricePerMeal: 55, monthlyPrice: 2800, delivery: true, photos: ['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=250&fit=crop'] },
];

export default function MessBrowse() {
  const { city } = useLocationStore();
  const [messList, setMessList] = useState(SAMPLE_MESS);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">{messList.length} Mess in {city || 'Bhopal'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Home-style meals near you</p>
          </div>
          <Link href="/mess/register" className="btn-primary text-sm">Register Your Mess</Link>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {['All', 'Veg', 'Non-Veg', 'Delivery', 'Tiffin'].map(f => (
            <button key={f} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-500 whitespace-nowrap">
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {messList.map(m => <MessCard key={m.id} mess={m} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
