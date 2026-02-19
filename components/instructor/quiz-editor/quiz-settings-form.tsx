'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Pencil } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface QuizSettingsFormProps {
    initialData: {
        id: string
        passing_score: number
        time_limit_sec?: number | null
    }
}

const formSchema = z.object({
    passing_score: z.coerce.number().min(0).max(100),
    time_limit_sec: z.coerce.number().min(0).optional(),
})

export function QuizSettingsForm({ initialData }: QuizSettingsFormProps) {
    const [isEditing, setIsEditing] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: {
            passing_score: initialData.passing_score ?? 80,
            time_limit_sec: initialData.time_limit_sec ?? 0
        },
    })

    const { isSubmitting, isValid } = form.formState

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { error } = await supabase
                .from('quizzes')
                .update(values)
                .eq('id', initialData.id)

            if (error) throw error

            toast.success("Quiz settings updated")
            setIsEditing(false)
            router.refresh()
        } catch {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4 dark:bg-slate-900">
            <div className="font-medium flex items-center justify-between">
                Quiz Settings
                <Button onClick={() => setIsEditing(!isEditing)} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit settings
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <div className="text-sm mt-2 space-y-1">
                    <p>Passing Score: {initialData.passing_score}%</p>
                    <p>Time Limit: {initialData.time_limit_sec ? `${Math.floor(initialData.time_limit_sec / 60)} mins` : 'No limit'}</p>
                </div>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="passing_score"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Passing Score (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="80"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time_limit_sec"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time Limit (seconds)</FormLabel>
                                    <FormDescription>Set to 0 for no limit</FormDescription>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            disabled={isSubmitting}
                                            placeholder="0"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}
