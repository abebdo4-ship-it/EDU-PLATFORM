"use client";

import { useRef } from "react";
import { VideoPlayer } from "@/components/course/video-player";
import { NotesWidget } from "@/components/course/notes-widget";
import { QuizPlayer } from "@/components/course/quiz-player";

interface LessonViewerProps {
    lesson: any;
    courseId: string;
    isLocked: boolean;
    completeOnFinish: boolean;
    userProgress: any;
    quiz?: any;
    initialNotes: any[];
}

export const LessonViewer = ({
    lesson,
    courseId,
    isLocked,
    completeOnFinish,
    userProgress,
    quiz,
    initialNotes,
}: LessonViewerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                {lesson.type === 'video' ? (
                    <VideoPlayer
                        lessonId={lesson.id}
                        courseId={courseId}
                        title={lesson.title}
                        playbackId={lesson.mux_playback_id}
                        videoUrl={lesson.video_url}
                        isLocked={isLocked}
                        completeOnFinish={completeOnFinish}
                        videoRef={videoRef}
                    />
                ) : lesson.type === 'quiz' && quiz ? (
                    <QuizPlayer
                        quizId={quiz.id}
                        title={quiz.title}
                        questions={quiz.questions}
                        passingScore={quiz.passing_score}
                    />
                ) : null}
            </div>

            {lesson.type === 'video' && (
                <div className="w-full lg:w-[350px] shrink-0">
                    <NotesWidget
                        lessonId={lesson.id}
                        initialNotes={initialNotes}
                        videoRef={videoRef}
                    />
                </div>
            )}
        </div>
    );
}
