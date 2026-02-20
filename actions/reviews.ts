'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createReview(courseId: string, rating: number, comment: string) {
    if (rating < 1 || rating > 5) {
        return { error: 'Rating must be between 1 and 5' }
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to leave a review.' }
    }

    // Optional Check: Is the user enrolled?
    // We can query the purchases table to verify enrollment before allowing a review.
    const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .single()

    if (!purchase) {
        return { error: 'You must be enrolled in this course to leave a review.' }
    }

    try {
        const { error } = await supabase
            .from('reviews')
            .insert({
                course_id: courseId,
                user_id: user.id,
                rating,
                comment: comment.trim() || null
            })

        if (error) {
            if (error.code === '23505') { // Unique constraint violation
                return { error: 'You have already reviewed this course.' }
            }
            console.error('Failed to create review:', error)
            return { error: 'Failed to submit review. Please try again later.' }
        }

        revalidatePath(`/courses/${courseId}`)
        return { success: true }
    } catch (err) {
        console.error('Unexpected error in createReview:', err)
        return { error: 'An unexpected error occurred.' }
    }
}
