'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Pencil, PlusCircle, Video } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface LessonVideoFormProps {
    initialData: {
        video_url: string | null
    }
    courseId: string
    lessonId: string
}

const formSchema = z.object({
    video_url: z.string().min(1),
})

export function LessonVideoForm({ initialData, courseId, lessonId }: LessonVideoFormProps) {
    const [isEditing, setIsEditing] = React.useState(false)
    const [progress, setProgress] = React.useState(0)
    const router = useRouter()
    const supabase = createClient()

    const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        const file = acceptedFiles[0]
        setIsEditing(true)
        setProgress(0)

        try {
            // Upload to Supabase Storage
            // Assumes 'videos' bucket exists and is public
            const filePath = `course-${courseId}/lesson-${lessonId}/${file.name}`

            const { data, error } = await supabase.storage
                .from('videos')
                .upload(filePath, file, {
                    upsert: true
                })

            if (error) throw error

            const { data: { publicUrl } } = supabase.storage
                .from('videos')
                .getPublicUrl(filePath)

            await supabase.from('lessons').update({ video_url: publicUrl }).eq('id', lessonId)

            toast.success("Video uploaded")
            setIsEditing(false)
            router.refresh()
        } catch (error) {
            console.error("Upload error:", error)
            toast.error("Upload failed")
        } finally {
            setProgress(0)
        }
    }, [lessonId, courseId, router, supabase])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'video/*': [] },
        maxFiles: 1,
    })

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson video
                <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
                    {isEditing && <>Cancel</>}
                    {!isEditing && !initialData.video_url && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add video
                        </>
                    )}
                    {!isEditing && initialData.video_url && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit video
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.video_url ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 dark:bg-slate-800 rounded-md mt-2">
                        <Video className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="relative aspect-video mt-2">
                        <video
                            controls
                            className="w-full h-full rounded-md bg-black"
                            src={initialData.video_url}
                        />
                    </div>
                )
            )}
            {isEditing && (
                <div className="mt-4">
                    <div
                        {...getRootProps()}
                        className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-md p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition"
                    >
                        <input {...getInputProps()} />
                        {progress > 0 ? (
                            <div className="w-full space-y-2">
                                <div className="text-sm text-center">Uploading... {progress}%</div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                                    <div className="bg-sky-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        ) : isDragActive ? (
                            <p>Drop the video file here ...</p>
                        ) : (
                            <div className="text-center space-y-2">
                                <PlusCircle className="h-10 w-10 mx-auto text-slate-500" />
                                <p>Drag & drop a video file, or click to select</p>
                                <p className="text-xs text-muted-foreground">MP4, WebM up to 1GB</p>
                            </div>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-4">
                        Note: Ensure your bucket "videos" is public.
                    </div>
                </div>
            )}
        </div>
    )
}
