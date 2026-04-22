'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { cookAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  ArrowLeft, Heart, Share2, MapPin, Star, Phone as PhoneIcon,
  Clock, ChefHat, Utensils, BadgeCheck
} from 'lucide-react';

export default function CookDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [cook, setCook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    cookAPI.getById(id)
      .then(({ data }) => {
        const c = data.cook || data;
        setCook(c);
        setSaved(c?.isSaved || data?.isSaved || false);
      })
      .catch(() => toast.error('Cook not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    try {
      const { data } = await cookAPI.save(id);
      setSaved(data.saved);
      toast.success(data.saved ? 'Saved!' : 'Removed');
    } catch { toast.error('Please login'); }
  };

  const handleShare = () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) navigator.share({ title: cook?.fullName || cook?.name, url });
    else { navigator.clipboard.writeText(url); toast.success('Link copied!'); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3" />
          <div className="bg-white rounded-2xl p-8 flex gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse shrink-0" />
            <div className="flex-1 space-y-3">
              <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
              <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cook) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">👨‍🍳</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Cook Not Found</h2>
          <button onClick={() => router.push('/cook')} className="btn-primary mt-4">Browse Cooks</button>
        </div>
      </div>
    );
  }

  const name = cook.fullName || cook.name || 'Cook';
  const cuisines = cook.cuisineTypes || cook.cuisines || [];
  const serviceTypes = cook.serviceTypes || [];
  const serviceAreas = cook.serviceAreas || [];
  const slots = cook.availableSlots || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
          <div className="flex items-start gap-5">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-orange-100 shrink-0">
              <img src={cook.photo || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&h=200&fit=crop&crop=face'}
                alt={name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-extrabold text-gray-900">{name}</h1>
                {cook.verified && <BadgeCheck className="w-5 h-5 text-green-500" />}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 rounded-full">
                  <Star className="w-3.5 h-3.5 text-green-500 fill-green-500" />
                  <span className="text-sm font-bold text-green-600">{cook.rating || cook.avgRating || '4.0'}</span>
                </div>
                <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                  cook.speciality === 'VEG' ? 'bg-green-100 text-green-600' :
                  cook.speciality === 'NON_VEG' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                }`}>{cook.speciality?.replace('_', ' ') || 'Both'}</span>
                <span className="text-xs text-gray-400 flex items-center gap-0.5">
                  <Clock className="w-3 h-3" /> {cook.experience || 0}yr exp
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> {cook.city} {cook.pincode ? `- ${cook.pincode}` : ''}
              </p>
              {cook.gender && <p className="text-xs text-gray-400 mt-1">Gender: {cook.gender}</p>}
            </div>
          </div>

          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <button onClick={handleSave}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                saved ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <Heart className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save'}
            </button>
            <button onClick={handleShare} className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-200">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Cuisine Types */}
        {cuisines.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Cuisine Types</h3>
            <div className="flex flex-wrap gap-2">
              {cuisines.map(c => (
                <span key={c} className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-xl text-sm font-medium">
                  {c.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Service Types */}
        {serviceTypes.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Services Offered</h3>
            <div className="flex flex-wrap gap-2">
              {serviceTypes.map(s => (
                <span key={s} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium">
                  {s.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Pricing */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
          <h3 className="font-bold text-gray-900 mb-3">Pricing</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cook.pricePerVisit && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl font-extrabold text-gray-900">₹{cook.pricePerVisit}</p>
                <p className="text-xs text-gray-400 mt-1">Per Visit</p>
              </div>
            )}
            {cook.monthlyOneMeal && (
              <div className="bg-orange-50 rounded-xl p-4 text-center border border-orange-200">
                <p className="text-2xl font-extrabold text-orange-600">₹{cook.monthlyOneMeal}</p>
                <p className="text-xs text-gray-400 mt-1">Monthly (1 Meal)</p>
              </div>
            )}
            {cook.monthlyTwoMeals && (
              <div className="bg-orange-50 rounded-xl p-4 text-center border-2 border-orange-300">
                <p className="text-xs text-orange-500 font-bold mb-1">BEST VALUE</p>
                <p className="text-2xl font-extrabold text-orange-600">₹{cook.monthlyTwoMeals}</p>
                <p className="text-xs text-gray-400 mt-1">Monthly (2 Meals)</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Slots */}
        {Object.keys(slots).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Available Slots</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(slots).map(([slot, time]) => (
                <div key={slot} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                  <Clock className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{slot}</p>
                    <p className="text-xs text-gray-400">{time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Service Areas */}
        {serviceAreas.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Service Areas</h3>
            <div className="flex flex-wrap gap-2">
              {serviceAreas.map(a => (
                <span key={a} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-sm flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-orange-400" /> {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
