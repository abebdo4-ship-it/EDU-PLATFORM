"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Upload, CheckCircle, File, FileText, Anchor } from "lucide-react";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";

interface AttachmentUploaderProps {
    lessonId: string;
    onComplete: (fileUrl: string, fileName: string) => void;
}

export const AttachmentUploader = ({
    lessonId,
    onComplete
}: AttachmentUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);

    const supabase = createClient();

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop: async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setIsUploading(true);
            setProgress(0);
            setIsSuccess(false);

            try {
                // Simulate progress for better UX
                const interval = setInterval(() => {
                    setProgress((prev) => (prev < 90 ? prev + 10 : prev));
                }, 400);

                const fileExt = file.name.split('.').pop();
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                const filePath = `${lessonId}/${Math.random().toString(36).substring(7)}_${safeName}`;

                // Rely on 'attachments' bucket
                const { error: uploadError } = await supabase.storage
                    .from('attachments')
                    .upload(filePath, file, {
                        cacheControl: '3600',
                        upsert: false
                    });

                clearInterval(interval);

                if (uploadError) {
                    throw uploadError;
                }

                setProgress(100);
                setIsSuccess(true);

                // Get the public URL for attachments
                const { data } = supabase.storage.from('attachments').getPublicUrl(filePath);

                onComplete(data.publicUrl, file.name);
                toast.success("Attachment uploaded successfully");

            } catch (error: any) {
                toast.error("Upload failed: " + error.message);
                setProgress(0);
            } finally {
                setIsUploading(false);
            }
        },
        accept: {
            'application/pdf': ['.pdf'],
            'application/zip': ['.zip', '.rar'],
            'text/plain': ['.txt'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.ms-excel': ['.xls', '.xlsx']
        },
        maxFiles: 1,
        maxSize: 50 * 1024 * 1024, // 50MB
        disabled: isUploading,
    });

    return (
        <div
            {...getRootProps()}
            className={`
                border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer
                ${isDragActive ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10' : 'border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-900'}
                ${isDragReject ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : ''}
                ${isUploading ? 'pointer-events-none opacity-80' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
            `}
        >
            <input {...getInputProps()} />

            {isSuccess && !isUploading ? (
                <div className="flex flex-col items-center gap-y-3 animate-in zoom-in duration-300">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-4 rounded-full">
                        <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">File attached!</p>
                </div>
            ) : (
                <>
                    {isUploading ? (
                        <div className="w-full flex flex-col gap-y-4 items-center animate-in fade-in duration-300">
                            <div className="bg-sky-100 dark:bg-sky-900/30 p-4 rounded-full animate-pulse">
                                <FileText className="h-8 w-8 text-sky-600 dark:text-sky-400 animate-bounce" />
                            </div>
                            <div className="w-full max-w-xs space-y-2 text-center">
                                <p className="text-sm font-medium text-sky-600 dark:text-sky-400">
                                    Uploading... {progress}%
                                </p>
                                <Progress value={progress} className="h-2 w-full" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-y-4 text-center">
                            <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-sky-100 dark:bg-sky-900/50' : 'bg-slate-200 dark:bg-slate-800'}`}>
                                <Upload className={`h-8 w-8 ${isDragActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400'}`} />
                            </div>

                            <div className="space-y-1">
                                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                                    {isDragActive ? "Drop your file here" : "Drag attachment here (PDF, ZIP, DOC)"}
                                </h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Max file size: 50 MB
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
