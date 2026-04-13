'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useLocationStore } from '@/lib/store';
import Link from 'next/link';
import { Heart, MapPin, Briefcase, Moon, Sun, Cigarette, Coffee, Sparkles } from 'lucide-react';

function CompatibilityRing({ score }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#22c55e' : score >= 60 ? '#eab308' : '#f97316';
  return (
    <div className="relative w-24 h-24">
      <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="6" />
        <circle cx="50" cy="50" r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-extrabold" style={{ color }}>{score}%</span>
      </div>
    </div>
  );
}

function RoommateCard({ roommate }) {
  return (
    <Link href={`/roommate/${roommate.id}`}>
      <div className="card-hover p-5 text-center group">
        <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-orange-200">
          <img src={roommate.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'}
            alt={roommate.name} className="w-full h-full object-cover" />
        </div>
        <h3 className="font-bold text-gray-900 text-sm">{roommate.name}, {roommate.age}</h3>
        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded-full mt-1">{roommate.profession}</span>
        <div className="flex justify-center my-3">
          <CompatibilityRing score={roommate.compatibility} />
        </div>
        <div className="flex justify-center gap-2 mb-3">
          <span className="text-lg" title={roommate.food === 'Veg' ? 'Vegetarian' : 'Non-Veg'}>{roommate.food === 'Veg' ? '\ud83e\udd57' : '\ud83c\udf56'}</span>
          <span className="text-lg" title={roommate.sleep}>{roommate.sleep === 'Early Bird' ? '\ud83c\udf05' : '\ud83c\udf19'}</span>
          <span className="text-lg" title={roommate.smoking ? 'Smoker' : 'Non-smoker'}>{roommate.smoking ? '\ud83d\udeac' : '\ud83d\udeab'}</span>
        </div>
        <p className="text-xs text-gray-400 mb-2">₹{roommate.budgetMin?.toLocaleString()}-{roommate.budgetMax?.toLocaleString()}/mo</p>
        {roommate.hasRoom && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">
            Has Room
          </span>
        )}
      </div>
    </Link>
  );
}

const SAMPLE_ROOMMATES = [
  { id: '1', name: 'Arjun Verma', age: 24, profession: 'Software Engineer', food: 'Both', sleep: 'Night Owl', smoking: false, budgetMin: 5000, budgetMax: 8000, compatibility: 92, hasRoom: true, photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face' },
  { id: '2', name: 'Sneha Gupta', age: 22, profession: 'Student', food: 'Veg', sleep: 'Early Bird', smoking: false, budgetMin: 3000, budgetMax: 5000, compatibility: 85, hasRoom: false, photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
  { id: '3', name: 'Vikram Singh', age: 28, profession: 'Working Professional', food: 'Non-Veg', sleep: 'Night Owl', smoking: true, budgetMin: 7000, budgetMax: 12000, compatibility: 68, hasRoom: true, photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { id: '4', name: 'Anita Patel', age: 25, profession: 'Freelancer', food: 'Veg', sleep: 'Early Bird', smoking: false, budgetMin: 4000, budgetMax: 7000, compatibility: 78, hasRoom: false, photo: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop&crop=face' },
  { id: '5', name: 'Rahul Joshi', age: 23, profession: 'Student', food: 'Both', sleep: 'Night Owl', smoking: false, budgetMin: 3500, budgetMax: 6000, compatibility: 88, hasRoom: false, photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face' },
  { id: '6', name: 'Kavya Sharma', age: 26, profession: 'Working Professional', food: 'Veg', sleep: 'Early Bird', smoking: false, budgetMin: 5000, budgetMax: 9000, compatibility: 95, hasRoom: true, photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face' },
];

export default function RoommateBrowse() {
  const { city } = useLocationStore();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Find Roommates in {city || 'Bhopal'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">Smart matching based on lifestyle & preferences</p>
          </div>
          <Link href="/roommate/create-profile" className="btn-primary text-sm">Create Profile</Link>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {['All', 'Male', 'Female', 'Has Room', 'Student', 'Working'].map(f => (
            <button key={f} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 hover:bg-orange-50 hover:text-orange-500 whitespace-nowrap">{f}</button>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {SAMPLE_ROOMMATES.map(r => <RoommateCard key={r.id} roommate={r} />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
