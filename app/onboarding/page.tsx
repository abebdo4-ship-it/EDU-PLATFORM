import { Wizard } from "@/components/onboarding/wizard"
import { checkOnboardingStatus } from "@/actions/onboarding"
import { redirect } from "next/navigation"

export const dynamic = 'force-dynamic'

export default async function OnboardingPage() {
    const isCompleted = await checkOnboardingStatus()

    if (isCompleted) {
        return redirect("/dashboard")
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-xl border overflow-hidden">
                <Wizard />
            </div>
        </div>
    )
}
