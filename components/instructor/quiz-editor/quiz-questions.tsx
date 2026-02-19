'use client'

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd"
import { Plus, Grip, Pencil, Trash } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { QuizQuestionForm } from "./quiz-question-form"

interface QuizQuestionsProps {
    quiz: any
}

export function QuizQuestions({ quiz }: QuizQuestionsProps) {
    const supabase = createClient()
    const [isCreating, setIsCreating] = useState(false)
    const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)

    const { data: questions, refetch, isLoading } = useQuery({
        queryKey: ['questions', quiz.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('questions')
                .select('*, answers(*)') // Fetch answers to show count/details
                .eq('quiz_id', quiz.id)
                .order('order_index', { ascending: true })

            if (error) throw error
            return data
        }
    })

    const onReorder = async (updateData: { id: string; order_index: number }[]) => {
        try {
            for (const item of updateData) {
                await supabase.from('questions').update({ order_index: item.order_index }).eq('id', item.id)
            }
            toast.success("Questions reordered")
        } catch {
            toast.error("Something went wrong")
        }
    }

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(questions || [])
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        const updateData = items.map((question: any, index: number) => ({
            id: question.id,
            order_index: index
        }))

        // Optimistic update could go here, for now just API call + refetch
        onReorder(updateData)
        refetch()
    }

    const onDelete = async (id: string) => {
        try {
            await supabase.from('questions').delete().eq('id', id)
            toast.success("Question deleted")
            refetch()
        } catch {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between mb-4">
                Quiz Questions
                <QuizQuestionForm
                    quizId={quiz.id}
                    onSuccess={refetch}
                />
            </div>

            {/* Removed inline placeholder in favor of Dialog */}

            {isLoading && <div className="text-center text-sm text-muted-foreground">Loading questions...</div>}

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                            {questions?.map((question: any, index: number) => (
                                <Draggable key={question.id} draggableId={question.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={cn(
                                                "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-2 text-sm",
                                                "dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                                                    "dark:border-r-slate-700 dark:hover:bg-slate-700"
                                                )}
                                                {...provided.dragHandleProps}
                                            >
                                                <Grip className="h-5 w-5" />
                                            </div>
                                            <div className="flex flex-col px-2 py-2 flex-1">
                                                <span className="font-medium truncate max-w-[300px]">{question.text}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {question.answers?.length || 0} options • {question.points} pts
                                                </span>
                                            </div>
                                            <div className="ml-auto pr-2 flex items-center gap-x-2">
                                                <Pencil
                                                    onClick={() => setEditingQuestionId(question.id)}
                                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                                                />
                                                <Trash
                                                    onClick={() => onDelete(question.id)}
                                                    className="w-4 h-4 cursor-pointer hover:opacity-75 transition text-destructive"
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

            {!isLoading && (!questions || questions.length === 0) && !isCreating && (
                <div className="text-center text-sm text-muted-foreground mt-10">
                    No questions yet
                </div>
            )}
        </div>
    )
}
