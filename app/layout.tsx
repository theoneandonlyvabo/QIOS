import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'QIOS - Quality Integrated Omni System',
  description: 'Comprehensive retail management system with integrated payment gateways for UMKM and SMB',
  keywords: ['retail', 'payment', 'umkm', 'pos', 'analytics', 'ai'],
  icons: {
    icon: [
      {
        media: '(prefers-color-scheme: light)',
        url: '/icon.png',
        href: '/icon.png',
      },
      {
        media: '(prefers-color-scheme: dark)',
        url: '/icon.png',
        href: '/icon.png',
      }
    ]
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        <NextThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <div className="min-h-screen">
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </div>
        </NextThemeProvider>
      </body>
    </html>
  )
}
