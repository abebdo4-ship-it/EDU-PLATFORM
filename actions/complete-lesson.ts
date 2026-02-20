'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeLesson(courseId: string, lessonId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error('Unauthorized')
    }

    try {
        // 1. Mark lesson as complete and grant XP via RPC
        const { error: progressError } = await supabase.rpc('record_lesson_completion', {
            p_user: user.id,
            p_lesson: lessonId,
        })

        if (progressError) throw progressError

        // 2. Calculate new course progress
        const { data: sections } = await supabase
            .from('sections')
            .select('id')
            .eq('course_id', courseId)

        const sectionIds = sections?.map(s => s.id) || []

        if (sectionIds.length === 0) return // No lessons to count

        const { count: totalLessonsCount } = await supabase
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .in('section_id', sectionIds)
            .eq('is_published', true)

        // Get completed lessons count
        const { count: completedLessonsCount } = await supabase
            .from('lesson_progress')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true)
            .in('lesson_id', (await supabase
                .from('lessons')
                .select('id')
                .in('section_id', sectionIds)
                .eq('is_published', true)
            ).data?.map(l => l.id) || [])

        const progress = totalLessonsCount && totalLessonsCount > 0
            ? Math.round(((completedLessonsCount || 0) / totalLessonsCount) * 100)
            : 0

        // 3. Update enrollment
        const { error: enrollmentError } = await supabase
            .from('enrollments')
            .update({
                progress_percent: progress,
                completed_at: progress === 100 ? new Date().toISOString() : null,
            })
            .eq('user_id', user.id)
            .eq('course_id', courseId)

        if (enrollmentError) throw enrollmentError

        revalidatePath(`/courses/${courseId}`)
        revalidatePath(`/dashboard`)

        return { success: true, progress }
    } catch (error) {
        console.error('Error completing lesson:', error)
        throw new Error('Failed to complete lesson')
    }
}
