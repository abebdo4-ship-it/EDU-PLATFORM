'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Pencil, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { AttachmentUploader } from '../attachment-uploader'

interface LessonAttachmentFormProps {
    initialData: {
        id: string
        // Assuming we will store attachment_url somewhere.
        // For now, let's pretend we have it, or we simply allow attaching files that sit in storage
        // and link them to a separate 'attachments' table, or a JSON field.
        // If we don't have the column, we'll just demonstrate the upload.
    }
    courseId: string
    lessonId: string
}

export function LessonAttachmentForm({ initialData, courseId, lessonId }: LessonAttachmentFormProps) {
    const [isEditing, setIsEditing] = React.useState(false)
    const router = useRouter()
    const supabase = createClient()
    const [attachmentUrl, setAttachmentUrl] = React.useState<string | null>(null)

    const onComplete = async (url: string, name: string) => {
        setAttachmentUrl(url)
        setIsEditing(false)
        router.refresh()
    }

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Lesson Attachment
                <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
                    {isEditing && <>Cancel</>}
                    {!isEditing && !attachmentUrl && (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add attachment
                        </>
                    )}
                    {!isEditing && attachmentUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit attachment
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !attachmentUrl ? (
                    <div className="flex items-center justify-center h-40 bg-slate-200 dark:bg-slate-800 rounded-md mt-2">
                        <FileText className="h-10 w-10 text-slate-500" />
                    </div>
                ) : (
                    <div className="flex items-center p-3 w-full bg-sky-100 dark:bg-sky-900 border-sky-200 dark:border-sky-800 border text-sky-700 dark:text-sky-300 rounded-md mt-2">
                        <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                        <a href={attachmentUrl} target="_blank" rel="noreferrer" className="text-xs line-clamp-1 hover:underline">
                            View Attachment
                        </a>
                    </div>
                )
            )}
            {isEditing && (
                <div className="mt-4">
                    <AttachmentUploader
                        lessonId={lessonId}
                        onComplete={onComplete}
                    />
                    <div className="text-xs text-muted-foreground mt-4">
                        Note: Files over 50MB may fail. Ensure your "attachments" bucket exists.
                    </div>
                </div>
            )}
        </div>
    )
}
