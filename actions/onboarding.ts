'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function submitOnboarding(data: {
    fullName: string,
    displayName: string,
    avatarUrl: string,
    birthDate: string,
    experienceLevel: string,
    interests: string[]
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Unauthorized")

    // Generate UID code (e.g. ANT-5FX9)
    const uidCode = `ANT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`

    // Update Profile
    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: data.fullName,
            display_name: data.displayName || data.fullName,
            avatar_url: data.avatarUrl,
            birth_date: data.birthDate ? new Date(data.birthDate).toISOString() : null,
            experience_level: data.experienceLevel,
            interests: data.interests,
            uid_code: uidCode,
            daily_streak: 1, // Start their streak!
            xp_points: 100 // Welcome bonus
        })
        .eq('id', user.id)

    if (error) {
        console.error("Onboarding error:", error)
        throw new Error("Failed to save onboarding data")
    }

    // Record welcome bonus in daily_activity
    await supabase.from('daily_activity').insert({
        user_id: user.id,
        activity_date: new Date().toISOString().split('T')[0],
        xp_earned: 100
    })

    // Set cookie to indicate onboarding is complete
    const cookieStore = await cookies()
    cookieStore.set('onboarding_complete', 'true', {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
    })

    redirect('/dashboard')
}

// Function to skip or check onboarding explicitly
export async function checkOnboardingStatus() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data } = await supabase.from('profiles').select('uid_code').eq('id', user.id).single()

    if (data?.uid_code) {
        const cookieStore = await cookies()
        cookieStore.set('onboarding_complete', 'true', {
            maxAge: 60 * 60 * 24 * 365,
            path: '/',
        })
        return true
    }

    return false
}
