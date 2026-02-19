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

    // verify course is free
    const { data: course } = await supabase
        .from('courses')
        .select('price')
        .eq('id', courseId)
        .single()

    if (!course) throw new Error('Course not found')
    if (course.price && course.price > 0) throw new Error('Course is not free')

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
