import Link from 'next/link';
import { CITIES } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.22),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.16),transparent_40%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 ring-1 ring-orange-300/40 shadow-[0_10px_22px_-14px_rgba(249,115,22,0.9)]">
                <span className="text-sm font-extrabold text-white">MX</span>
              </div>
              <span className="text-lg font-extrabold text-white">Master<span className="text-orange-400">X</span></span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300/80">
              India&apos;s first all-in-one platform for rooms, roommates, mess, and cooks. 100% broker-free.
            </p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm transition-colors hover:bg-orange-500">𝕏</a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm transition-colors hover:bg-orange-500">in</a>
              <a href="#" className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/10 text-sm transition-colors hover:bg-orange-500">IG</a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Services</h4>
            <div className="space-y-2.5">
              <Link href="/properties" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Find Properties</Link>
              <Link href="/roommate" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Find Roommate</Link>
              <Link href="/mess" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Find Mess</Link>
              <Link href="/cook" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Find Cook</Link>
              <Link href="/properties/create" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">List Your Property</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Company</h4>
            <div className="space-y-2.5">
              <Link href="/about" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">About Us</Link>
              <Link href="/contact" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Contact</Link>
              <Link href="/help" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Help Center</Link>
              <Link href="/area-guide" className="block text-sm text-slate-300/80 transition-colors hover:text-orange-300">Area Guide</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Popular Cities</h4>
            <div className="flex flex-wrap gap-2">
              {CITIES.slice(0, 12).map((city) => (
                <Link
                  key={city}
                  href={`/properties?city=${encodeURIComponent(city)}`}
                  className="cursor-pointer rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs transition-colors hover:bg-orange-500 hover:text-white"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} MasterX. All rights reserved.</p>
          <div className="flex gap-4 text-sm text-slate-400">
            <Link href="/privacy" className="transition-colors hover:text-orange-300">Privacy Policy</Link>
            <Link href="/terms" className="transition-colors hover:text-orange-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
