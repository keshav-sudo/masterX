'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import EmptyState from '@/components/EmptyState';
import { propertyAPI, locationAPI } from '@/lib/api';
import { useLocationStore } from '@/lib/store';
import { PROPERTY_TYPES, FURNISHING_OPTIONS, AVAILABLE_FOR } from '@/lib/constants';
import { Search, SlidersHorizontal, X, Plus, Bell, LayoutGrid, List, MapPin, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PropertiesBrowse() {
  const router = useRouter();
  const { city } = useLocationStore();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [areas, setAreas] = useState([]);

  const [filters, setFilters] = useState({
    city: city || 'Bhopal',
    type: '', area: '', furnishing: '', availableFor: '',
    budgetMin: '', budgetMax: '', sort: 'newest',
    verified: false, negotiable: false,
  });

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  // Fetch areas when city changes
  useEffect(() => {
    if (filters.city) {
      locationAPI.getAreas(filters.city).then(res => setAreas(res.data.areas || [])).catch(() => {});
    }
  }, [filters.city]);

  const fetchProperties = useCallback(async (pageNum = 1, append = false) => {
    setLoading(true);
    try {
      const params = { page: pageNum, limit: 12, sort: filters.sort };
      if (filters.city) params.city = filters.city;
      if (filters.type) params.type = filters.type;
      if (filters.area) params.area = filters.area;
      if (filters.furnishing) params.furnishing = filters.furnishing;
      if (filters.availableFor) params.availableFor = filters.availableFor;
      if (filters.budgetMin) params.budgetMin = filters.budgetMin;
      if (filters.budgetMax) params.budgetMax = filters.budgetMax;
      if (filters.verified) params.verified = 'true';
      if (filters.negotiable) params.negotiable = 'true';

      const { data } = await propertyAPI.browse(params);
      setProperties(prev => append ? [...prev, ...(data.properties || [])] : (data.properties || []));
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch { toast.error('Failed to load properties'); }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    setPage(1);
    fetchProperties(1);
  }, [fetchProperties]);

  const loadMore = () => {
    if (page < totalPages) {
      const next = page + 1;
      setPage(next);
      fetchProperties(next, true);
    }
  };

  const quickTypes = ['1BHK', '2BHK', 'PG', '1RK', 'Hostel', 'Studio'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Filter Bar */}
      <div className="sticky top-16 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            {/* City Selector */}
            <select value={filters.city} onChange={e => updateFilter('city', e.target.value)}
              className="text-sm font-medium bg-orange-50 text-orange-600 border border-orange-200 rounded-full px-3 py-1.5 outline-none cursor-pointer">
              {['Bhopal', 'Indore', 'Patna', 'Jaipur', 'Kota', 'Lucknow', 'Noida', 'Delhi/NCR', 'Pune', 'Bangalore', 'Mumbai', 'Hyderabad'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Quick Type Chips */}
            {quickTypes.map(t => (
              <button key={t} onClick={() => updateFilter('type', filters.type === t ? '' : t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full whitespace-nowrap transition-colors ${
                  filters.type === t ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {t}
              </button>
            ))}

            {/* Sort */}
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
              className="text-xs bg-gray-100 rounded-full px-3 py-1.5 outline-none cursor-pointer ml-auto">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-full p-0.5 hidden sm:flex">
              <button onClick={() => setView('grid')}
                className={`p-1.5 rounded-full ${view === 'grid' ? 'bg-white shadow-sm' : ''}`}>
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button onClick={() => setView('list')}
                className={`p-1.5 rounded-full ${view === 'list' ? 'bg-white shadow-sm' : ''}`}>
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Filters Button */}
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium hover:bg-gray-200">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Filters
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold mb-1 block">Budget Min</label>
                <input type="number" value={filters.budgetMin} onChange={e => updateFilter('budgetMin', e.target.value)}
                  placeholder="₹ Min" className="input-field !py-1.5 !text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold mb-1 block">Budget Max</label>
                <input type="number" value={filters.budgetMax} onChange={e => updateFilter('budgetMax', e.target.value)}
                  placeholder="₹ Max" className="input-field !py-1.5 !text-xs" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold mb-1 block">Area</label>
                <select value={filters.area} onChange={e => updateFilter('area', e.target.value)}
                  className="input-field !py-1.5 !text-xs">
                  <option value="">All Areas</option>
                  {areas.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold mb-1 block">Furnishing</label>
                <select value={filters.furnishing} onChange={e => updateFilter('furnishing', e.target.value)}
                  className="input-field !py-1.5 !text-xs">
                  <option value="">Any</option>
                  {FURNISHING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase font-semibold mb-1 block">Available For</label>
                <select value={filters.availableFor} onChange={e => updateFilter('availableFor', e.target.value)}
                  className="input-field !py-1.5 !text-xs">
                  <option value="">Anyone</option>
                  {AVAILABLE_FOR.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="flex items-end gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={filters.verified} onChange={e => updateFilter('verified', e.target.checked)}
                    className="rounded text-orange-500" />
                  <span className="text-xs">Verified Only</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={filters.negotiable} onChange={e => updateFilter('negotiable', e.target.checked)}
                    className="rounded text-orange-500" />
                  <span className="text-xs">Negotiable</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {total} {filters.type || 'listings'} in {filters.city}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">Browse broker-free properties</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/properties/create')}
              className="btn-primary text-sm flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> List Property
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
        {loading && properties.length === 0 ? (
          <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden">
                <div className="aspect-[16/10] bg-gray-200 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-gray-200 animate-pulse rounded-full w-1/2" />
                  <div className="h-4 bg-gray-200 animate-pulse rounded-full w-3/4" />
                  <div className="h-3 bg-gray-200 animate-pulse rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <EmptyState
            icon="\ud83c\udfe0"
            title={`No listings in ${filters.city}`}
            description={`We're growing in ${filters.city}! Be the first to list here.`}
            ctaLabel="List Your Property"
            ctaHref="/properties/create"
          />
        ) : (
          <>
            <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 max-w-3xl'}`}>
              {properties.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
            {page < totalPages && (
              <div className="text-center mt-8">
                <button onClick={loadMore} disabled={loading}
                  className="btn-secondary inline-flex items-center gap-2">
                  {loading ? 'Loading...' : 'Load More'}
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
