import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/register-form'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Register | Antigravity',
    description: 'Create a new account',
}

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen">
            {/* Left: Animated Illustration Panel (mirrored from login) */}
            <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden bg-gradient-to-bl from-secondary/10 via-purple-500/10 to-primary/10">
                <div className="absolute inset-0 mesh-gradient" />

                <div className="absolute top-[12%] right-[18%] w-20 h-20 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/10 animate-float" />
                <div className="absolute bottom-[18%] left-[15%] w-16 h-16 rounded-2xl rotate-12 bg-gradient-to-br from-primary/30 to-primary/10 animate-float-reverse" />
                <div className="absolute top-[50%] left-[12%] w-12 h-12 rounded-xl rotate-45 bg-gradient-to-br from-purple-500/30 to-purple-500/10 animate-float-slow" />
                <div className="absolute top-[30%] right-[10%] w-8 h-8 rounded-full bg-accent/30 animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-[35%] right-[30%] w-6 h-6 rounded-lg bg-secondary/20 animate-float-reverse" style={{ animationDelay: '1s' }} />

                <div className="w-80 h-80 bg-gradient-to-br from-secondary/20 via-purple-500/15 to-primary/20 animate-morph blur-sm" />

                <div className="absolute w-64 h-64 rounded-full border-2 border-secondary/10 animate-spin-slow" />
                <div className="absolute w-48 h-48 rounded-full border border-primary/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '25s' }} />

                <div className="absolute text-center space-y-4">
                    <div className="text-6xl">🎓</div>
                    <h2 className="text-2xl font-bold tracking-tight">Join the Community</h2>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                        Create your account and start learning with thousands of students
                    </p>
                </div>
            </div>

            {/* Right: Form */}
            <div className="flex flex-1 items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm md:max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-extrabold tracking-tighter gradient-text">
                            Antigravity
                        </h1>
                        <p className="text-muted-foreground text-sm">Create an account and start your learning journey</p>
                    </div>
                    <Suspense fallback={
                        <div className="glass-card rounded-2xl p-8 animate-pulse">
                            <div className="h-6 bg-muted rounded w-1/2 mb-4" />
                            <div className="h-10 bg-muted rounded mb-3" />
                            <div className="h-10 bg-muted rounded mb-3" />
                            <div className="h-10 bg-muted rounded" />
                        </div>
                    }>
                        <RegisterForm />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}
