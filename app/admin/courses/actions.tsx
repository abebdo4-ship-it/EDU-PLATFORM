'use client'

import { useTransition } from 'react'
import { approveCourse, rejectCourse } from '@/actions/admin'
import { Check, X, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'

export function ApproveCourseButton({ courseId }: { courseId: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            title="Approve & Publish Course"
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    const result = await approveCourse(courseId)
                    if (result.error) toast.error(result.error)
                    else toast.success('Course published successfully!')
                })
            }}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
        </button>
    )
}

export function RejectCourseButton({ courseId }: { courseId: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <button
            title="Reject Course"
            disabled={isPending}
            onClick={() => {
                if (!confirm('Are you sure you want to reject this course?')) return
                startTransition(async () => {
                    const result = await rejectCourse(courseId)
                    if (result.error) toast.error(result.error)
                    else toast.success('Course rejected.')
                })
            }}
            className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors disabled:opacity-50"
        >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
        </button>
    )
}
