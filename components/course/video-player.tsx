'use client'

import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";
import React from 'react';

interface VideoPlayerProps {
    lessonId?: string;
    courseId?: string;
    title?: string;
    description?: string;
    playbackId?: string;
    videoUrl?: string; // Correctly typed for Supabase URL
    isLocked?: boolean;
    completeOnFinish?: boolean;
    videoRef?: React.RefObject<HTMLVideoElement | null>;
    onComplete?: () => void;
}

export const VideoPlayer = ({
    lessonId,
    courseId,
    title,
    videoUrl,
    isLocked,
    completeOnFinish,
    videoRef, // Fixed order for clarity
    onComplete,
}: VideoPlayerProps) => {

    if (isLocked) {
        return (
            <div className="relative aspect-video flex flex-col items-center justify-center bg-slate-900 rounded-md text-white gap-y-4">
                <Lock className="h-8 w-8" />
                <p className="text-sm">This lesson is locked.</p>
            </div>
        )
    }

    if (!videoUrl) {
        return (
            <div className="relative aspect-video flex items-center justify-center bg-slate-200 dark:bg-slate-800 rounded-md">
                <p className="text-sm text-muted-foreground">No video available</p>
            </div>
        )
    }

    return (
        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-lg border border-slate-800">
            <video
                ref={videoRef}
                controls
                className="w-full h-full object-contain"
                // poster="/placeholder-video-poster.jpg"
                onEnded={() => {
                    if (completeOnFinish && onComplete) {
                        onComplete();
                    }
                }}
            >
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl} type="video/webm" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}
