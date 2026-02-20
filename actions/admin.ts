'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Helper to verify admin role
async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return false

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    return profile?.role === 'admin'
}

export async function approveCourse(courseId: string) {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) return { error: 'Unauthorized: Admin access required.' }

    const supabase = await createClient()

    const { error } = await supabase
        .from('courses')
        .update({ status: 'published' })
        .eq('id', courseId)

    if (error) {
        console.error('Failed to approve course:', error)
        return { error: 'Failed to approve course' }
    }

    // Optional: Create an automated notification for the instructor
    // We will do this via triggers or another action later, but can inline it soon.

    revalidatePath('/admin/courses')
    revalidatePath('/search')
    return { success: true }
}

export async function rejectCourse(courseId: string) {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) return { error: 'Unauthorized: Admin access required.' }

    const supabase = await createClient()

    const { error } = await supabase
        .from('courses')
        .update({ status: 'rejected' })
        .eq('id', courseId)

    if (error) {
        console.error('Failed to reject course:', error)
        return { error: 'Failed to reject course' }
    }

    revalidatePath('/admin/courses')
    return { success: true }
}
