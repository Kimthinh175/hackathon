import type { Metadata } from 'next'
import './globals.css'
import './custom.css'
import Navigation from '@/components/Navigation'

export const metadata: Metadata = {
  title: 'Warehouse & Assets SPA',
  description: 'Hackathon Project Frontend',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
          <title>Warehouse & Assets SPA</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className="font-sans antialiased text-gray-900 bg-gray-50 min-h-screen m-0 p-0">
        {children}
      </body>
    </html>
  )
}
