'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLocationStore, useLangStore, useNotificationStore } from '@/lib/store';
import { Menu, X, Bell, ChevronDown, MapPin, Home, Users, UtensilsCrossed, ChefHat, LogOut, User, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { city } = useLocationStore();
  const { lang, setLang } = useLangStore();
  const { unreadCount } = useNotificationStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { href: '/properties', label: 'Properties', icon: Home },
    { href: '/roommate', label: 'Roommate', icon: Users },
    { href: '/mess', label: 'Mess', icon: UtensilsCrossed },
    { href: '/cook', label: 'Cook', icon: ChefHat },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">PX</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">ProjectX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* City Chip */}
            <button className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-orange-500" />
              <span className="max-w-[80px] truncate">{city}</span>
            </button>

            {/* Language Toggle */}
            <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1.5 text-xs font-semibold bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
              {lang === 'en' ? 'हिं' : 'EN'}
            </button>

            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <Link href="/notifications" className="relative p-2 rounded-lg hover:bg-gray-50">
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 hidden sm:block" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-50">
                        <p className="font-semibold text-sm text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-400">{user?.phone || user?.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <Link href="/properties/my-listings" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                        <Home className="w-4 h-4" /> My Listings
                      </Link>
                      <Link href="/settings" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <hr className="my-1 border-gray-50" />
                      <button onClick={() => { setProfileOpen(false); logout(); }}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm !px-4 !py-2">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-gray-50 pt-3">
            <div className="flex items-center gap-2 px-2 py-2 mb-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-gray-600">{city}</span>
            </div>
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-2 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 rounded-lg">
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
