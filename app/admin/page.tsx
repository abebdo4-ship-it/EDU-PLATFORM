// app/admin/page.tsx
import { createClient } from '@/lib/supabase/server'
import { BookOpen, Users, DollarSign, Activity, ArrowUpRight } from 'lucide-react'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
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

    // 2. Fetch Aggregated Metrics
    // Users count
    const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

    // Published courses count
    const { count: publishedCoursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')

    // Pending courses count
    const { count: pendingCoursesCount } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending_approval')

    // Total Revenue (approximate from purchases)
    const { data: purchases } = await supabase
        .from('purchases')
        .select('price')

    const totalRevenue = purchases?.reduce((acc, curr) => acc + (curr.price || 0), 0) || 0

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    Platform Overview
                </h1>
                <p className="text-muted-foreground mt-2">
                    Key metrics and platform health at a glance.
                </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="Total Revenue"
                    value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue)}
                    icon={<DollarSign className="w-5 h-5" />}
                    gradient="from-emerald-500/20 to-emerald-500/5"
                    iconColor="text-emerald-500"
                />
                <StatusCard
                    title="Total Users"
                    value={usersCount?.toString() || '0'}
                    icon={<Users className="w-5 h-5" />}
                    gradient="from-blue-500/20 to-blue-500/5"
                    iconColor="text-blue-500"
                />
                <StatusCard
                    title="Published Courses"
                    value={publishedCoursesCount?.toString() || '0'}
                    icon={<BookOpen className="w-5 h-5" />}
                    gradient="from-purple-500/20 to-purple-500/5"
                    iconColor="text-purple-500"
                />
                <StatusCard
                    title="Pending Approvals"
                    value={pendingCoursesCount?.toString() || '0'}
                    icon={<Activity className="w-5 h-5" />}
                    gradient="from-amber-500/20 to-amber-500/5"
                    iconColor="text-amber-500"
                    alert={pendingCoursesCount ? pendingCoursesCount > 0 : false}
                />
            </div>

            {/* Recent Activity Placeholder / Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-border/50 bg-background/40">
                    <h3 className="font-semibold text-lg mb-4">Recent Platform Activity</h3>
                    <div className="flex h-40 items-center justify-center border border-dashed border-border/50 rounded-xl bg-primary/5">
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Activity feed coming soon
                        </p>
                    </div>
                </div>

                <div className="glass-card rounded-2xl p-6 border border-border/50 bg-background/40 flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Needs Attention</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Review courses submitted by instructors to ensure quality standards.
                        </p>
                    </div>

                    <a href="/admin/courses" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium">
                        View Pending Courses
                        <ArrowUpRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    )
}

function StatusCard({
    title,
    value,
    icon,
    gradient,
    iconColor,
    alert = false
}: {
    title: string,
    value: string,
    icon: React.ReactNode,
    gradient: string,
    iconColor: string,
    alert?: boolean
}) {
    return (
        <div className={`relative overflow-hidden rounded-2xl border border-border/50 p-6 glass-card bg-background/40 group transition-all duration-300 hover:border-border/80 ${alert ? 'ring-1 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''}`}>
            {/* Ambient Background Glow */}
            <div className={`absolute top-0 right-0 -m-6 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />

            <div className="relative flex justify-between items-start">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        {title}
                        {alert && <span className="flex w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
                    </p>
                    <p className="text-3xl font-bold tracking-tight text-foreground">
                        {value}
                    </p>
                </div>
                <div className={`p-3 rounded-xl bg-background/50 border border-border/50 backdrop-blur-sm ${iconColor} ${alert ? 'animate-bounce' : ''}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}
