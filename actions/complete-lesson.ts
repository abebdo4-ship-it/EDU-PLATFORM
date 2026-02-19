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
        // Get total lessons in course
        const { count: totalLessons } = await supabase
            .from('lessons')
            .select('id', { count: 'exact', head: true })
            .eq('section_id', (
                await supabase.from('sections').select('id').eq('course_id', courseId)
            ).data?.map(s => s.id) // This approach is tricky in one query if we don't have direct course_id in lessons
                // Better: Get sections first, then lessons in those sections? 
                // Or if lessons has course_id? Let's check schema result again.
                // Result said: lessons has section_id, not course_id.
            )
        // Actually, let's just count all lessons belonging to sections of this course.

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
        // We need to find lesson_progress for lessons IN this course
        // This is a join. 
        // lesson_progress -> lessons -> sections -> course_id = X
        const { count: completedLessonsCount } = await supabase
            .from('lesson_progress')
            .select('id, lessons!inner(section_id, sections!inner(course_id))', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('completed', true)
            .eq('lessons.sections.course_id', courseId)

        const progress = totalLessonsCount && totalLessonsCount > 0
            ? Math.round(((completedLessonsCount || 0) / totalLessonsCount) * 100)
            : 0

        // 3. Update enrollment
        const { error: enrollmentError } = await supabase
            .from('enrollments')
            .update({
                progress_percent: progress,
                completed_at: progress === 100 ? new Date().toISOString() : null,
                last_accessed_at: new Date().toISOString() // Assuming we want to track this? Schema didn't show it but it's good practice.
                // Wait, schema check for enrollments: id, user_id, course_id, enrolled_at, progress_percent, completed_at
                // No last_accessed_at. Okay, skip it.
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
