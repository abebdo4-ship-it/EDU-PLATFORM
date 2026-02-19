'use client'

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Trash, Loader2 } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
    question_text: z.string().min(1, "Question text is required"),
    points: z.coerce.number().min(1),
    answers: z.array(z.object({
        text: z.string().min(1, "Answer text is required"),
        is_correct: z.boolean()
    })).min(2, "At least 2 answers are required")
})

interface QuizQuestionFormProps {
    quizId: string
    onSuccess: () => void
}

export function QuizQuestionForm({ quizId, onSuccess }: QuizQuestionFormProps) {
    const [open, setOpen] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any, // Bypass strict type check for array defaults
        defaultValues: {
            question_text: "",
            points: 10,
            answers: [
                { text: "", is_correct: false },
                { text: "", is_correct: false }
            ]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "answers"
    })

    const { isSubmitting } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // 1. Create Question
            const { data: questionData, error: questionError } = await supabase
                .from('questions')
                .insert({
                    quiz_id: quizId,
                    text: values.question_text,
                    points: values.points,
                    // order_index will be handled by DB default or added at end
                })
                .select()
                .single()

            if (questionError) throw questionError

            // 2. Create Answers
            const answersData = values.answers.map((answer) => ({
                question_id: questionData.id,
                text: answer.text,
                is_correct: answer.is_correct
            }))

            const { error: answersError } = await supabase
                .from('answers')
                .insert(answersData)

            if (answersError) {
                // Compensation: delete question if answers fail
                await supabase.from('questions').delete().eq('id', questionData.id)
                throw answersError
            }

            toast.success("Question created")
            form.reset()
            setOpen(false)
            onSuccess()
            router.refresh()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create question")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Question</DialogTitle>
                    <DialogDescription>
                        Create a multiple choice question for this quiz.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="question_text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Question Text</FormLabel>
                                    <FormControl>
                                        <Input disabled={isSubmitting} placeholder="e.g. What is the capital of France?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="points"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Points</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={isSubmitting} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <FormLabel>Andsers</FormLabel>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => append({ text: "", is_correct: false })}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Answer
                                </Button>
                            </div>
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-x-2">
                                    <FormField
                                        control={form.control}
                                        name={`answers.${index}.is_correct`}
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`answers.${index}.text`}
                                        render={({ field }) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        disabled={isSubmitting}
                                                        placeholder={`Answer ${index + 1}`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {fields.length > 2 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                            <FormMessage>{form.formState.errors.answers?.root?.message}</FormMessage>
                        </div>

                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                disabled={isSubmitting}
                                type="button"
                                variant="ghost"
                                onClick={() => setOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isSubmitting}
                                type="submit"
                            >
                                {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Create
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
