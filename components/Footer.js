import Link from 'next/link';
import { CITIES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">PX</span>
              </div>
              <span className="font-bold text-lg text-white">ProjectX</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              India&apos;s first all-in-one platform for rooms, roommates, mess, and cooks. 100% broker-free.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <div className="space-y-2.5">
              <Link href="/properties" className="block text-sm hover:text-orange-400 transition-colors">Find Properties</Link>
              <Link href="/roommate" className="block text-sm hover:text-orange-400 transition-colors">Find Roommate</Link>
              <Link href="/mess" className="block text-sm hover:text-orange-400 transition-colors">Find Mess</Link>
              <Link href="/cook" className="block text-sm hover:text-orange-400 transition-colors">Find Cook</Link>
              <Link href="/properties/create" className="block text-sm hover:text-orange-400 transition-colors">List Your Property</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm hover:text-orange-400 transition-colors">About Us</Link>
              <Link href="/contact" className="block text-sm hover:text-orange-400 transition-colors">Contact</Link>
              <Link href="/help" className="block text-sm hover:text-orange-400 transition-colors">Help Center</Link>
              <Link href="/area-guide" className="block text-sm hover:text-orange-400 transition-colors">Area Guide</Link>
            </div>
          </div>

          {/* Popular Cities */}
          <div>
            <h4 className="font-semibold text-white mb-4">Popular Cities</h4>
            <div className="flex flex-wrap gap-2">
              {CITIES.slice(0, 12).map(city => (
                <span key={city} className="text-xs px-2.5 py-1 bg-gray-800 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">{city}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; 2025 ProjectX. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span className="hover:text-gray-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
