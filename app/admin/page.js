'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, ShieldCheck, Home, Utensils, ChefHat } from 'lucide-react';

export default function AdminPanelPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [tab, setTab] = useState('properties');
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [messListings, setMessListings] = useState([]);
  const [cookListings, setCookListings] = useState([]);
  const [busy, setBusy] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  const loadData = async () => {
    setPageLoading(true);
    try {
      const [dashboardRes, propertiesRes, messRes, cooksRes] = await Promise.all([
        adminAPI.dashboard(),
        adminAPI.getProperties({ status: 'PENDING', page: 1, limit: 25 }),
        adminAPI.getMess({ page: 1, limit: 25 }),
        adminAPI.getCooks({ page: 1, limit: 25 }),
      ]);

      const dashboardData = dashboardRes.data?.stats ? dashboardRes.data : (dashboardRes.data?.data || {});
      const propertyList = propertiesRes.data?.properties || propertiesRes.data?.data || propertiesRes.data?._list || [];
      const messList = messRes.data?.listings || messRes.data?.mess || messRes.data?.data || messRes.data?._list || [];
      const cooksList = cooksRes.data?.cooks || cooksRes.data?.data || cooksRes.data?._list || [];

      setStats(dashboardData.stats || {});
      setProperties(propertyList);
      setMessListings(messList);
      setCookListings(cooksList);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to load admin data');
    }
    setPageLoading(false);
  };

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/admin/login');
      return;
    }
    if (!loading && isAuthenticated && !isAdmin) {
      router.replace('/');
      return;
    }
    if (!loading && isAuthenticated && isAdmin) {
      loadData();
    }
  }, [loading, isAuthenticated, isAdmin, router]);

  const withAction = async (fn, successMessage) => {
    setBusy(true);
    try {
      await fn();
      toast.success(successMessage);
      await loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Action failed');
    }
    setBusy(false);
  };

  if (loading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const tabs = [
    { key: 'properties', label: 'Property Approvals', icon: Home },
    { key: 'mess', label: 'Mess Verification', icon: Utensils },
    { key: 'cooks', label: 'Cook Verification', icon: ChefHat },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-orange-500" /> Admin Approval Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">Approve listings before they go live on the platform.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-panel p-4">
            <p className="text-xs text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.users ?? 0}</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-xs text-gray-500">Properties</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.properties ?? 0}</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-xs text-gray-500">Mess</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.mess ?? 0}</p>
          </div>
          <div className="glass-panel p-4">
            <p className="text-xs text-gray-500">Cooks</p>
            <p className="text-2xl font-bold text-gray-900">{stats?.cooks ?? 0}</p>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap gap-2">
          {tabs.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setTab(item.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  tab === item.key
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white'
                    : 'bg-white border border-orange-100 text-gray-600 hover:bg-orange-50'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </button>
            );
          })}
        </div>

        {pageLoading ? (
          <div className="glass-panel p-10 text-center text-sm text-gray-500">Loading admin data...</div>
        ) : tab === 'properties' ? (
          <div className="space-y-3">
            {properties.length === 0 ? (
              <div className="glass-panel p-10 text-center text-sm text-gray-500">No pending properties right now.</div>
            ) : (
              properties.map((p) => (
                <div key={p.id} className="glass-panel p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{p.area}, {p.city} · ₹{(p.rent || 0).toLocaleString('en-IN')}/month</p>
                    <p className="text-xs text-gray-400 mt-1">Owner: {p.owner?.name || 'Unknown'} ({p.owner?.phone || 'N/A'})</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => withAction(() => adminAPI.approveProperty(p.id), 'Property approved')}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => withAction(() => adminAPI.rejectProperty(p.id), 'Property rejected')}
                      disabled={busy}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : tab === 'mess' ? (
          <div className="space-y-3">
            {messListings.length === 0 ? (
              <div className="glass-panel p-10 text-center text-sm text-gray-500">No mess listings found.</div>
            ) : (
              messListings.map((m) => (
                <div key={m.id} className="glass-panel p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{m.area}, {m.city}</p>
                    <p className="text-xs text-gray-400 mt-1">Owner: {m.owner?.name || 'Unknown'}</p>
                  </div>
                  <button
                    onClick={() => withAction(() => adminAPI.verifyMess(m.id), 'Mess verified')}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {cookListings.length === 0 ? (
              <div className="glass-panel p-10 text-center text-sm text-gray-500">No cook listings found.</div>
            ) : (
              cookListings.map((c) => (
                <div key={c.id} className="glass-panel p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{c.fullName || c.name || 'Cook'}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{c.area}, {c.city}</p>
                    <p className="text-xs text-gray-400 mt-1">Experience: {c.experience || 0} years</p>
                  </div>
                  <button
                    onClick={() => withAction(() => adminAPI.verifyCook(c.id), 'Cook verified')}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Verify
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
