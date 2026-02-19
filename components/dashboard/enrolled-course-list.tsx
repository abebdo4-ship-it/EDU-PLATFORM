'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CourseCard } from '@/components/course/course-card'
import { Loader2, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EnrolledCourse {
    id: string
    title: string
    image_url: string | null
    price: number | null
    sections: { id: string }[]
    category: { name: string } | null
    progress: number | null
}

export function EnrolledCourseList() {
    const [courses, setCourses] = useState<EnrolledCourse[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEnrolledCourses() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            // Fetch enrollments with course data
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select(`
                    course_id,
                    courses (
                        id, title, image_url, price,
                        sections ( id ),
                        categories ( name )
                    )
                `)
                .eq('user_id', user.id)

            if (!enrollments) { setLoading(false); return }

            // For each course, calculate progress
            const coursesWithProgress = await Promise.all(
                enrollments.map(async (e: any) => {
                    const course = e.courses
                    if (!course) return null

                    const totalLessons = course.sections?.length ?? 0

                    let progressPct = null
                    if (totalLessons > 0) {
                        const { count } = await supabase
                            .from('lesson_progress')
                            .select('*', { count: 'exact', head: true })
                            .eq('user_id', user.id)
                            .eq('course_id', course.id)
                            .eq('is_completed', true)

                        progressPct = Math.round(((count ?? 0) / totalLessons) * 100)
                    }

                    return {
                        ...course,
                        category: course.categories,
                        sections: course.sections ?? [],
                        progress: progressPct,
                    }
                })
            )

            setCourses(coursesWithProgress.filter(Boolean) as EnrolledCourse[])
            setLoading(false)
        }

        fetchEnrolledCourses()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (courses.length === 0) {
        return (
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">You haven't enrolled in any courses yet.</p>
                <Button asChild>
                    <Link href="/search">Browse Courses</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {courses.map((course) => (
                <CourseCard
                    key={course.id}
                    id={course.id}
                    title={course.title}
                    imageUrl={course.image_url ?? ''}
                    chaptersLength={course.sections.length}
                    price={course.price ?? 0}
                    progress={course.progress}
                    category={course.category?.name ?? 'Uncategorized'}
                />
            ))}
        </div>
    )
}
