'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, Circle } from 'lucide-react'
import confetti from 'canvas-confetti'
import { completeLesson } from '@/actions/complete-lesson'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface LessonCompleteButtonProps {
    courseId: string
    lessonId: string
    isCompleted: boolean
    nextLessonId?: string
}

export const LessonCompleteButton = ({
    courseId,
    lessonId,
    isCompleted,
    nextLessonId,
}: LessonCompleteButtonProps) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    // Local optimistic state
    const [completed, setCompleted] = useState(isCompleted)

    const onClick = async () => {
        if (completed) return // Already completed, maybe allow toggle off later? Spec doesn't say.

        try {
            setIsLoading(true)

            // Fire confetti immediately for better UX
            const defaults = { origin: { y: 0.7 } };
            confetti({
                ...defaults,
                particleCount: 100,
                spread: 70,
                zIndex: 9999
            });

            // Optimistic update
            setCompleted(true)

            await completeLesson(courseId, lessonId)

            toast.success('Lesson completed!')

            if (nextLessonId) {
                // If there is a next lesson, maybe redirect or show a button?
                // For now, just stay here or let flow handle it.
                // The spec mentions "Next/Prev" buttons separately.
                router.refresh()
            } else {
                router.refresh()
            }
        } catch (error) {
            toast.error('Something went wrong')
            setCompleted(false) // Revert
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={onClick}
            disabled={isLoading || completed}
            variant={completed ? 'outline' : 'default'}
            className={cn(
                "w-full md:w-auto min-w-[160px] gap-x-2 transition-all",
                completed && "text-emerald-700 border-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-800"
            )}
        >
            {completed ? (
                <>
                    <CheckCircle className="h-4 w-4" />
                    Completed
                </>
            ) : (
                <>
                    <Circle className="h-4 w-4" />
                    Mark as Complete
                </>
            )}
        </Button>
    )
}
