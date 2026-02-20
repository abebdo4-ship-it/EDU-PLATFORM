'use client'

import { use } from "react"
import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, LayoutDashboard, Video, Eye } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { LessonTitleForm } from "@/components/instructor/lesson-editor/lesson-title-form"
import { LessonDescriptionForm } from "@/components/instructor/lesson-editor/lesson-description-form"
import { LessonAccessForm } from "@/components/instructor/lesson-editor/lesson-access-form"
import { LessonVideoForm } from "@/components/instructor/lesson-editor/lesson-video-form"
import { LessonAttachmentForm } from "@/components/instructor/lesson-editor/lesson-attachment-form"
import { QuizEditor } from "@/components/instructor/quiz-editor/quiz-editor"

interface LessonIdPageProps {
    params: Promise<{
        courseId: string
        lessonId: string
    }>
}

export default function LessonIdPage({ params }: LessonIdPageProps) {
    const supabase = createClient()
    const { courseId, lessonId } = use(params)

    const { data: lesson, isLoading } = useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single()

            if (error) throw error
            return data
        }
    })

    // We also need course details to verify ownership and show completion
    const { data: course, isLoading: isCourseLoading } = useQuery({
        queryKey: ['course', courseId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('courses')
                .select('*')
                .eq('id', courseId)
                .single()

            if (error) throw error
            return data
        }
    })

    if (isLoading || isCourseLoading) {
        return <div className="flex items-center justify-center h-screen">Loading lesson editor...</div>
    }

    if (!lesson || !course) {
        return redirect('/instructor/courses')
    }

    // Redirect to Quiz Editor if type is quiz
    if (lesson.type === 'quiz') {
        return <QuizEditor lesson={lesson} courseId={courseId} />
    }

    // Calculate completion percentage based on filled fields
    const requiredFields = [
        lesson.title,
        lesson.description,
        lesson.video_url, // Mock implementation
    ]
    const totalFields = requiredFields.length
    const completedFields = requiredFields.filter(Boolean).length
    const completionText = `(${completedFields}/${totalFields})`

    return (
        <div className="p-6">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <Link href={`/instructor/courses/${courseId}`} className="flex items-center text-sm hover:opacity-75 transition mb-6">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to course setup
                    </Link>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col gap-y-2">
                            <h1 className="text-2xl font-bold">
                                Lesson Setup
                            </h1>
                            <span className="text-sm text-muted-foreground">
                                Complete all fields {completionText}
                            </span>
                        </div>
                        {/* Lesson Actions (Publish/Delete) */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-slate-100 p-2 rounded-full dark:bg-slate-800">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-medium">Customize your lesson</h2>
                        </div>
                        {/* Render Forms */}
                        <LessonTitleForm
                            initialData={lesson}
                            courseId={courseId}
                            lessonId={lessonId}
                        />
                        <LessonDescriptionForm
                            initialData={lesson}
                            courseId={courseId}
                            lessonId={lessonId}
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <div className="bg-slate-100 p-2 rounded-full dark:bg-slate-800">
                                <Eye className="h-5 w-5" />
                            </div>
                            <h2 className="text-xl font-medium">Access Settings</h2>
                        </div>
                        <LessonAccessForm
                            initialData={lesson}
                            courseId={courseId}
                            lessonId={lessonId}
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-slate-100 p-2 rounded-full dark:bg-slate-800">
                            <Video className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-medium">Add a video</h2>
                    </div>
                    <LessonVideoForm
                        initialData={lesson}
                        courseId={courseId}
                        lessonId={lessonId}
                    />
                    <div className="mt-6 border-t pt-6 border-slate-200 dark:border-slate-800">
                        <LessonAttachmentForm
                            initialData={lesson}
                            courseId={courseId}
                            lessonId={lessonId}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
