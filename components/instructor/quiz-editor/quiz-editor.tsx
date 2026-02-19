'use client'

import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, LayoutDashboard, ListChecks } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { QuizTitleForm } from "./quiz-title-form"
import { QuizSettingsForm } from "./quiz-settings-form"
import { QuizQuestions } from "./quiz-questions"

interface QuizEditorProps {
    lesson: any
    courseId: string
}

export function QuizEditor({ lesson, courseId }: QuizEditorProps) {
    const supabase = createClient()

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', lesson.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('quizzes')
                .select('*, questions(*)')
                .eq('lesson_id', lesson.id)
                .single()

            if (error) throw error
            return data
        }
    })

    if (isLoading) {
        return <div>Loading quiz...</div>
    }

    if (!quiz) {
        return <div>Quiz not found.</div>
    }

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
                                Quiz Setup
                            </h1>
                            <span className="text-sm text-muted-foreground">
                                Manage questions and settings for this quiz.
                            </span>
                        </div>
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
                            <h2 className="text-xl font-medium">Customize your quiz</h2>
                        </div>
                        <div className="p-4 border bg-slate-100 rounded-md mt-4">
                            <QuizTitleForm
                                initialData={quiz}
                                courseId={courseId}
                                lessonId={lesson.id}
                            />
                        </div>
                        <div className="p-4 border bg-slate-100 rounded-md mt-4">
                            <QuizSettingsForm initialData={quiz} />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-x-2">
                        <div className="bg-slate-100 p-2 rounded-full dark:bg-slate-800">
                            <ListChecks className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-medium">Questions</h2>
                    </div>
                    <div className="p-4 border bg-slate-100 rounded-md mt-4">
                        <QuizQuestions quiz={quiz} />
                    </div>
                </div>
            </div>
        </div>
    )
}
