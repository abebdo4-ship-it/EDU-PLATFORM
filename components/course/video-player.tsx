"use client";

import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

import { RefObject } from "react";

interface VideoPlayerProps {
    playbackId?: string; // Mux or just text URL
    courseId: string;
    lessonId: string;
    title: string;
    isLocked: boolean;
    completeOnFinish: boolean;
    videoUrl?: string;
    onEnd?: () => void;
    videoRef?: RefObject<HTMLVideoElement | null>;
}

export const VideoPlayer = ({
    playbackId,
    courseId,
    lessonId,
    title,
    isLocked,
    completeOnFinish,
    videoUrl,
    onEnd,
    videoRef,
}: VideoPlayerProps) => {
    const [isReady, setIsReady] = useState(false);

    return (
        <div className="relative aspect-video">
            {!isReady && !isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                    <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                </div>
            )}
            {isLocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 flex-col gap-y-2 text-secondary">
                    <Lock className="h-8 w-8" />
                    <p className="text-sm">This lesson is locked</p>
                </div>
            )}
            {!isLocked && (
                <video
                    ref={videoRef}
                    className={cn(
                        "w-full h-full object-cover",
                        !isReady && "hidden"
                    )}
                    controls
                    onLoadedData={() => setIsReady(true)}
                    onEnded={onEnd}
                    src={videoUrl || ""}
                />
            )}
        </div>
    );
}
