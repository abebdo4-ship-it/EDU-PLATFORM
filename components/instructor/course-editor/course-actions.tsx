'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"

interface CourseActionsProps {
    course: {
        id: string
        is_published: boolean
        title: string
    }
}

export function CourseActions({ course }: CourseActionsProps) {
    const router = useRouter()
    const supabase = createClient()
    const [isLoading, setIsLoading] = useState(false)

    const onPublish = async () => {
        try {
            setIsLoading(true)

            if (course.is_published) {
                await supabase.from('courses').update({ is_published: false }).eq('id', course.id)
                toast.success("Course unpublished")
            } else {
                // In a real app, verify completion here
                // const { data: sections } = ... check if sections exist

                await supabase.from('courses').update({ is_published: true }).eq('id', course.id)
                toast.success("Course published")
            }

            router.refresh()
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true)
            await supabase.from('courses').delete().eq('id', course.id)
            toast.success("Course deleted")
            router.refresh()
            router.push(`/instructor/courses`)
        } catch {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onPublish}
                disabled={isLoading}
                variant="outline"
                size="sm"
            >
                {course.is_published ? "Unpublish" : "Publish"}
            </Button>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" disabled={isLoading}>
                        <Trash className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your course
                            and all of its data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
