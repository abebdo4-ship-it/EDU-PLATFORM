export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { AIAssistant } from "@/components/ai-assistant";
import { getNotes } from "@/actions/notes";
import { LessonViewer } from "@/components/course/lesson-viewer";
// import { CourseProgressButton } from "./_components/course-progress-button";

export default async function LessonIdPage({
    params
}: {
    params: Promise<{ courseId: string; lessonId: string; }>
}) {
    const { courseId, lessonId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/");
    }

    const { data: lesson, error } = await supabase
        .from("lessons")
        .select("*, section:sections(id, title), course:courses(price)")
        .eq("id", lessonId)
        .single();

    if (!lesson || error) {
        return redirect(`/courses/${courseId}`);
    }

    const { data: userProgress } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("lesson_id", lessonId)
        .eq("user_id", user.id)
        .single();

    // Fetch quiz data if it's a quiz lesson
    let quiz = null;
    if (lesson.type === 'quiz') {
        const { data: quizData } = await supabase
            .from('quizzes')
            .select(`
            *,
            questions (
                id,
                text,
                points,
                answers (
                    id,
                    text
                )
            )
        `)
            .eq('lesson_id', lesson.id) // Assuming lesson_id is foreign key on quizzes
            .single();

        quiz = quizData;
        // Sort questions and answers
        if (quiz) {
            // Sort questions by some order if available, else standard
            // quiz.questions.sort(...)
        }
    }

    const initialNotes = await getNotes(lessonId);

    const isLocked = !lesson.is_free && false; // Check purchase logic later

    return (
        <div className="flex flex-col max-w-7xl mx-auto pb-20">
            <div className="p-4 w-full">
                <LessonViewer
                    lesson={lesson}
                    courseId={courseId}
                    isLocked={isLocked}
                    completeOnFinish={true}
                    userProgress={userProgress}
                    quiz={quiz}
                    initialNotes={initialNotes}
                />
            </div>
            <div>
                <div className="p-4 flex flex-col md:flex-row items-center justify-between">
                    <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
                    {/* <CourseProgressButton
            lessonId={lessonId}
            courseId={courseId}
            nextLessonId={nextLesson?.id}
            isCompleted={!!userProgress?.is_completed}
          /> */}
                </div>
                <Separator />
                <div className="p-4">
                    {lesson.description && (
                        <div className="prose dark:prose-invert">
                            {lesson.description}
                        </div>
                    )}
                </div>
            </div>
            <AIAssistant
                lessonId={lessonId}
                lessonTitle={lesson.title}
                lessonDescription={lesson.description}
            />
        </div>
    );
}
