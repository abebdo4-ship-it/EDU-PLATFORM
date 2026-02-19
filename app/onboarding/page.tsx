export const dynamic = 'force-dynamic'

import { OnboardingWizard } from '@/components/onboarding/wizard'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Welcome to Antigravity',
    description: 'Set up your profile',
}

export default function OnboardingPage() {
    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-[url('/grid-pattern.svg')] bg-fixed bg-center">
            <div className="w-full">
                <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <h1 className="text-4xl font-extrabold tracking-tighter text-primary mb-2">Almost there!</h1>
                    <p className="text-muted-foreground text-lg">Let&apos;s personalize your experience.</p>
                </div>
                <OnboardingWizard />
            </div>
        </div>
    )
}
