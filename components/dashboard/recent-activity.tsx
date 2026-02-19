'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface ActivityItem {
    id: string
    lesson_title: string
    course_title: string
    course_id: string
    lesson_id: string
    completed_at: string
}

export function RecentActivity() {
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchActivity() {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            const { data } = await supabase
                .from('lesson_progress')
                .select(`
                    id,
                    updated_at,
                    lesson_id,
                    course_id,
                    lessons ( title ),
                    courses ( title )
                `)
                .eq('user_id', user.id)
                .eq('is_completed', true)
                .order('updated_at', { ascending: false })
                .limit(8)

            if (data) {
                setActivities(data.map((item: any) => ({
                    id: item.id,
                    lesson_title: item.lessons?.title ?? 'Lesson',
                    course_title: item.courses?.title ?? 'Course',
                    course_id: item.course_id,
                    lesson_id: item.lesson_id,
                    completed_at: item.updated_at,
                })))
            }
            setLoading(false)
        }

        fetchActivity()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (activities.length === 0) {
        return (
            <div className="rounded-xl border bg-card shadow-sm h-[300px] flex flex-col items-center justify-center gap-2">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No recent activity</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm divide-y">
            {activities.map((activity) => (
                <Link
                    key={activity.id}
                    href={`/courses/${activity.course_id}/lessons/${activity.lesson_id}`}
                    className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
                >
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{activity.lesson_title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.course_title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDistanceToNow(new Date(activity.completed_at), { addSuffix: true })}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
