export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Separator } from "@/components/ui/separator";
import { AIAssistant } from "@/components/ai-assistant";
import { getNotes } from "@/actions/notes";
import { LessonViewer } from "@/components/course/lesson-viewer";
import { LessonCompleteButton } from "@/components/course/lesson-complete-button";
import { PageTransition } from "@/components/page-transition";

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
        .select("*, section:sections(id, title, position), course:courses(price)")
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
            .eq('lesson_id', lesson.id)
            .single();

        quiz = quizData;
    }

    const initialNotes = await getNotes(lessonId);
    const isLocked = !lesson.is_free && false; // Check purchase logic later

    // --- Next Lesson Logic ---
    let nextLessonId = null;

    // 1. Check next lesson in same section
    const { data: nextInSameSection } = await supabase
        .from('lessons')
        .select('id')
        .eq('section_id', lesson.section_id)
        .gt('position', lesson.position)
        .eq('is_published', true)
        .order('position', { ascending: true })
        .limit(1)
        .single();

    if (nextInSameSection) {
        nextLessonId = nextInSameSection.id;
    } else {
        // 2. Check first lesson in next section
        const { data: nextSection } = await supabase
            .from('sections')
            .select('id')
            .eq('course_id', courseId)
            .gt('position', lesson.section.position) // Use the joined section position
            .eq('is_published', true)
            .order('position', { ascending: true })
            .limit(1)
            .single();

        if (nextSection) {
            const { data: firstInNextSection } = await supabase
                .from('lessons')
                .select('id')
                .eq('section_id', nextSection.id)
                .eq('is_published', true)
                .order('position', { ascending: true })
                .limit(1)
                .single();

            if (firstInNextSection) {
                nextLessonId = firstInNextSection.id;
            }
        }
    }

    return (
        <PageTransition className="flex flex-col max-w-[1400px] mx-auto pb-20 px-4 md:px-8 mt-6">
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
                <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-y-4">
                    <h2 className="text-2xl font-semibold mb-2">{lesson.title}</h2>
                    <LessonCompleteButton
                        lessonId={lessonId}
                        courseId={courseId}
                        isCompleted={!!userProgress?.completed}
                        nextLessonId={nextLessonId || undefined}
                    />
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
        </PageTransition>
    );
}
