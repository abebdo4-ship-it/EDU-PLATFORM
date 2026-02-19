import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CourseSidebar } from "@/components/course/course-sidebar";
import { CourseNavbar } from "@/components/course/course-navbar";

export default async function CourseLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ courseId: string }>;
}) {
    const { courseId } = await params;
    const supabase = await createClient();
    const { userId } = { userId: (await supabase.auth.getUser()).data.user?.id }; // Mockauth check

    if (!userId) {
        return redirect("/");
    }

    const { data: course } = await supabase
        .from("courses")
        .select("*, sections(*, lessons(*))")
        .eq("id", courseId)
        .single();

    if (!course) {
        return redirect("/");
    }

    // Sort sections and lessons (simulated since we can't do complex server side ordering easily without rpc sometimes)
    course.sections.sort((a: any, b: any) => a.position - b.position);
    course.sections.forEach((section: any) => {
        section.lessons.sort((a: any, b: any) => a.position - b.position);
    });

    // Calculate progress
    const lessons = course.sections.flatMap((s: any) => s.lessons);
    const totalLessons = lessons.length;

    const { count: completedCount } = await supabase
        .from("lesson_progress")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", userId)
        .eq("is_completed", true)
        .in("lesson_id", lessons.map((l: any) => l.id));

    const progress = totalLessons === 0 ? 0 : Math.round(((completedCount || 0) / totalLessons) * 100);

    const { data: userData } = await supabase.from("profiles").select("full_name").eq("id", userId).single();
    const studentName = userData?.full_name || "Student"; // Fallback

    return (
        <div className="h-full">
            <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
                <CourseNavbar course={course} progressCount={progress} studentName={studentName} />
            </div>
            <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
                <CourseSidebar
                    course={course}
                    progressCount={progress}
                    studentName={studentName}
                />
            </div>
            <main className="md:pl-80 pt-[80px] h-full">
                {children}
            </main>
        </div>
    );
}
