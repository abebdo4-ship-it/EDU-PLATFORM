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
            <div className="relative aspect-video flex flex-col items-center justify-center glass-card rounded-2xl overflow-hidden text-white gap-y-4 shadow-xl">
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-0" />
                <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full glass flex items-center justify-center mb-4">
                        <Lock className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-lg font-medium tracking-tight">This lesson is locked.</p>
                    <p className="text-sm text-slate-400">Enroll in the course to access</p>
                </div>
            </div>
        )
    }

    if (!videoUrl) {
        return (
            <div className="relative aspect-video flex items-center justify-center glass-card rounded-2xl overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm z-0" />
                <p className="relative z-10 text-lg font-medium text-slate-300">No video available</p>
            </div>
        )
    }

    return (
        <div className="relative group">
            {/* Ambient glow behind video */}
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-primary/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-700 pointer-events-none" />

            <div className="relative aspect-video rounded-2xl overflow-hidden glass-card shadow-2xl border border-white/10 dark:border-white/5 z-10">
                <video
                    ref={videoRef}
                    controls
                    className="w-full h-full object-cover bg-black"
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
        </div>
    )
}
