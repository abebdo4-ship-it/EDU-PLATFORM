import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login | Antigravity',
    description: 'Sign in to your account',
}

export default function LoginPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50 dark:bg-background">
            <div className="w-full max-w-sm md:max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter text-primary">Antigravity</h1>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
