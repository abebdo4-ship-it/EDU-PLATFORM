'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function enrollInCourse(courseId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    // Check if user is Pro
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', user.id)
        .single()

    const isPro = profile?.is_pro

    // verify course is free (or user is pro)
    const { data: course } = await supabase
        .from('courses')
        .select('price')
        .eq('id', courseId)
        .single()

    if (!course) throw new Error('Course not found')

    // Only block if course is paid AND user is not Pro
    if (course.price && course.price > 0 && !isPro) {
        throw new Error('Course requires purchase or Pro subscription')
    }

    const { error } = await supabase
        .from('enrollments')
        .insert({
            user_id: user.id,
            course_id: courseId,
        })

    if (error) {
        if (error.code === '23505') { // Unique violation
            return { success: true, message: 'Already enrolled' }
        }
        throw error
    }

    revalidatePath(`/courses/${courseId}`)
    revalidatePath(`/dashboard`)

    return { success: true }
}
