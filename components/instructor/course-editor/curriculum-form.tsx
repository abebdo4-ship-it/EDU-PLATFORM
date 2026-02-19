'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { Plus, Loader2, FileQuestion } from "lucide-react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import toast from "react-hot-toast"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionList } from "@/components/instructor/course-editor/section-list"

interface CurriculumFormProps {
    course: any
}

export function CurriculumForm({ course }: CurriculumFormProps) {
    const supabase = createClient()
    const [isCreating, setIsCreating] = useState(false)
    const [title, setTitle] = useState("")
    const router = useRouter()

    const onEditSection = (id: string) => {
        // Simple prompt for now, or could use a modal
        const newTitle = prompt("Enter new section title:")
        if (newTitle) {
            handleRenameSection(id, newTitle)
        }
    }

    const handleRenameSection = async (id: string, title: string) => {
        try {
            await supabase.from('sections').update({ title }).eq('id', id)
            toast.success("Section renamed")
            refetch()
        } catch {
            toast.error("Failed to rename section")
        }
    }

    const onEditLesson = (id: string) => {
        router.push(`/instructor/courses/${course.id}/lessons/${id}`)
    }

    const { data: sections, refetch } = useQuery({
        queryKey: ['sections', course.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('sections')
                .select('*, lessons(*)')
                .eq('course_id', course.id)
                .order('position', { ascending: true })

            if (error) throw error

            // Sort lessons within sections
            const sorted = data.map((section: any) => ({
                ...section,
                lessons: section.lessons.sort((a: any, b: any) => a.position - b.position)
            }))

            return sorted
        }
    })

    const onReorder = async (updateData: { id: string; position: number }[]) => {
        try {
            // Optimistic update handled by dnd (locally), now sync to DB
            for (const item of updateData) {
                await supabase.from('sections').update({ position: item.position }).eq('id', item.id)
            }
            toast.success("Sections reordered")
        } catch {
            toast.error("Something went wrong with reordering")
        }
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return
        if (!sections) return

        const items = Array.from(sections)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Bulk update positions
        const updateData = items.map((section: any, index: number) => ({
            id: section.id,
            position: index
        }))

        onReorder(updateData)
        // Ideally we would set optimistic state here, but refetching is safer for MVP
        refetch()
    }

    const onCreateSection = async () => {
        if (!title) return
        try {
            const position = sections ? sections.length : 0

            await supabase.from('sections').insert({
                title,
                course_id: course.id,
                position
            })

            setTitle("")
            setIsCreating(false)
            toast.success("Section created")
            refetch()
        } catch {
            toast.error("Failed to create section")
        }
    }

    const onCreateQuiz = async (sectionId: string) => {
        try {
            // 1. Get position
            const targetSection = sections?.find((s: any) => s.id === sectionId)
            const position = targetSection?.lessons?.length || 0

            // 2. Create Lesson (Type=quiz)
            const { data: lesson, error: lessonError } = await supabase
                .from('lessons')
                .insert({
                    title: 'New Quiz',
                    section_id: sectionId,
                    position,
                    is_published: false,
                    type: 'quiz'
                })
                .select()
                .single()

            if (lessonError) throw lessonError

            // 3. Create Quiz Entry
            const { error: quizError } = await supabase
                .from('quizzes')
                .insert({
                    lesson_id: lesson.id,
                    course_id: course.id,
                    title: 'New Quiz',
                    passing_score: 80
                })

            if (quizError) throw quizError

            toast.success("Quiz created")
            // Ideally refetch or better localized update
            refetch()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create quiz")
        }
    }

    return (
        <div className="bg-card rounded-md border p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Course Curriculum</h2>
                <Button onClick={() => setIsCreating(!isCreating)} variant="outline">
                    <Plus className="h-4 w-4 mr-2" /> Add Section
                </Button>
            </div>

            {isCreating && (
                <div className="mb-4 flex gap-2 items-center animate-in fade-in slide-in-from-top-2">
                    <Input
                        placeholder="New Section Title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="max-w-md"
                        autoFocus
                    />
                    <Button onClick={onCreateSection} disabled={!title}>Create</Button>
                    <Button onClick={() => setIsCreating(false)} variant="ghost">Cancel</Button>
                </div>
            )}

            {!sections?.length && !isCreating && (
                <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-md">
                    No sections yet. Start by adding one!
                </div>
            )}

            <SectionList
                items={sections || []}
                onDragEnd={onDragEnd}
                onEdit={onEditSection}
                onEditLesson={onEditLesson}
                onCreateQuiz={onCreateQuiz}
                courseId={course.id}
            />
        </div>
    )
}
