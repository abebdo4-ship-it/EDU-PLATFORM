"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock } from "lucide-react";

interface VideoPlayerProps {
    videoUrl: string; // This is the storage path, e.g. "lesson-123.mp4"
    courseId: string; // Needed for context if we add tracking later
}

export const VideoPlayer = ({
    videoUrl,
    courseId
}: VideoPlayerProps) => {
    const [signedUrl, setSignedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchSignedUrl = async () => {
            try {
                // If videoUrl is already a full URL (legacy), usage might vary.
                // But we assumed we store relative path in `videos` bucket.

                // Check if it's an external URL (e.g. YouTube embed or old public link)
                if (videoUrl.startsWith('http')) {
                    setSignedUrl(videoUrl);
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .storage
                    .from('videos')
                    .createSignedUrl(videoUrl, 3600); // 1 hour expiry

                if (error) {
                    throw error;
                }

                setSignedUrl(data.signedUrl);
            } catch (e: any) {
                console.error("Error signing URL:", e);
                setError("Could not load video");
            } finally {
                setIsLoading(false);
            }
        }

        if (videoUrl) {
            fetchSignedUrl();
        }
    }, [videoUrl]);

    if (isLoading) {
        return (
            <div className="relative aspect-video flex items-center justify-center bg-slate-900 rounded-md">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        )
    }

    if (error || !signedUrl) {
        return (
            <div className="relative aspect-video flex items-center justify-center bg-slate-900 rounded-md text-white flex-col gap-y-2">
                <Lock className="h-8 w-8" />
                <p className="text-sm">Video unavailable</p>
            </div>
        )
    }

    return (
        <div className="relative aspect-video rounded-md overflow-hidden bg-black">
            <video
                controls
                className="absolute inset-0 w-full h-full"
                src={signedUrl}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
            />
        </div>
    );
}
