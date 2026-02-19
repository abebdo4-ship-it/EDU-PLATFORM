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
        <div className="flex min-h-screen items-center justify-center p-4 bg-muted/50 dark:bg-background">
            <div className="w-full max-w-sm md:max-w-md">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tighter text-primary">Antigravity</h1>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <RegisterForm />
                </Suspense>
            </div>
        </div>
    )
}
