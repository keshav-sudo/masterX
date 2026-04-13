'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { userAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Phone, Mail, MapPin, Edit3, Save, Camera } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await userAPI.updateMe(form);
      updateUser(data.user);
      toast.success('Profile updated!');
      setEditing(false);
    } catch { toast.error('Failed to update profile'); }
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-400 p-8 text-center">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-3xl font-extrabold text-white">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <Camera className="w-3.5 h-3.5 text-gray-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-white mt-3">{user?.name || 'User'}</h2>
              <p className="text-orange-100 text-sm">{user?.city || 'Set your city'} {user?.area ? `\u00b7 ${user.area}` : ''}</p>
            </div>

            {/* Info */}
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Profile Info</h3>
                <button onClick={() => editing ? handleSave() : setEditing(true)}
                  className="flex items-center gap-1.5 text-sm text-orange-500 font-medium">
                  {editing ? (loading ? '...' : <><Save className="w-4 h-4" /> Save</>) : <><Edit3 className="w-4 h-4" /> Edit</>}
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <User className="w-5 h-5 text-gray-400" />
                  {editing ? (
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="flex-1 bg-transparent outline-none text-sm" />
                  ) : (
                    <span className="text-sm text-gray-700">{user?.name}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user?.phone}</span>
                  <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">Verified</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {editing ? (
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="flex-1 bg-transparent outline-none text-sm" placeholder="Add email" />
                  ) : (
                    <span className="text-sm text-gray-700">{user?.email || 'Not set'}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{user?.city || 'Not set'}{user?.area ? `, ${user.area}` : ''}</span>
                </div>
              </div>

              {/* Interests */}
              {user?.interests?.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-2">Interests</p>
                  <div className="flex flex-wrap gap-1.5">
                    {user.interests.map(i => (
                      <span key={i} className="px-3 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">{i.replace(/_/g, ' ')}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
