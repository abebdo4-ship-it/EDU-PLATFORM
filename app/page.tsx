import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Stats } from '@/components/landing/stats'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Antigravity | Learn Without Limits',
  description: 'The next-generation learning platform.',
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            {/* Logo Icon can go here */}
            Antigravity
          </div>
          <nav className="flex gap-6 text-sm font-medium">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="/courses" className="hover:text-primary transition-colors">Courses</a>
            <a href="/auth/login" className="hover:text-primary transition-colors">Log in</a>
            <a href="/auth/register" className="px-4 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">Get Started</a>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
        {/* Testimonials and CTA can be added here */}
      </main>
      <footer className="border-t py-12 bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Antigravity Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
