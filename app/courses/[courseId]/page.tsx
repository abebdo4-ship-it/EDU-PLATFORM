export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EnrollButton } from "@/components/course/enroll-button";
import { PageTransition } from "@/components/page-transition";
import { BookOpen, Video, Clock, Award, CheckCircle2 } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";
import { Separator } from "@/components/ui/separator";
import { ReviewSection } from "@/components/course/ReviewSection";

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

    // Fetch Reviews
    const { data: reviews } = await supabase
        .from("reviews")
        .select("*, profiles(full_name)")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

    // Check enrollment
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .eq("course_id", courseId)
        .single();

    if (enrollment) {
        course.sections.sort((a: any, b: any) => a.position - b.position);
        course.sections.forEach((section: any) => {
            section.lessons.sort((a: any, b: any) => a.position - b.position);
        });

        const firstLesson = course.sections[0]?.lessons[0];
        if (firstLesson) {
            return redirect(`/courses/${courseId}/lessons/${firstLesson.id}`);
        }

        return (
            <PageTransition className="flex flex-col h-[80vh] items-center justify-center p-6 text-center">
                <div className="glass-card p-12 rounded-3xl max-w-lg w-full relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl" />
                    <h1 className="text-3xl font-bold mb-4 gradient-text">Welcome to {course.title}</h1>
                    <p className="text-muted-foreground mb-4">This course has no published lessons yet.</p>
                </div>
            </PageTransition>
        );
    }

    // Calculate course stats
    const totalSections = course.sections?.length || 0;
    const totalLessons = course.sections?.reduce((acc: number, section: any) => acc + (section.lessons?.length || 0), 0) || 0;

    return (
        <PageTransition className="flex flex-col min-h-screen pb-20">
            {/* Immersive Hero Header */}
            <div className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center -mt-6 -mx-4 md:-mx-8 px-4 md:px-8 overflow-hidden">
                {/* Blurred backdrop using course image or gradients */}
                <div className="absolute inset-0 bg-slate-900 z-0" />
                {course.image_url ? (
                    <div
                        className="absolute inset-0 opacity-40 blur-xl scale-110 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${course.image_url})` }}
                    />
                ) : (
                    <div className="absolute inset-0 mesh-gradient opacity-80 z-0" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />

                <div className="relative z-20 max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center mt-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 text-white text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            {course.category || "Premium Course"}
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg">
                            {course.title}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-300 max-w-2xl drop-shadow-md">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-4">
                            <div className="flex items-center gap-2 text-white/90">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <span className="font-medium">{totalSections} Sections</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Video className="w-5 h-5 text-purple-400" />
                                <span className="font-medium">{totalLessons} Lessons</span>
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <Award className="w-5 h-5 text-amber-400" />
                                <span className="font-medium">Certificate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content & Sticky Sidebar Layout */}
            <div className="max-w-7xl mx-auto px-4 md:px-0 w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-12 relative">

                {/* Left Column: Syllabus */}
                <div className="md:col-span-2 space-y-8">
                    <h2 className="text-3xl font-bold tracking-tight mb-6">Course Syllabus</h2>
                    <div className="glass-card rounded-2xl overflow-hidden border border-border/50">
                        {course.sections?.sort((a: any, b: any) => a.position - b.position).map((section: any, index: number) => (
                            <div key={section.id} className="group">
                                <div className="p-6 bg-slate-50/50 dark:bg-slate-900/50 group-hover:bg-primary/5 transition-colors">
                                    <div className="flex items-center gap-x-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <h3 className="text-xl font-semibold">{section.title}</h3>
                                    </div>
                                    <div className="space-y-3 pl-11">
                                        {section.lessons?.sort((a: any, b: any) => a.position - b.position).map((lesson: any, lIndex: number) => (
                                            <div key={lesson.id} className="flex items-start gap-x-3 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-transparent group-hover/lesson:border-border transition-colors">
                                                <div className="mt-0.5">
                                                    {lesson.type === 'video' ? (
                                                        <Video className="w-4 h-4 text-sky-500" />
                                                    ) : (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm text-slate-800 dark:text-slate-200">
                                                        {lesson.title}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                                                        {lesson.description || 'No description provided'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {index < course.sections.length - 1 && <Separator />}
                            </div>
                        ))}
                        {(!course.sections || course.sections.length === 0) && (
                            <div className="p-12 text-center text-muted-foreground">
                                No content published for this course yet.
                            </div>
                        )}
                    </div>

                    {/* REVIEWS SECTION */}
                    <div className="mt-12">
                        <ReviewSection
                            courseId={courseId}
                            reviews={reviews || []}
                            isEnrolled={!!enrollment}
                        />
                    </div>
                </div>

                {/* Right Column: Sticky Pricing Sidebar */}
                <div className="relative">
                    <div className="sticky top-24">
                        <div className="glass-card p-6 rounded-3xl relative overflow-hidden group">
                            {/* Ambient background for card */}
                            <div className="absolute -inset-1 bg-gradient-to-br from-primary/30 to-purple-500/30 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />

                            <div className="relative z-10">
                                {course.image_url && (
                                    <div className="w-full aspect-video rounded-2xl overflow-hidden mb-6 border border-border/50 shadow-inner">
                                        <img src={course.image_url} alt={course.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-4xl font-extrabold tracking-tight gradient-text inline-block">
                                            {course.price ? `$${course.price}` : "Free"}
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">Full Lifetime Access</p>
                                    </div>

                                    <EnrollButton courseId={courseId} price={course.price} />

                                    <div className="pt-4 border-t border-border/50 space-y-3">
                                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <Video className="w-4 h-4 text-slate-400" />
                                            <span>On-demand video lessons</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <Award className="w-4 h-4 text-slate-400" />
                                            <span>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                            <CheckCircle2 className="w-4 h-4 text-slate-400" />
                                            <span>Interactive quizzes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </PageTransition>
    );
}
