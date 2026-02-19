'use client'

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Grip, Pencil, Plus, FileQuestion } from "lucide-react"
import { toast } from "react-hot-toast"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LessonList } from "./lesson-list"

interface SectionListProps {
    items: any[]
    onDragEnd: (result: DropResult) => void
    onEdit: (id: string) => void
    onEditLesson: (id: string) => void
    onCreateQuiz: (sectionId: string) => void
    courseId: string
}

export function SectionList({ items, onDragEnd, onEdit, onEditLesson, onCreateQuiz, courseId }: SectionListProps) {
    const [isMounted, setIsMounted] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const onReorderLessons = async (updateData: { id: string; position: number }[]) => {
        try {
            for (const item of updateData) {
                await supabase.from('lessons').update({ position: item.position }).eq('id', item.id)
            }
            toast.success("Lessons reordered")
        } catch {
            toast.error("Failed to reorder lessons")
        }
    }

    const onAddLesson = async (sectionId: string) => {
        try {
            const targetSection = items.find(s => s.id === sectionId)
            const position = targetSection?.lessons?.length || 0

            const { error } = await supabase.from('lessons').insert({
                title: 'New Lesson',
                section_id: sectionId,
                position,
                is_published: false
            })

            if (error) throw error

            toast.success("Lesson created")
            window.location.reload()
        } catch (e) {
            toast.error("Error creating lesson")
        }
    }

    if (!isMounted) return null

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {items.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className="bg-slate-200 dark:bg-slate-800 rounded-md mb-4"
                                    >
                                        <div className="flex items-center gap-x-2 border-slate-200 dark:border-slate-700 border text-slate-700 dark:text-slate-200 rounded-t-md p-2 text-sm font-semibold">
                                            <div
                                                className="px-2 py-1 cursor-grab hover:bg-slate-300 dark:hover:bg-slate-700 rounded transition"
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip className="h-5 w-5" />
                                            </div>
                                            {section.title}
                                            <div className="ml-auto flex items-center gap-x-2">
                                                <Badge variant={section.is_published ? "default" : "secondary"}>
                                                    {section.is_published ? "Published" : "Draft"}
                                                </Badge>
                                                <Button size="sm" variant="ghost" onClick={() => onCreateQuiz(section.id)} title="Add Quiz">
                                                    <FileQuestion className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="ghost" onClick={() => onAddLesson(section.id)} title="Add Lesson">
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Pencil
                                                    onClick={() => onEdit(section.id)}
                                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                                />
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <LessonList
                                                items={section.lessons || []}
                                                onReorder={onReorderLessons}
                                                onEdit={(id) => onEditLesson(id)}
                                                sectionId={section.id}
                                            />
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
}
