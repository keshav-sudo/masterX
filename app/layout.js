import './globals.css'
import { Toaster } from 'react-hot-toast'
import ReduxProvider from '@/lib/redux/provider'
import { AuthProvider } from '@/context/AuthContext'

export const metadata = {
  title: 'MasterX — Find Room, Mess & Cook Near You',
  description: 'India\'s #1 all-in-one platform for rooms, roommates, mess, and cooks. 100% broker-free. Zero brokerage, direct owner contact.',
  keywords: 'rooms, roommate, PG, hostel, mess, tiffin, cook, bhopal, indore, broker-free, rental',
  openGraph: {
    title: 'MasterX — Find Room, Mess & Cook Near You',
    description: 'India\'s first all-in-one platform for rooms, roommates, mess, and cooks. 100% broker-free.',
    type: 'website',
    siteName: 'MasterX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MasterX — Find Room, Mess & Cook Near You',
    description: 'India\'s first all-in-one platform for rooms, roommates, mess, and cooks.',
  },
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body className="min-h-screen antialiased text-foreground">
        <ReduxProvider>
          <AuthProvider>
            {children}
            <Toaster position="top-center" toastOptions={{
              duration: 3000,
              style: { borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontFamily: 'Plus Jakarta Sans, sans-serif' },
              success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }} />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
