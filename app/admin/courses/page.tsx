import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { ApproveCourseButton, RejectCourseButton } from './actions'

export const dynamic = 'force-dynamic'

export default async function AdminCoursesPage() {
    const supabase = await createClient()

    // 1. Authenticate & Authorize
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    // 2. Fetch all courses that are pending approval or draft
    const { data: courses } = await supabase
        .from('courses')
        .select(`
            id, 
            title, 
            status, 
            created_at, 
            price,
            instructor:profiles!courses_instructor_id_fkey(full_name, id)
        `)
        .order('created_at', { ascending: false })

    const pendingCourses = courses?.filter(c => c.status === 'pending_approval') || []
    const publishedCourses = courses?.filter(c => c.status === 'published') || []
    const otherCourses = courses?.filter(c => c.status === 'draft' || c.status === 'rejected') || []

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Course Approvals
                </h1>
                <p className="text-muted-foreground mt-2">
                    Review and publish courses submitted by instructors.
                </p>
            </div>

            {/* Pending Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-amber-500">
                    <Clock className="w-5 h-5" />
                    Needs Attention ({pendingCourses.length})
                </h2>

                {pendingCourses.length === 0 ? (
                    <div className="glass-card rounded-2xl p-8 border border-border/50 bg-background/40 flex flex-col items-center justify-center text-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500/50 mb-4" />
                        <h3 className="font-semibold text-lg text-foreground">All caught up!</h3>
                        <p className="text-muted-foreground text-sm">There are no courses currently awaiting your approval.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {pendingCourses.map(course => (
                            <CourseRow key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </section>

            {/* Published / Others Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/50">
                <section className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-emerald-500">
                        <CheckCircle className="w-5 h-5" />
                        Recently Published
                    </h2>
                    <div className="space-y-3">
                        {publishedCourses.slice(0, 5).map(course => (
                            <MiniCourseRow key={course.id} course={course} />
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2 text-muted-foreground">
                        <XCircle className="w-5 h-5" />
                        Drafts & Rejected
                    </h2>
                    <div className="space-y-3">
                        {otherCourses.slice(0, 5).map(course => (
                            <MiniCourseRow key={course.id} course={course} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    )
}

function CourseRow({ course }: { course: any }) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between glass-card rounded-xl p-4 border border-border/50 hover:border-primary/30 transition-colors gap-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{course.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        Review Required
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Instructor: {course.instructor?.full_name || 'Unknown'}</span>
                    <span>•</span>
                    <span>{new Date(course.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{course.price === 0 ? 'Free' : `$${course.price}`}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <Link href={`/courses/${course.id}`} target="_blank">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background/50 hover:bg-white/5 border border-border/50 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground">
                        <ExternalLink className="w-4 h-4" />
                        Preview
                    </button>
                </Link>
                <form>
                    <RejectCourseButton courseId={course.id} />
                </form>
                <form>
                    <ApproveCourseButton courseId={course.id} />
                </form>
            </div>
        </div>
    )
}

function MiniCourseRow({ course }: { course: any }) {
    return (
        <div className="flex items-center justify-between p-3 rounded-xl border border-border/30 bg-background/20">
            <div className="min-w-0 flex-1 pr-4">
                <p className="text-sm font-medium text-foreground truncate">{course.title}</p>
                <p className="text-xs text-muted-foreground truncate">{course.instructor?.full_name}</p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border ${course.status === 'published' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    course.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        'bg-muted/30 text-muted-foreground border-border'
                }`}>
                {course.status}
            </span>
        </div>
    )
}
