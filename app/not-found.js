'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-8xl mb-6">\ud83d\udea7</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-8 text-center max-w-md">The page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="flex gap-3">
          <Link href="/" className="btn-primary flex items-center gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Link>
          <Link href="/properties" className="btn-secondary flex items-center gap-2">
            Browse Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
