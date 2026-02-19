import { createClient } from "@/lib/supabase/server";
import { CourseSidebarItem } from "./course-sidebar-item";

import { CertificateButton } from "@/components/certificate/certificate-button";

interface CourseSidebarProps {
    course: any; // Type properly later
    progressCount: number; // This is actually percentage now
    studentName: string;
}

export const CourseSidebar = async ({
    course,
    progressCount, // percentage
    studentName,
}: CourseSidebarProps) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm bg-white dark:bg-slate-950">
            <div className="p-8 flex flex-col border-b gap-y-4">
                <h1 className="font-semibold">
                    {course.title}
                </h1>
                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progressCount}%` }}></div>
                </div>
                <p className="text-xs text-muted-foreground">{progressCount}% Completed</p>

                <CertificateButton
                    courseId={course.id}
                    courseTitle={course.title}
                    progress={progressCount}
                    studentName={studentName}
                />
            </div>
            <div className="flex flex-col w-full">
                {course.sections.map((section: any) => (
                    <div key={section.id}>
                        <div className="px-4 py-2 text-xs font-semibold uppercase text-muted-foreground bg-slate-50 dark:bg-slate-900/50 mt-2">
                            {section.title}
                        </div>
                        {section.lessons.map((lesson: any) => (
                            <CourseSidebarItem
                                key={lesson.id}
                                id={lesson.id}
                                label={lesson.title}
                                isCompleted={false} // Check progress
                                courseId={course.id}
                                isLocked={!lesson.is_free && false} // Check purchase
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}
