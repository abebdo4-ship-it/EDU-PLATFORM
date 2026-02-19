export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EnrollButton } from "@/components/course/enroll-button";

export default async function CourseIdPage({
    params
}: {
    params: Promise<{ courseId: string; }>
}) {
    const { courseId } = await params;
    const supabase = await createClient();

    const { data: course } = await supabase
        .from("courses")
        .select("*, sections(*, lessons(*))")
        .eq("id", courseId)
        .single();

    if (!course) {
        return redirect("/");
    }

    // Check enrollment
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("course_id", courseId)
        .single();

    if (enrollment) {
        // Sort logically for redirect
        course.sections.sort((a: any, b: any) => a.position - b.position);
        course.sections.forEach((section: any) => {
            section.lessons.sort((a: any, b: any) => a.position - b.position);
        });

        // Redirect to first lesson
        const firstLesson = course.sections[0]?.lessons[0];
        if (firstLesson) {
            return redirect(`/courses/${courseId}/lessons/${firstLesson.id}`);
        }

        // If enrolled but no lessons, show a message
        return (
            <div className="flex flex-col h-full items-center justify-center p-6 text-center">
                <h1 className="text-2xl font-bold mb-2">Welcome to {course.title}</h1>
                <p className="text-muted-foreground mb-4">This course has no published lessons yet.</p>
            </div>
        );
    }

    // Not enrolled: Show Landing Page
    return (
        <div className="flex flex-col h-full items-center justify-center p-6 text-center max-w-2xl mx-auto">
            {course.image_url && (
                <img src={course.image_url} alt={course.title} className="w-full h-64 object-cover rounded-lg mb-6 shadow-md" />
            )}
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-muted-foreground mb-6 text-lg">{course.description}</p>

            <div className="bg-slate-100 p-6 rounded-lg w-full dark:bg-slate-800">
                <p className="text-2xl font-bold mb-4">
                    {course.price ? `$${course.price}` : "Free"}
                </p>
                {/* Enroll Button Component would go here */}
                <EnrollButton courseId={courseId} price={course.price} />
            </div>
        </div>
    );
}
