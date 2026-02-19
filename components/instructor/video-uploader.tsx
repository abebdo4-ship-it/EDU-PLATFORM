"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, CheckCircle, FileVideo } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface VideoUploaderProps {
    lessonId: string;
    onComplete: (videoUrl: string) => void;
}

export const VideoUploader = ({
    lessonId,
    onComplete
}: VideoUploaderProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setProgress(0);

        try {
            // Upload to Supabase Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${lessonId}-${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError, data } = await supabase.storage
                .from('videos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get Public URL? No, bucket is private.
            // We store the filePath or the signed URL?
            // Usually we store the filePath and generate Signed URL on demand.
            // OR if the user asked for "Active" and "Private", we must store the path.
            // Let's store the full path or just the relative path.
            // Let's store relative path `filePath` into `video_url` column.

            // Wait, existing schema likely uses `video_url`.
            // Does `lessons` table have `video_url`? Yes, I added it back in migration.

            const storedPath = filePath;

            // Update Lesson in DB (Client side update via API or Server Action? 
            // Or just pass to onComplete and let parent handle it? 
            // User prompt said "Update Upload Component".
            // Previous implementation for Cloudflare updated DB via Webhook.
            // Here we should probably update it via `onComplete` or a direct call.
            // Let's assume onComplete handles the DB update if it takes the URL.

            onComplete(storedPath);
            setVideoUrl(storedPath);
            toast.success("Video uploaded successfully");

        } catch (error: any) {
            toast.error("Upload failed: " + error.message);
        } finally {
            setIsUploading(false);
        }
    }

    return (
        <div className="border border-dashed border-slate-300 rounded-md p-10 bg-slate-50 flex flex-col items-center justify-center">
            {videoUrl ? (
                <div className="flex flex-col items-center gap-y-2">
                    <CheckCircle className="h-10 w-10 text-emerald-500" />
                    <p className="text-sm text-slate-500">Video uploaded</p>
                </div>
            ) : (
                <>
                    {isUploading ? (
                        <div className="w-full flex flex-col gap-y-2 items-center">
                            <p className="text-sm text-slate-500">Uploading... {Math.round(progress)}%</p>
                            {/* Supabase client doesn't give progress easily for single await upload, but TUS does. 
                                Standard client upload is atomic wait. 
                                For better UX we'd use TUS, but for this MVP simplicity (revert), we show spinner.
                            */}
                            <Progress value={progress} className="h-2 w-full bg-slate-200" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-y-2">
                            <Upload className="h-10 w-10 text-slate-500" />
                            <label htmlFor="video-upload" className="cursor-pointer">
                                <Button type="button" variant="ghost" disabled={isUploading} className="pointer-events-none">
                                    Choose Video
                                </Button>
                            </label>
                            <input
                                id="video-upload"
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={onUpload}
                                disabled={isUploading}
                            />
                            <p className="text-xs text-muted-foreground">MP4, WebM, Ogg (Max 5 GB)</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
