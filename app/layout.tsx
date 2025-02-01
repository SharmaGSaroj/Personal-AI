import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Personal AI Chatbot',
  description: 'DeepSeek AI is a powerful AI API that can be used to build chatbots, search engines, and more.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
