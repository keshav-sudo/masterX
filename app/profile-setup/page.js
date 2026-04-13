'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { userAPI, locationAPI } from '@/lib/api';
import { CITIES } from '@/lib/constants';
import toast from 'react-hot-toast';
import { MapPin, Check, ArrowRight, Locate } from 'lucide-react';

export default function ProfileSetup() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [areas, setAreas] = useState([]);

  const [form, setForm] = useState({
    name: user?.name || '',
    city: user?.city || 'Bhopal',
    area: user?.area || '',
    interests: user?.interests || [],
  });

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (form.city) {
      locationAPI.getAreas(form.city).then(res => setAreas(res.data.areas || [])).catch(() => {});
    }
  }, [form.city]);

  const interestOptions = [
    { id: 'FIND_ROOM', label: 'Find Room', icon: '\ud83c\udfe0' },
    { id: 'LIST_PROPERTY', label: 'List Property', icon: '\ud83d\udcdd' },
    { id: 'FIND_ROOMMATE', label: 'Find Roommate', icon: '\ud83d\udc65' },
    { id: 'FIND_MESS', label: 'Find Mess', icon: '\ud83c\udf5b' },
    { id: 'FIND_COOK', label: 'Find Cook', icon: '\ud83d\udc68\u200d\ud83c\udf73' },
  ];

  const toggleInterest = (id) => {
    setForm(prev => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter(i => i !== id)
        : [...prev.interests, id]
    }));
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { data } = await locationAPI.detect({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            update('city', data.city);
            update('area', data.area);
            toast.success('Location detected!');
          } catch { toast.error('Could not detect location'); }
        },
        () => toast.error('Please allow location access')
      );
    }
  };

  const handleSubmit = async () => {
    if (!form.city) { toast.error('Select your city'); return; }
    setLoading(true);
    try {
      const { data } = await userAPI.profileSetup(form);
      updateUser(data.user);
      toast.success('Profile setup complete!');
      router.push('/properties');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">\ud83d\udc4b</div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome to ProjectX!</h1>
            <p className="text-sm text-gray-500 mt-1">Let&apos;s set up your profile</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Your Name</label>
              <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                className="input-field" placeholder="Full name" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">City *</label>
                <button onClick={detectLocation}
                  className="text-xs text-orange-500 flex items-center gap-1 hover:underline">
                  <Locate className="w-3 h-3" /> Detect GPS
                </button>
              </div>
              <select value={form.city} onChange={e => update('city', e.target.value)} className="input-field">
                <option value="">Select city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Area</label>
              <select value={form.area} onChange={e => update('area', e.target.value)} className="input-field">
                <option value="">Select area</option>
                {areas.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">I want to...</label>
              <div className="grid grid-cols-2 gap-2">
                {interestOptions.map(opt => (
                  <button key={opt.id} onClick={() => toggleInterest(opt.id)}
                    className={`p-3 rounded-xl border-2 text-left transition-colors ${
                      form.interests.includes(opt.id) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                    <div className="text-2xl mb-1">{opt.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{opt.label}</div>
                    {form.interests.includes(opt.id) && (
                      <Check className="w-4 h-4 text-orange-500 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><span>Complete Setup</span> <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
