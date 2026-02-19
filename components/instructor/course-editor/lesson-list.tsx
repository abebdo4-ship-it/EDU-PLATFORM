'use client'

import { useEffect, useState } from "react"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Grip, Pencil, Trash, File, Video, Trophy } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface LessonListProps {
    items: any[]
    onReorder: (updateData: { id: string; position: number }[]) => void
    onEdit: (id: string) => void
    sectionId: string
}

export function LessonList({ items, onReorder, onEdit, sectionId }: LessonListProps) {
    const [isMounted, setIsMounted] = useState(false)
    const [lessons, setLessons] = useState(items)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        setLessons(items)
    }, [items])

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(lessons)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setLessons(items)

        const bulkUpdate = items.map((lesson, index) => ({
            id: lesson.id,
            position: index
        }))

        onReorder(bulkUpdate)
    }

    if (!isMounted) return null

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId={`lessons-${sectionId}`}>
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {lessons.map((lesson, index) => (
                            <Draggable key={lesson.id} draggableId={lesson.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        className={cn(
                                            "flex items-center gap-x-2 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 border text-slate-700 dark:text-slate-300 rounded-md text-sm",
                                            lesson.is_published && "bg-sky-100 dark:bg-sky-900 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "px-2 py-3 border-r border-r-slate-200 dark:border-r-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-l-md transition cursor-grab",
                                                lesson.is_published && "border-r-sky-200 dark:border-r-sky-800 hover:bg-sky-200 dark:hover:bg-sky-800"
                                            )}
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-4 w-4" />
                                        </div>
                                        <div className="flex items-center gap-2 py-2">
                                            {/* Icon based on type (video default for now) */}
                                            <Video className="h-4 w-4" />
                                            {lesson.title}
                                        </div>
                                        <div className="ml-auto pr-2 flex items-center gap-x-2">
                                            {lesson.is_free && <Badge>Free</Badge>}
                                            <Badge className={cn("bg-slate-500", lesson.is_published && "bg-sky-700")}>
                                                {lesson.is_published ? "Published" : "Draft"}
                                            </Badge>
                                            <Pencil
                                                onClick={() => onEdit(lesson.id)}
                                                className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
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
